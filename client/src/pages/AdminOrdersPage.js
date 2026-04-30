import { useEffect, useState } from "react";
import DashboardShell from "../layouts/DashboardShell";
import API from "../services/api";

const STATUS_COLORS = {
  "Хүлээгдэж буй": { background: "rgba(245,166,35,0.1)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.3)" },
  "Батлагдсан": { background: "rgba(80,200,120,0.1)", color: "#4ade80", border: "1px solid rgba(80,200,120,0.3)" },
  "Хүргэгдсэн": { background: "rgba(80,140,255,0.1)", color: "#60a5fa", border: "1px solid rgba(80,140,255,0.3)" },
  "Цуцлагдсан": { background: "rgba(255,80,80,0.1)", color: "#f87171", border: "1px solid rgba(255,80,80,0.3)" },
};

const STATUSES = ["Хүлээгдэж буй", "Батлагдсан", "Хүргэгдсэн", "Цуцлагдсан"];

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    }
  };

  return (
    <DashboardShell title="Захиалгууд" subtitle="Бүх захиалгуудыг удирдах" role="admin">
      {loading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">Уншиж байна...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.length === 0 ? (
            <p className="text-slate-400">Захиалга байхгүй байна.</p>
          ) : orders.map((o) => (
            <div key={o._id} style={{ borderRadius: 20, border: "1px solid rgba(245,166,35,0.12)", background: "white", padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {o.product?.image && (
                  <img src={"http://localhost:5001" + o.product.image} alt={o.product.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", border: "1px solid #e5e7eb" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ fontWeight: 600, margin: 0, color: "#111827" }}>{o.product?.name}</p>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>👤 {o.user?.fullName} · {o.user?.email}</p>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{o.quantity} ширхэг · {o.totalPrice?.toLocaleString()}₮</p>
                  {o.note && <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>"{o.note}"</p>}
                  <p style={{ fontSize: 11, color: "#d1d5db", margin: 0 }}>{new Date(o.createdAt).toLocaleDateString("mn-MN")}</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span style={{ borderRadius: 10, padding: "3px 10px", fontSize: 12, fontWeight: 600, ...STATUS_COLORS[o.status] }}>{o.status}</span>
                <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  style={{ backgroundColor: "#ffffff", color: "#1a1a1a", borderRadius: 10, border: "1.5px solid #e5e7eb", padding: "6px 12px", fontSize: 12, outline: "none", cursor: "pointer" }}>
                  {STATUSES.map((s) => <option key={s} value={s} style={{ backgroundColor: "#ffffff", color: "#1a1a1a" }}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

export default AdminOrdersPage;