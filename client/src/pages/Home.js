import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Mountain, Eye, EyeOff, Lock, Mail, User, X, Trash2, Plus, Minus } from "lucide-react";
import API from "../services/api";
import { saveAuth } from "../utils/auth";
import { useCart } from "../context/CartContext";
import Pagination from "../components/Pagination";

function Home() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const [modal, setModal] = useState(null); // 'login' | 'register' | 'cart'
  const [authForm, setAuthForm] = useState({ fullName: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [addedId, setAddedId] = useState(null);

 

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data)).finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      setAuthError("");
      const res = await API.post("/auth/login", { email: authForm.email, password: authForm.password });
      saveAuth(res.data);
      setModal(null);
      navigate(res.data.user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (err) {
      setAuthError(err.response?.data?.message || "Нэвтрэх мэдээлэл буруу байна");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setAuthLoading(true);
      setAuthError("");
      await API.post("/auth/register", authForm);
      navigate("/verify");
    } catch (err) {
      setAuthError(err.response?.data?.message || "Бүртгэлийн алдаа гарлаа");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCheckout = () => {
    setModal("login");
    setAuthError("");
    setAuthForm({ fullName: "", email: "", password: "" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif", color: "#222" }}>

      {/* Top bar */}
      <div style={{ background: "#1a1a1a", padding: "6px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>ХАС Генераторын онлайн захиалгын систем</span>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={() => { setModal("login"); setAuthError(""); setAuthForm({ fullName: "", email: "", password: "" }); }} style={{ fontSize: 12, color: "#F5A623", background: "none", border: "none", cursor: "pointer" }}>Нэвтрэх</button>
          <button onClick={() => { setModal("register"); setAuthError(""); setAuthForm({ fullName: "", email: "", password: "" }); }} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer" }}>Бүртгүүлэх</button>
        </div>
      </div>

      {/* Header */}
      <header style={{ background: "#F5A623", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 20 }}>
          <img src="/xac-logo.png" alt="ХАС" style={{ width: 48, height: 48, objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", maxWidth: 640 }}>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Генератор хайх... (нэр, брэнд, төрөл)"
              style={{ flex: 1, border: "none", borderRadius: "8px 0 0 8px", padding: "11px 16px", fontSize: 14, outline: "none" }}
            />
            <button style={{ background: "#e8950f", border: "none", borderRadius: "0 8px 8px 0", padding: "0 20px", cursor: "pointer" }}>
              <Search size={18} color="#fff" />
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            {/* Cart button */}
            <button onClick={() => setModal("cart")} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.15)", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              <ShoppingCart size={18} /> Сагс
              {totalItems > 0 && (
                <span style={{ position: "absolute", top: -6, right: -6, background: "#dc2626", color: "#fff", borderRadius: 999, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => { setModal("login"); setAuthError(""); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.15)", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              <User size={15} /> Нэвтрэх
            </button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", padding: "0 24px", maxWidth: 1280, margin: "0 auto", display: "flex" }}>
          <span style={{ padding: "10px 0", fontSize: 13, fontWeight: 700, color: "#fff", borderBottom: "2px solid #fff" }}>🔧 Бүх генераторууд</span>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>
            Генераторын жагсаалт
            <span style={{ fontSize: 13, fontWeight: 400, color: "#999", marginLeft: 8 }}>{filtered.length} бүтээгдэхүүн</span>
          </h2>
        </div>

        {loading ? (
          <div style={{ display: "flex", height: 200, alignItems: "center", justifyContent: "center", color: "#999" }}>Уншиж байна...</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {paginated.map((p) => (
                <div key={p._id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column", transition: "box-shadow 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  {p.image ? (
                    <img src={"http://localhost:5001" + p.image} alt={p.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: 180, background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>⚡</div>
                  )}
                  <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>{p.name}</h3>
                      <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{p.brand} · {p.type}</p>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      <span style={{ fontSize: 11, background: "#fff8e1", color: "#d97706", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>⚡ {p.powerKW} кВт</span>
                      <span style={{ fontSize: 11, background: p.stock > 0 ? "#f0fdf4" : "#fef2f2", color: p.stock > 0 ? "#16a34a" : "#dc2626", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>
                        {p.stock > 0 ? `${p.stock} ширхэг` : "Дууссан"}
                      </span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#e8950f" }}>{p.price.toLocaleString()}₮</div>
                    <button onClick={() => handleAddToCart(p)} disabled={p.stock === 0}
                      style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 6, padding: "9px 0", fontSize: 13, fontWeight: 700, border: "none", cursor: p.stock === 0 ? "not-allowed" : "pointer",
                        background: addedId === p._id ? "#16a34a" : p.stock === 0 ? "#f5f5f5" : "#F5A623",
                        color: p.stock === 0 ? "#ccc" : "#fff", transition: "background 0.2s" }}>
                      <ShoppingCart size={14} />
                      {addedId === p._id ? "Нэмэгдлээ ✓" : "Сагсанд нэмэх"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo(0, 0); }} />
          </>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px", textAlign: "center", background: "#fff", marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
          <Mountain size={14} color="#F5A623" />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#F5A623" }}>ХАС Генератор</span>
        </div>
        <p style={{ fontSize: 11, color: "#999", margin: 0 }}>© 2024 ХАС Генераторын онлайн захиалгын систем</p>
      </footer>

      {/* Cart Modal */}
      {modal === "cart" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", background: "rgba(0,0,0,0.5)", padding: 0 }}>
          <div style={{ width: "100%", maxWidth: 420, height: "100vh", background: "#fff", display: "flex", flexDirection: "column", boxShadow: "-8px 0 32px rgba(0,0,0,0.2)" }}>
            {/* Cart header */}
            <div style={{ background: "#F5A623", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                <ShoppingCart size={18} /> Захиалгын сагс ({totalItems})
              </h2>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", gap: 12 }}>
                  <ShoppingCart size={48} style={{ opacity: 0.2 }} />
                  <p style={{ margin: 0 }}>Сагс хоосон байна</p>
                </div>
              ) : cart.map((item) => (
                <div key={item._id} style={{ background: "#f9f9f9", borderRadius: 10, border: "1px solid #e5e7eb", padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
                  {item.image ? (
                    <img src={"http://localhost:5001" + item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 60, height: 60, borderRadius: 8, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>⚡</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 2px" }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: "#e8950f", fontWeight: 700, margin: "0 0 6px" }}>{item.price.toLocaleString()}₮</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: 14, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <p style={{ fontWeight: 800, fontSize: 13, color: "#1a1a1a", margin: 0 }}>{(item.price * item.quantity).toLocaleString()}₮</p>
                    <button onClick={() => removeFromCart(item._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart footer */}
            {cart.length > 0 && (
              <div style={{ padding: 16, borderTop: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, color: "#555" }}>Нийт дүн:</span>
                  <span style={{ fontWeight: 800, fontSize: 18, color: "#e8950f" }}>{totalPrice.toLocaleString()}₮</span>
                </div>
                {orderSuccess ? (
                  <div style={{ borderRadius: 8, background: "#f0fdf4", border: "1px solid #86efac", padding: "12px 16px", textAlign: "center", fontSize: 14, color: "#16a34a", fontWeight: 600 }}>
                    ✅ {orderSuccess}
                  </div>
                ) : (
                  <button onClick={handleCheckout} style={{ width: "100%", borderRadius: 8, border: "none", background: "#F5A623", padding: "14px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 12px rgba(245,166,35,0.3)" }}>
                    Захиалга өгөх →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {(modal === "login" || modal === "register") && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 420, borderRadius: 16, background: "#fff", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ background: "#F5A623", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, margin: 0, color: "#fff" }}>
                {modal === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
              </h2>
              <button onClick={() => setModal(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", marginBottom: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                {["login", "register"].map((t) => (
                  <button key={t} onClick={() => { setModal(t); setAuthError(""); }}
                    style={{ flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", background: modal === t ? "#F5A623" : "#fff", color: modal === t ? "#fff" : "#666" }}>
                    {t === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
                  </button>
                ))}
              </div>

              <form onSubmit={modal === "login" ? handleLogin : handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {modal === "register" && (
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Нэр</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "10px 14px" }}>
                      <User size={15} color="#999" />
                      <input type="text" placeholder="Таны нэр" value={authForm.fullName} onChange={(e) => setAuthForm(p => ({ ...p, fullName: e.target.value }))}
                        style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14 }} />
                    </div>
                  </div>
                )}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Имэйл хаяг</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "10px 14px" }}>
                    <Mail size={15} color="#999" />
                    <input type="email" placeholder="you@example.com" value={authForm.email} onChange={(e) => setAuthForm(p => ({ ...p, email: e.target.value }))}
                      style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Нууц үг</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "10px 14px" }}>
                    <Lock size={15} color="#999" />
                    <input type={showPass ? "text" : "password"} placeholder="Нууц үг" value={authForm.password} onChange={(e) => setAuthForm(p => ({ ...p, password: e.target.value }))}
                      style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14 }} />
                    <button type="button" onClick={() => setShowPass(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                {modal === "login" && (
                  <div style={{ textAlign: "right" }}>
                    <Link to="/forgot-password" style={{ fontSize: 12, color: "#F5A623", textDecoration: "none" }}>Нууц үг мартсан уу?</Link>
                  </div>
                )}
                {authError && (
                  <div style={{ borderRadius: 8, background: "#fef2f2", border: "1px solid #fca5a5", padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                    {authError}
                  </div>
                )}
                <button type="submit" disabled={authLoading} style={{ borderRadius: 8, border: "none", background: authLoading ? "#fcd38d" : "#F5A623", padding: "13px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: authLoading ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(245,166,35,0.3)" }}>
                  {authLoading ? "Түр хүлээнэ үү..." : modal === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;