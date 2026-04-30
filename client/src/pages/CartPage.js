import { useState } from "react";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../layouts/DashboardShell";
import API from "../services/api";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (cart.length === 0) return;
    try {
      setLoading(true);
      for (const item of cart) {
        await API.post("/orders", {
          productId: item._id,
          quantity: item.quantity,
          note: "",
        });
      }
      clearCart();
      setMessage("Захиалга амжилттай үүслээ!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell title="Миний сагс" subtitle="Захиалахаасаа өмнө сагсаа шалгаарай." role="user">
      {cart.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, gap: 12, color: "#9ca3af" }}>
          <ShoppingCart size={48} />
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Сагс хоосон байна</p>
          <button onClick={() => navigate("/products")}
            style={{ borderRadius: 12, background: "linear-gradient(135deg,#F5A623,#e8950f)", border: "none", padding: "10px 20px", fontSize: 14, fontWeight: 700, color: "#0a0800", cursor: "pointer" }}>
            Генераторууд харах
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
          {message && (
            <div style={{ borderRadius: 16, border: "1px solid rgba(80,200,120,0.3)", background: "rgba(80,200,120,0.1)", padding: "12px 16px", fontSize: 14, color: "#4ade80" }}>
              {message}
            </div>
          )}

          {/* Cart items */}
          {cart.map((item) => (
            <div key={item._id} style={{ borderRadius: 20, border: "1px solid #e5e7eb", background: "white", padding: 16, display: "flex", gap: 16, alignItems: "center" }}>
              {item.image ? (
                <img src={"http://localhost:5001" + item.image} alt={item.name} style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover", border: "1px solid #e5e7eb", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: 12, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>⚡</div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px", color: "#111827" }}>{item.name}</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px" }}>{item.brand} · {item.powerKW} кВт</p>
                <p style={{ fontSize: 13, color: "#d97706", fontWeight: 600, margin: 0 }}>{(item.price * item.quantity).toLocaleString()}₮</p>
              </div>

              {/* Quantity */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#374151" }}>
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, fontSize: 15, minWidth: 20, textAlign: "center", color: "#111827" }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#374151" }}>
                  <Plus size={14} />
                </button>
              </div>

              <button onClick={() => removeFromCart(item._id)}
                style={{ border: "none", background: "#fef2f2", borderRadius: 10, padding: 8, cursor: "pointer", color: "#dc2626", flexShrink: 0 }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Summary */}
          <div style={{ borderRadius: 20, border: "1px solid #fde68a", background: "#fffbeb", padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 13, color: "#92400e", margin: "0 0 4px" }}>Нийт үнэ</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#d97706", margin: 0 }}>{totalPrice.toLocaleString()}₮</p>
            </div>
            <button onClick={handleOrder} disabled={loading}
              style={{ borderRadius: 14, border: "none", background: loading ? "#fcd38d" : "linear-gradient(135deg,#F5A623,#e8950f)", padding: "12px 28px", fontSize: 15, fontWeight: 700, color: "#0a0800", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Захиалж байна..." : "Захиалах"}
            </button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default CartPage;