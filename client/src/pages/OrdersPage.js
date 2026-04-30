import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import DashboardShell from "../layouts/DashboardShell";
import API from "../services/api";

const STATUS_COLORS = {
  "Хүлээгдэж буй": { background: "rgba(245,166,35,0.1)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.3)" },
  "Батлагдсан": { background: "rgba(80,200,120,0.1)", color: "#4ade80", border: "1px solid rgba(80,200,120,0.3)" },
  "Хүргэгдсэн": { background: "rgba(80,140,255,0.1)", color: "#60a5fa", border: "1px solid rgba(80,140,255,0.3)" },
  "Цуцлагдсан": { background: "rgba(255,80,80,0.1)", color: "#f87171", border: "1px solid rgba(255,80,80,0.3)" },
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Захиалгыг цуцлах уу?")) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    }
  };

  return (
    <DashboardShell title="Миний захиалгууд" subtitle="Таны бүх захиалгуудын жагсаалт." role="user">
      {loading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">Уншиж байна...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)" }}>Одоогоор захиалга байхгүй байна.</p>
          ) : orders.map((o) => (
            <div key={o._id} style={{ borderRadius: 20, border: "1px solid rgba(245,166,35,0.12)", background: "rgba(245,166,35,0.03)", padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {o.product?.image && (
                  <img src={"http://localhost:5001" + o.product.image} alt={o.product.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>{o.product?.name}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>{o.quantity} ширхэг · {o.totalPrice?.toLocaleString()}₮</p>
                  {o.note && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>"{o.note}"</p>}
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0 }}>{new Date(o.createdAt).toLocaleDateString("mn-MN")}</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span style={{ borderRadius: 10, padding: "3px 10px", fontSize: 12, fontWeight: 600, ...STATUS_COLORS[o.status] }}>{o.status}</span>
                {o.status === "Хүлээгдэж буй" && (
                  <button onClick={() => handleCancel(o._id)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>
                    <XCircle size={13} /> Цуцлах
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

export default OrdersPage;