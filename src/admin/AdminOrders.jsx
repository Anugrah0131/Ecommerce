// AdminOrders.jsx — FULL PREMIUM UI (Glassmorphic + Drawer + Timeline + Status Editor)
// Place this file at: src/admin/AdminOrders.jsx

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
  Package,
  Truck,
  X,
} from "lucide-react";

// NOTE: this component expects TailwindCSS, framer-motion and lucide-react to be installed.
// API assumptions (adjust if your backend differs):
// GET  http://localhost:8080/api/orders          -> returns array of orders
// GET  http://localhost:8080/api/orders/:id      -> returns single order
// PATCH http://localhost:8080/api/orders/:id     -> accepts { status: 'Shipped' } to update order status

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api/orders";

const STATUS_FLOW = ["Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function currency(v = 0) {
  try {
    return `₹${Number(v).toLocaleString()}`;
  } catch (e) {
    return `₹0`;
  }
}

function StatusBadge({ status }) {
  const color =
    status === "Delivered"
      ? "bg-green-100 text-green-800"
      : status === "Out for Delivery"
      ? "bg-amber-100 text-amber-800"
      : status === "Shipped"
      ? "bg-sky-100 text-sky-800"
      : status === "Packed"
      ? "bg-violet-100 text-violet-800"
      : "bg-gray-100 text-gray-800";
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>{status}</span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(null); // order object
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      const data = await res.json();
      // ensure array
      const arr = Array.isArray(data) ? data : [];
      // normalize: ensure status & amount fields exist
      setOrders(arr.map((o) => ({ ...o, status: o.status || o.orderStatus || "Placed", amount: o.amount || o.totalAmount || o.grandTotal || o.total || 0 })));
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial + interval
  useEffect(() => {
    fetchOrders();
    if (!autoRefresh) return;
    const id = setInterval(fetchOrders, 10000);
    return () => clearInterval(id);
  }, [fetchOrders, autoRefresh]);

  // search + filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let temp = orders;
    if (filterStatus) temp = temp.filter((o) => (o.status || "").toLowerCase() === filterStatus.toLowerCase());
    if (q)
      temp = temp.filter((o) => {
        return (
          String(o._id || o.orderId || "").toLowerCase().includes(q) ||
          String(o.shipping?.fullName || o.customerName || o.name || "").toLowerCase().includes(q) ||
          String(o.shipping?.phone || o.phone || "").toLowerCase().includes(q)
        );
      });

    return temp.sort((a, b) => new Date(b.createdAt || b.updatedAt || Date.now()) - new Date(a.createdAt || a.updatedAt || Date.now()));
  }, [orders, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const openDrawer = async (order) => {
    // if order is shallow, fetch fresh details
    if (order && !order.items) {
      try {
        const res = await fetch(`${API_BASE}/${order._id}`);
        if (res.ok) {
          const full = await res.json();
          setSelected(full);
        } else {
          setSelected(order);
        }
      } catch (e) {
        setSelected(order);
      }
    } else {
      setSelected(order);
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelected(null);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      // optimistic update locally
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      // if details open, refresh
      if (selected && selected._id === orderId) {
        try {
          const r2 = await fetch(`${API_BASE}/${orderId}`);
          if (r2.ok) {
            const full = await r2.json();
            setSelected(full);
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
      alert("Could not update order status. Check server logs.");
    }
  };

  const goToNext = (order) => {
    const idx = STATUS_FLOW.indexOf(order.status || "Placed");
    if (idx < STATUS_FLOW.length - 1) updateStatus(order._id, STATUS_FLOW[idx + 1]);
  };

  const goToPrev = (order) => {
    const idx = STATUS_FLOW.indexOf(order.status || "Placed");
    if (idx > 0) updateStatus(order._id, STATUS_FLOW[idx - 1]);
  };

  const exportCSV = () => {
    const header = ["OrderID", "Name", "Phone", "Amount", "Status", "CreatedAt"].join(",");
    const rows = filtered.map((o) => [
      `"${o._id || o.orderId || ""}"`,
      `"${(o.shipping?.fullName || o.customerName || o.name || "").replace(/\"/g, '"') }"`,
      `"${o.shipping?.phone || o.phone || ""}"`,
      `"${o.amount || o.total || 0}"`,
      `"${o.status || ""}"`,
      `"${o.createdAt || ""}"`,
    ].join(","));

    const csv = [header].concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Admin — Orders</h1>
            <p className="text-white/70 text-sm mt-1">Manage confirmed & recent orders. Auto-syncs with customer tracking.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/6 backdrop-blur rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-white/80" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search Order ID / Name / Phone"
                className="bg-transparent ml-2 outline-none placeholder-white/60 text-white"
              />
            </div>

            <div className="bg-white/6 rounded-xl px-3 py-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/80" />
              <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="bg-transparent outline-none text-white">
                <option value="">All Statuses</option>
                {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button onClick={() => setAutoRefresh((v) => !v)} className="px-4 py-2 rounded-xl bg-white/6">
              {autoRefresh ? 'Auto' : 'Manual'} Refresh
            </button>

            <button onClick={exportCSV} className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center gap-2">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/6 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-white/80">
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Placed</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="p-6 text-center text-white/70">Loading orders...</td></tr>
                ) : pageItems.length === 0 ? (
                  <tr><td colSpan={7} className="p-6 text-center text-white/70">No orders found.</td></tr>
                ) : (
                  pageItems.map((o) => (
                    <tr key={o._id} className="border-t border-white/8 hover:bg-white/4 transition">
                      <td className="p-3 align-top">
                        <div className="font-mono text-sm">{o._id}</div>
                        <div className="text-xs text-white/70 truncate max-w-[18rem]">Items: { (o.items || []).length }</div>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold">{o.shipping?.fullName || o.customerName || 'Guest'}</div>
                        <div className="text-xs text-white/60">{o.shipping?.phone || o.phone || ''}</div>
                      </td>

                      <td className="p-3 font-bold">{currency(o.amount)}</td>

                      <td className="p-3 capitalize">{(o.paymentMethod || o.payment && o.payment.method) || 'cod'}</td>

                      <td className="p-3"><StatusBadge status={o.status} /></td>

                      <td className="p-3 text-sm text-white/70">{new Date(o.createdAt || Date.now()).toLocaleString()}</td>

                      <td className="p-3 flex gap-2">
                        <button onClick={() => openDrawer(o)} className="px-3 py-2 rounded-lg bg-white/8 hover:bg-white/12"> <Eye size={16}/> View</button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => goToPrev(o)} className="px-2 py-2 rounded-lg bg-white/6" title="Step back">◀</button>
                          <button onClick={() => goToNext(o)} className="px-2 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white" title="Advance status">▶</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-white/70 text-sm">Showing {filtered.length ? ( (page-1)*perPage + 1) : 0 } - { Math.min(page*perPage, filtered.length) } of {filtered.length} orders</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-1 rounded-lg bg-white/6">Prev</button>
              <div className="px-3 py-1 rounded-lg bg-white/6">{page} / {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} className="px-3 py-1 rounded-lg bg-white/6">Next</button>
            </div>
          </div>
        </div>

        {/* Right Drawer */}
        <AnimatePresence>
          {drawerOpen && selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex">
              <div onClick={closeDrawer} className="w-full bg-black/60 backdrop-blur-sm" />

              <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: 'spring', stiffness: 120 }} className="w-[420px] bg-gradient-to-br from-white/6 to-white/4 p-6 text-black shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ArrowLeft className="text-black/50" size={18} onClick={closeDrawer} />
                    <div>
                      <h3 className="font-bold text-lg">Order {selected._id}</h3>
                      <div className="text-sm text-black/60">{new Date(selected.createdAt || Date.now()).toLocaleString()}</div>
                    </div>
                  </div>
                  <button onClick={closeDrawer} className="p-2 rounded-lg bg-white/8"><X /></button>
                </div>

                {/* Customer */}
                <div className="mb-4">
                  <div className="font-semibold">{selected.shipping?.fullName || selected.customerName || 'Guest'}</div>
                  <div className="text-sm text-black/60">{selected.shipping?.address}</div>
                  <div className="text-sm text-black/60">{selected.shipping?.city} {selected.shipping?.state} - {selected.shipping?.pincode}</div>
                  <div className="text-sm text-black/60">Phone: {selected.shipping?.phone}</div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Items</h4>
                  <div className="space-y-2">
                    {(selected.items || []).map((it, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/50/ backdrop-blur rounded p-2">
                        <div className="text-sm">{it.title}</div>
                        <div className="text-sm">{it.quantity} x {currency(it.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <div className="space-y-3">
                    {STATUS_FLOW.map((s, idx) => {
                      const done = STATUS_FLOW.indexOf(selected.status || 'Placed') >= idx;
                      return (
                        <div key={s} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full grid place-items-center ${done ? 'bg-green-500 text-white' : 'bg-white/60 text-black/60'}`}>
                            {done ? <CheckCircle size={16} /> : <Clock size={14} />}
                          </div>
                          <div>
                            <div className={`font-semibold ${done ? 'text-black' : 'text-black/60'}`}>{s}</div>
                            {done && <div className="text-xs text-black/60">Completed</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-black/60">Payment</div>
                    <div className="font-semibold">{selected.paymentMethod || 'cod'}</div>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-black/60">Total</div>
                    <div className="font-extrabold text-lg">{currency(selected.amount)}</div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(selected._id, 'Delivered')} className="flex-1 py-2 rounded-lg bg-green-500 text-white font-semibold">Mark Delivered</button>
                    <button onClick={() => updateStatus(selected._id, 'Out for Delivery')} className="flex-1 py-2 rounded-lg bg-amber-400 text-black font-semibold">Out for Delivery</button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => updateStatus(selected._id, 'Shipped')} className="flex-1 py-2 rounded-lg bg-sky-500 text-white">Mark Shipped</button>
                    <button onClick={() => updateStatus(selected._id, 'Packed')} className="flex-1 py-2 rounded-lg bg-violet-600 text-white">Mark Packed</button>
                  </div>
                </div>

                <div className="text-sm text-black/60 mt-6">Last synced: { lastUpdated ? lastUpdated.toLocaleTimeString() : '—' }</div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
