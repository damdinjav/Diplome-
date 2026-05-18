import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Zap, Package, Tag, Layers, MapPin, Phone, CreditCard } from "lucide-react";
import API from "../services/api";

const PAYMENT_METHODS = ["Карт", "QPay"];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Карт");
  const [orderLoading, setOrderLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Бүтээгдэхүүн олдсонгүй");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOrder = async () => {
    setMessage("");
    setError("");

    if (!address.trim()) {
      setError("Хүргэх хаягаа оруулна уу");
      return;
    }
    if (!phone.trim()) {
      setError("Утасны дугаараа оруулна уу");
      return;
    }
    if (!/^[0-9]{8,15}$/.test(phone.replace(/\s/g, ""))) {
      setError("Зөв утасны дугаар оруулна уу");
      return;
    }

    try {
      setOrderLoading(true);
      await API.post("/orders", {
        productId: product._id,
        quantity,
        note,
        address,
        phone,
        paymentMethod,
      });
      setMessage("Захиалга амжилттай үүслээ! 🎉");
      // Талбаруудыг цэвэрлэх
      setAddress("");
      setPhone("");
      setNote("");
      setQuantity(1);
    } catch (err) {
      setError(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 16, fontFamily: "sans-serif" }}>
      Уншиж байна...
    </div>
  );

  if (error && !product) return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "sans-serif" }}>
      <p style={{ color: "#dc2626", fontSize: 16 }}>{error}</p>
      <button onClick={() => navigate(-1)} style={{ background: "#F5A623", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: "pointer", color: "#fff" }}>Буцах</button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif", color: "#222" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/xac-logo.png" alt="ХАС" style={{ width: 48, height: 48, objectFit: "cover", flexShrink: 0, borderRadius: "50%" }} />
            <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>ХАС</span>
          </div>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#555", cursor: "pointer" }}>
            <ArrowLeft size={15} /> Буцах
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: "#999", marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ cursor: "pointer", color: "#F5A623" }} onClick={() => navigate("/user-dashboard")}>Нүүр</span>
          <span>›</span>
          <span style={{ cursor: "pointer", color: "#F5A623" }} onClick={() => navigate("/user-dashboard")}>Генераторууд</span>
          <span>›</span>
          <span>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 32 }}>
          {/* Left - Image */}
          <div>
            {product.image ? (
              <img src={"http://localhost:5000" + product.image} alt={product.name} style={{ width: "100%", borderRadius: 12, border: "1px solid #e5e7eb", objectFit: "cover", maxHeight: 400 }} />
            ) : (
              <div style={{ width: "100%", height: 400, background: "#f9f9f9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, border: "1px solid #e5e7eb" }}>⚡</div>
            )}
          </div>

          {/* Right - Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: 24, margin: "0 0 8px", color: "#1a1a1a" }}>{product.name}</h1>
              <p style={{ fontSize: 14, color: "#999", margin: 0 }}>{product.brand}</p>
            </div>

            {/* Price */}
            <div style={{ borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", padding: "16px 0" }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#e8950f" }}>{product.price.toLocaleString()}₮</span>
            </div>

            {/* Specs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <Zap size={15} />, label: "Хүч чадал", value: `${product.powerKW} кВт` },
                { icon: <Tag size={15} />, label: "Брэнд", value: product.brand },
                { icon: <Layers size={15} />, label: "Төрөл", value: product.type },
                { icon: <Package size={15} />, label: "Нөөц", value: product.stock > 0 ? `${product.stock} ширхэг байна` : "Дууссан" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f9f9f9" }}>
                  <span style={{ fontSize: 13, color: "#999", display: "flex", alignItems: "center", gap: 6 }}>{s.icon} {s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16 }}>
                <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.7 }}>{product.description}</p>
              </div>
            )}

            {/* Stock badge */}
            <div>
              <span style={{
                display: "inline-block", borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 700,
                background: product.stock > 0 ? "#f0fdf4" : "#fef2f2",
                color: product.stock > 0 ? "#16a34a" : "#dc2626",
                border: product.stock > 0 ? "1px solid #86efac" : "1px solid #fca5a5"
              }}>
                {product.stock > 0 ? `✓ Нөөцөд байна (${product.stock} ширхэг)` : "✗ Нөөц дууссан"}
              </span>
            </div>

            {/* Order section */}
            {product.stock > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, background: "#fffbf0", borderRadius: 10, padding: 18, border: "1px solid #fde68a" }}>

                {/* Тоо ширхэг */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#555", flexShrink: 0 }}>Тоо ширхэг:</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden", background: "#fff" }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: "#f5f5f5", border: "none", fontSize: 18, cursor: "pointer", color: "#555" }}>−</button>
                    <span style={{ width: 48, textAlign: "center", fontSize: 15, fontWeight: 700 }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={{ width: 36, height: 36, background: "#f5f5f5", border: "none", fontSize: 18, cursor: "pointer", color: "#555" }}>+</button>
                  </div>
                  <span style={{ fontSize: 13, color: "#999" }}>Нийт: <strong style={{ color: "#e8950f" }}>{(product.price * quantity).toLocaleString()}₮</strong></span>
                </div>

                {/* ⭐ Хүргэх хаяг */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <MapPin size={13} /> Хүргэх хаяг *
                  </label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2}
                    placeholder="Жишээ: Улаанбаатар, Сүхбаатар дүүрэг, 1-р хороо, 25-р байр, 14 тоот"
                    style={{ width: "100%", borderRadius: 6, border: "1.5px solid #e5e7eb", padding: "10px 12px", fontSize: 13, outline: "none", resize: "none", fontFamily: "sans-serif", boxSizing: "border-box", background: "#fff" }}
                    onFocus={(e) => e.target.style.border = "1.5px solid #F5A623"}
                    onBlur={(e) => e.target.style.border = "1.5px solid #e5e7eb"}
                  />
                </div>

                {/* ⭐ Утасны дугаар */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <Phone size={13} /> Утасны дугаар *
                  </label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="Жишээ: 99112233"
                    style={{ width: "100%", borderRadius: 6, border: "1.5px solid #e5e7eb", padding: "10px 12px", fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff" }}
                    onFocus={(e) => e.target.style.border = "1.5px solid #F5A623"}
                    onBlur={(e) => e.target.style.border = "1.5px solid #e5e7eb"}
                  />
                </div>

                {/* ⭐ Төлбөрийн хэлбэр */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                    <CreditCard size={13} /> Төлбөрийн хэлбэр *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        style={{
                          borderRadius: 6,
                          border: paymentMethod === method ? "2px solid #F5A623" : "1.5px solid #e5e7eb",
                          background: paymentMethod === method ? "#fff8e1" : "#fff",
                          padding: "10px 12px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: paymentMethod === method ? "#e8950f" : "#555",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Тэмдэглэл */}
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Тэмдэглэл (заавал биш)..."
                  style={{ borderRadius: 6, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 13, outline: "none", resize: "none", fontFamily: "sans-serif", background: "#fff" }}
                  onFocus={(e) => e.target.style.border = "1px solid #F5A623"}
                  onBlur={(e) => e.target.style.border = "1px solid #e5e7eb"}
                />

                {message && <p style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, margin: 0 }}>{message}</p>}
                {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{error}</p>}

                <button onClick={handleOrder} disabled={orderLoading} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  borderRadius: 8, padding: "13px 0", fontSize: 15, fontWeight: 700, border: "none",
                  background: orderLoading ? "#fcd38d" : "#F5A623", color: "#fff", cursor: orderLoading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(245,166,35,0.4)"
                }}>
                  <ShoppingCart size={18} /> {orderLoading ? "Илгээж байна..." : "Захиалах"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;