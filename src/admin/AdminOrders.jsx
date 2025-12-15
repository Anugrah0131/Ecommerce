import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  ArrowLeft,
  Download,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { useUserStore } from "../store/useUserStore";

const API_BASE = "http://localhost:8080/api/orders";

const STATUS_FLOW = ["Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const currency = (v = 0) => `₹${Number(v || 0).toLocaleString()}`;

function StatusBadge({ status }) {
  const map = {
    Delivered: "bg-green-100 text-green-800",
    "Out for Delivery": "bg-amber-100 text-amber-800",
    Shipped: "bg-sky-100 text-sky-800",
    Packed: "bg-violet-100 text-violet-800",
    Placed: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${map[status] || map.Placed}`}>
      {status}
    </span>
  );
}

export default function AdminOrders() {
  /* ✅ LEGAL HOOK USAGE */
  const token = useUserStore((state) => state.token);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(API_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setOrders(
        (Array.isArray(data) ? data : []).map((o) => ({
          ...o,
          status: o.status || o.orderStatus || "Placed",
          amount: o.amount || o.totalAmount || o.grandTotal || 0,
        }))
      );

      setLastUpdated(new Date());
    } catch (e) {
      console.error("Fetch orders failed:", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
    if (!autoRefresh) return;
    const id = setInterval(fetchOrders, 10000);
    return () => clearInterval(id);
  }, [fetchOrders, autoRefresh]);

  /* ================= FILTERING ================= */
  const filtered = useMemo(() => {
    let temp = [...orders];
    if (filterStatus)
      temp = temp.filter((o) => o.status === filterStatus);

    if (search.trim()) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (o) =>
          String(o._id).includes(q) ||
          String(o.shipping?.fullName || "").toLowerCase().includes(q) ||
          String(o.shipping?.phone || "").includes(q)
      );
    }

    return temp.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [orders, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  /* ================= DRAWER ================= */
  const openDrawer = async (order) => {
    try {
      const res = await fetch(`${API_BASE}/${order._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelected(res.ok ? await res.json() : order);
    } catch {
      setSelected(order);
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelected(null);
  };

  /* ================= STATUS UPDATE ================= */
  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_BASE}/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );

      if (selected?._id === orderId) fetchOrders();
    } catch {
      alert("Status update failed");
    }
  };

  const goToNext = (o) =>
    updateStatus(o._id, STATUS_FLOW[STATUS_FLOW.indexOf(o.status) + 1]);

  const goToPrev = (o) =>
    updateStatus(o._id, STATUS_FLOW[STATUS_FLOW.indexOf(o.status) - 1]);

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    const rows = filtered.map(
      (o) =>
        `${o._id},${o.shipping?.fullName || ""},${o.shipping?.phone || ""},${o.amount},${o.status}`
    );
    const csv = ["OrderID,Name,Phone,Amount,Status", ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search..."
          className="bg-white/10 px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-white/10 px-3 py-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          {STATUS_FLOW.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button onClick={exportCSV} className="bg-pink-500 px-4 py-2 rounded">
          <Download size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4">Loading...</td></tr>
            ) : (
              pageItems.map((o) => (
                <tr key={o._id} className="border-t border-white/10">
                  <td className="p-3">{o._id}</td>
                  <td className="p-3">{o.shipping?.fullName}</td>
                  <td className="p-3">{currency(o.amount)}</td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openDrawer(o)}><Eye size={16} /></button>
                    <button onClick={() => goToPrev(o)}>◀</button>
                    <button onClick={() => goToNext(o)}>▶</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && selected && (
          <motion.div className="fixed inset-0 bg-black/60 flex">
            <motion.div className="w-[400px] bg-white p-6 text-black">
              <button onClick={closeDrawer}><X /></button>
              <h2 className="font-bold mt-4">Order {selected._id}</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
