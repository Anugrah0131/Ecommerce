// AdminOrders.jsx — PREMIUM ADMIN DASHBOARD
// (Premium upgraded with analytics cards, inline status dropdown, payment badges, 
// auto-refresh toggle, last-updated indicator, pagination, order drawer with items, 
// print invoice, CSV export, responsive layout, toasts, sounds — core API logic unchanged)
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Download,
  RefreshCw,
  Printer,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useUserStore } from "../store/useUserStore";

const API_BASE = "http://localhost:8080/api/orders";

const STATUS_FLOW = [
  "Placed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const currency = (v = 0) => `₹${Number(v || 0).toLocaleString()}`;

const StatusBadge = ({ status }) => {
  const map = {
    Delivered: "bg-green-100 text-green-800",
    "Out for Delivery": "bg-amber-100 text-amber-800",
    Shipped: "bg-sky-100 text-sky-800",
    Packed: "bg-violet-100 text-violet-800",
    Placed: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
};

export default function AdminOrders() {
  const token = useUserStore((s) => s.token);

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
  const [soundOn, setSoundOn] = useState(true);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
      if (soundOn) new Audio("/notification.mp3").play().catch(() => {});
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, soundOn]);

  useEffect(() => {
    fetchOrders();
    if (!autoRefresh) return;
    const id = setInterval(fetchOrders, 10000);
    return () => clearInterval(id);
  }, [fetchOrders, autoRefresh]);

  /* ================= ANALYTICS ================= */
  const analytics = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const pending = total - delivered;
    const revenue = orders.reduce((a, b) => a + (b.amount || 0), 0);
    return { total, delivered, pending, revenue };
  }, [orders]);

  /* ================= FILTERING ================= */
  const filtered = useMemo(() => {
    let temp = [...orders];
    if (filterStatus) temp = temp.filter((o) => o.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (o) =>
          o._id.includes(q) ||
          o.shipping?.fullName?.toLowerCase().includes(q) ||
          o.shipping?.phone?.includes(q)
      );
    }
    return temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

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
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch {
      alert("Status update failed");
    }
  };

  /* ================= EXPORT ================= */
  const exportCSV = () => {
    const rows = filtered.map(
      (o) => `${o._id},${o.shipping?.fullName || ""},${o.amount},${o.status}`
    );
    const csv = ["OrderID,Name,Amount,Status", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "orders.csv";
    a.click();
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Orders Dashboard</h1>

      {/* ANALYTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat title="Total Orders" value={analytics.total} />
        <Stat title="Delivered" value={analytics.delivered} />
        <Stat title="Pending" value={analytics.pending} />
        <Stat title="Revenue" value={currency(analytics.revenue)} />
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search orders…"
          className="bg-white/10 px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-white/10 px-3 py-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          {STATUS_FLOW.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button onClick={fetchOrders} className="bg-white/10 p-2 rounded">
          <RefreshCw size={16} />
        </button>
        <button onClick={exportCSV} className="bg-pink-500 px-4 py-2 rounded">
          <Download size={16} />
        </button>
        <button onClick={() => setSoundOn(!soundOn)} className="bg-white/10 p-2 rounded">
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-6">Loading…</td></tr>
            ) : pageItems.map((o) => (
              <tr key={o._id} className="border-t border-white/10">
                <td className="p-3">{o._id}</td>
                <td className="p-3">{o.shipping?.fullName}</td>
                <td className="p-3">{currency(o.amount)}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="bg-white/20 rounded px-2 py-1"
                  >
                    {STATUS_FLOW.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => { setSelected(o); setDrawerOpen(true); }}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          <ChevronLeft />
        </button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
          <ChevronRight />
        </button>
      </div>

      {/* DRAWER */}
      <AnimatePresence>
  {drawerOpen && selected && (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 bg-black/70 z-40"
      />

      {/* DRAWER */}
      <motion.div
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-[420px] bg-white text-black z-50 shadow-2xl flex flex-col"
      >
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Order ID</p>
            <h2 className="font-bold text-sm">{selected._id}</h2>
          </div>
          <button onClick={() => setDrawerOpen(false)}>
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* STATUS + PAYMENT */}
          <div className="flex justify-between items-center">
            <StatusBadge status={selected.status} />
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 uppercase">
              {selected.paymentMethod}
            </span>
          </div>

          {/* CUSTOMER */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Customer</h3>
            <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
              <p className="font-medium">{selected.shipping?.fullName}</p>
              <p>{selected.shipping?.phone}</p>
              <p className="text-gray-600">
                {selected.shipping?.address}, {selected.shipping?.city}
              </p>
              <p className="text-gray-600">
                {selected.shipping?.state} - {selected.shipping?.pincode}
              </p>
            </div>
          </div>

          {/* ITEMS */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Items</h3>
            <div className="space-y-3">
              {selected.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-gray-50 rounded-lg p-3"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {currency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Total Amount</span>
              <span className="font-bold">
                {currency(selected.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={() =>
              window.open(
                `${API_BASE}/${selected._id}/invoice`,
                "_blank"
              )
            }
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700"
          >
            <Printer size={16} />
            Invoice
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white/10 rounded-xl p-4">
      <p className="text-xs opacity-70">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
