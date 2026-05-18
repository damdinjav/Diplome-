import { useState } from "react";
import { Trash2, ShoppingCart, Plus, Minus, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../layouts/DashboardShell";
import API from "../services/api";
import { useCart } from "../context/CartContext";

const PAYMENT_METHODS = [
  { id: "qpay", name: "QPay", logo: "https://qpay.mn/q/logo/qpay.png", color: "#1BA2E0" },
  { id: "socialpay", name: "SocialPay", logo: "https://socialpay.mn/assets/img/logo.png", color: "#E31E24" },
  { id: "digipay", name: "Digipay", logo: "https://digipay.mn/assets/logo.png", color: "#F5A623" },
  { id: "happypay", name: "HappyPay", logo: "https://happypay.mn/logo.png", color: "#00B050" },
];

function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentStep, setPaymentStep] = useState("select"); // select | qr | success
  const navigate = useNavigate();

  const handleCheckout = () => {
    setPaymentModal(true);
    setPaymentStep("select");
    setSelectedMethod(null);
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setPaymentStep("qr");
  };

  const handlePaymentConfirm = async () => {
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
      setPaymentStep("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentModal(false);
    setPaymentStep("select");
    setSelectedMethod(null);
    if (paymentStep === "success") {
      navigate("/orders");
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
            <div style={{ borderRadius: 16, border: "1px solid #fca5a5", background: "#fef2f2", padding: "12px 16px", fontSize: 14, color: "#dc2626" }}>
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
            <button onClick={handleCheckout}
              style={{ borderRadius: 14, border: "none", background: "linear-gradient(135deg,#F5A623,#e8950f)", padding: "12px 28px", fontSize: 15, fontWeight: 700, color: "#0a0800", cursor: "pointer" }}>
              Төлбөр хийх →
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 440, borderRadius: 24, background: "#fff", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>

            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg,#F5A623,#e8950f)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, margin: 0, color: "#fff" }}>
                {paymentStep === "select" && "Төлбөрийн арга сонгох"}
                {paymentStep === "qr" && `${selectedMethod?.name} - QR код`}
                {paymentStep === "success" && "Төлбөр амжилттай!"}
              </h2>
              <button onClick={handleClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24 }}>

              {/* Step 1: Select payment method */}
              {paymentStep === "select" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px", textAlign: "center" }}>
                    Нийт дүн: <span style={{ fontWeight: 800, color: "#d97706", fontSize: 16 }}>{totalPrice.toLocaleString()}₮</span>
                  </p>
                  {[
                    { id: "qpay", name: "QPay", color: "#1BA2E0", emoji: "💳" },
                    { id: "socialpay", name: "SocialPay", color: "#E31E24", emoji: "📱" },
                    { id: "digipay", name: "Digipay", color: "#F5A623", emoji: "💰" },
                    { id: "happypay", name: "HappyPay", color: "#00B050", emoji: "😊" },
                  ].map((method) => (
                    <button key={method.id} onClick={() => handleSelectMethod(method)}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderRadius: 14, border: "2px solid #e5e7eb", background: "#fff", cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}
                      onMouseEnter={(e) => { e.currentTarget.style.border = `2px solid ${method.color}`; e.currentTarget.style.background = "#f9fafb"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.border = "2px solid #e5e7eb"; e.currentTarget.style.background = "#fff"; }}
                    >
                      <span style={{ fontSize: 28 }}>{method.emoji}</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15, margin: 0, color: method.color }}>{method.name}</p>
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>QR кодоор төлөх</p>
                      </div>
                      <span style={{ marginLeft: "auto", color: "#d1d5db", fontSize: 18 }}>›</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: QR code */}
              {paymentStep === "qr" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0, textAlign: "center" }}>
                    <span style={{ fontWeight: 700, color: selectedMethod?.color }}>{selectedMethod?.name}</span> апп-аар QR кодыг уншуулна уу
                  </p>

                  {/* QR Code simulation */}
                  <div style={{ padding: 16, background: "#fff", border: "3px solid " + selectedMethod?.color, borderRadius: 16 }}>
                    <svg width="180" height="180" viewBox="0 0 180 180">
                      <rect width="180" height="180" fill="white"/>
                      {/* QR pattern simulation */}
                      <rect x="10" y="10" width="50" height="50" fill="none" stroke="#000" strokeWidth="4"/>
                      <rect x="20" y="20" width="30" height="30" fill="#000"/>
                      <rect x="120" y="10" width="50" height="50" fill="none" stroke="#000" strokeWidth="4"/>
                      <rect x="130" y="20" width="30" height="30" fill="#000"/>
                      <rect x="10" y="120" width="50" height="50" fill="none" stroke="#000" strokeWidth="4"/>
                      <rect x="20" y="130" width="30" height="30" fill="#000"/>
                      {[0,1,2,3,4,5,6,7,8].map(i => (
                        <rect key={i} x={70 + (i%3)*14} y={70 + Math.floor(i/3)*14} width="10" height="10" fill={Math.random() > 0.4 ? "#000" : "#fff"}/>
                      ))}
                      {[0,1,2,3,4,5,6,7].map(i => (
                        <rect key={"r"+i} x={70 + (i%4)*14} y={10 + Math.floor(i/4)*14} width="10" height="10" fill="#000"/>
                      ))}
                      <text x="90" y="168" textAnchor="middle" fontSize="10" fill={selectedMethod?.color} fontWeight="bold">{selectedMethod?.name}</text>
                    </svg>
                  </div>

                  <div style={{ background: "#fffbeb", borderRadius: 12, padding: "12px 16px", width: "100%", textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: "#92400e", margin: "0 0 4px" }}>Төлөх дүн</p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "#d97706", margin: 0 }}>{totalPrice.toLocaleString()}₮</p>
                  </div>

                  <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, textAlign: "center" }}>
                    Төлбөр хийсний дараа доорх товчийг дарна уу
                  </p>

                  <button onClick={handlePaymentConfirm} disabled={loading}
                    style={{ width: "100%", borderRadius: 14, border: "none", background: loading ? "#fcd38d" : "linear-gradient(135deg,#F5A623,#e8950f)", padding: "14px 0", fontSize: 15, fontWeight: 700, color: "#0a0800", cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? "Шалгаж байна..." : "✓ Төлбөр хийгдлээ"}
                  </button>

                  <button onClick={() => setPaymentStep("select")}
                    style={{ background: "none", border: "none", color: "#9ca3af", fontSize: 13, cursor: "pointer" }}>
                    ← Буцах
                  </button>
                </div>
              )}

              {/* Step 3: Success */}
              {paymentStep === "success" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "8px 0" }}>
                  <CheckCircle size={64} color="#16a34a" />
                  <h3 style={{ fontWeight: 800, fontSize: 20, color: "#16a34a", margin: 0 }}>Амжилттай!</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", margin: 0, textAlign: "center" }}>
                    Таны захиалга амжилттай үүслээ. Захиалгын мэдээллийг имэйл рүү илгээлээ.
                  </p>
                  <button onClick={handleClose}
                    style={{ width: "100%", borderRadius: 14, border: "none", background: "linear-gradient(135deg,#16a34a,#15803d)", padding: "14px 0", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
                    Захиалга харах →
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default CartPage;