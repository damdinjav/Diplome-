import { useEffect, useState } from "react";
import { ShoppingCart, Clock, XCircle, Search, Zap, User, LogOut } from "lucide-react";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import API from "../services/api";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
  "Хүлээгдэж буй": { background: "#fff8e1", color: "#f59e0b", border: "1px solid #fcd34d" },
  "Батлагдсан": { background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac" },
  "Хүргэгдсэн": { background: "#eff6ff", color: "#2563eb", border: "1px solid #93c5fd" },
  "Цуцлагдсан": { background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5" },
};

const ITEMS_PER_PAGE = 8;

function UserDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        API.get("/products"),
        API.get("/orders/my"),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setNote("");
    setMessage("");
    setModal(true);
  };

  const handleOrder = async () => {
    try {
      setOrderLoading(true);
      await API.post("/orders", { productId: selectedProduct._id, quantity, note });
      setModal(false);
      setMessage("Захиалга амжилттай үүслээ!");
      await fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Захиалгыг цуцлах уу?")) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalProductPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice((productPage - 1) * ITEMS_PER_PAGE, productPage * ITEMS_PER_PAGE);
  const totalOrderPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice((orderPage - 1) * ITEMS_PER_PAGE, orderPage * ITEMS_PER_PAGE);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif", color: "#222" }}>

      {/* Top Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40 }}>
        {/* Top bar */}
        <div style={{ background: "#1a1a1a", padding: "6px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>ХАС Генераторын онлайн захиалгын систем</span>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 4 }}>
              <User size={12} /> {user?.fullName}
            </span>
            <button onClick={() => { logout(); navigate("/login"); }} style={{ fontSize: 12, color: "#F5A623", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <LogOut size={12} /> Гарах
            </button>
          </div>
        </div>

        {/* Main header */}
        <div style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: 24, maxWidth: 1280, margin: "0 auto" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <img src="/xac-logo.png" alt="ХАС" style={{ width: 56, height: 56, objectFit: "cover" }} />
          </div>

          {/* Search */}
          <div style={{ flex: 1, display: "flex", maxWidth: 600 }}>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setProductPage(1); setActiveTab("products"); }}
              placeholder="Генератор хайх... (нэр, брэнд, төрөл)"
              style={{ flex: 1, border: "2px solid #F5A623", borderRight: "none", borderRadius: "8px 0 0 8px", padding: "10px 16px", fontSize: 14, outline: "none" }}
            />
            <button style={{ background: "#F5A623", border: "none", borderRadius: "0 8px 8px 0", padding: "0 20px", cursor: "pointer" }}>
              <Search size={18} color="#fff" />
            </button>
          </div>

          {/* My orders button */}
          <button
            onClick={() => setActiveTab("orders")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, border: "1px solid #e5e7eb", background: activeTab === "orders" ? "#F5A623" : "#fff", color: activeTab === "orders" ? "#fff" : "#444", fontWeight: 600, fontSize: 14, cursor: "pointer", flexShrink: 0 }}
          >
            <Clock size={16} /> Миний захиалгууд
            {orders.length > 0 && (
              <span style={{ background: activeTab === "orders" ? "rgba(255,255,255,0.3)" : "#F5A623", color: "#fff", borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{orders.length}</span>
            )}
          </button>
        </div>

        {/* Nav tabs */}
        <div style={{ borderTop: "1px solid #f0f0f0", padding: "0 24px", display: "flex", gap: 0, maxWidth: 1280, margin: "0 auto" }}>
          {["products", "orders"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "12px 20px", fontSize: 13, fontWeight: 600, border: "none", background: "none", cursor: "pointer",
              color: activeTab === tab ? "#F5A623" : "#666",
              borderBottom: activeTab === tab ? "2px solid #F5A623" : "2px solid transparent",
            }}>
              {tab === "products" ? "🔧 Генераторууд" : "📋 Захиалгууд"}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        {message && (
          <div style={{ marginBottom: 16, borderRadius: 8, border: "1px solid #86efac", background: "#f0fdf4", padding: "12px 16px", fontSize: 14, color: "#16a34a" }}>
            ✅ {message}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", height: 200, alignItems: "center", justifyContent: "center", color: "#999", fontSize: 16 }}>Уншиж байна...</div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === "products" && (
              <>
                <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h2 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>
                    Генераторын жагсаалт
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#999", marginLeft: 8 }}>{filtered.length} бүтээгдэхүүн</span>
                  </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {paginatedProducts.length === 0 ? (
                    <p style={{ color: "#999" }}>Бүтээгдэхүүн олдсонгүй.</p>
                  ) : paginatedProducts.map((p) => (
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
                          <h3 onClick={() => navigate("/product/" + p._id)} style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: "#1a1a1a", cursor: "pointer" }}>{p.name}</h3>
                          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{p.brand} · {p.type}</p>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          <span style={{ fontSize: 11, background: "#fff8e1", color: "#d97706", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>⚡ {p.powerKW} кВт</span>
                          <span style={{ fontSize: 11, background: p.stock > 0 ? "#f0fdf4" : "#fef2f2", color: p.stock > 0 ? "#16a34a" : "#dc2626", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>
                            {p.stock > 0 ? `${p.stock} ширхэг` : "Дууссан"}
                          </span>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#e8950f" }}>{p.price.toLocaleString()}₮</div>
                        <button
                          onClick={() => openModal(p)}
                          disabled={p.stock === 0}
                          style={{
                            marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            borderRadius: 6, padding: "9px 0", fontSize: 13, fontWeight: 700, border: "none",
                            cursor: p.stock === 0 ? "not-allowed" : "pointer",
                            background: p.stock === 0 ? "#f5f5f5" : "#F5A623",
                            color: p.stock === 0 ? "#ccc" : "#fff",
                          }}
                        >
                          <ShoppingCart size={14} /> Захиалах
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination currentPage={productPage} totalPages={totalProductPages} onPageChange={(p) => { setProductPage(p); window.scrollTo(0, 0); }} />
              </>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <>
                <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Миний захиалгууд</h2>
                {paginatedOrders.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#999" }}>
                    <Clock size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                    <p>Одоогоор захиалга байхгүй байна.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {paginatedOrders.map((o) => (
                      <div key={o._id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: 16, display: "flex", alignItems: "center", gap: 16 }}>
                        {o.product?.image && (
                          <img src={"http://localhost:5001" + o.product.image} alt={o.product?.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb", flexShrink: 0 }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>{o.product?.name}</p>
                          <p style={{ fontSize: 13, color: "#666", margin: "0 0 4px" }}>{o.quantity} ширхэг · <span style={{ color: "#e8950f", fontWeight: 700 }}>{o.totalPrice.toLocaleString()}₮</span></p>
                          {o.note && <p style={{ fontSize: 12, color: "#999", margin: "0 0 4px" }}>"{o.note}"</p>}
                          <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>{new Date(o.createdAt).toLocaleDateString("mn-MN")}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                          <span style={{ borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 700, ...STATUS_COLORS[o.status] }}>{o.status}</span>
                          {o.status === "Хүлээгдэж буй" && (
                            <button onClick={() => handleCancel(o._id)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}>
                              <XCircle size={13} /> Цуцлах
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Pagination currentPage={orderPage} totalPages={totalOrderPages} onPageChange={(p) => { setOrderPage(p); window.scrollTo(0, 0); }} />
              </>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Order Modal */}
      {modal && selectedProduct && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 480, borderRadius: 12, background: "#fff", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
            {/* Modal header */}
            <div style={{ background: "#F5A623", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, margin: 0, color: "#fff" }}>Захиалга өгөх</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Product info */}
              <div style={{ display: "flex", gap: 12, background: "#f9f9f9", borderRadius: 8, padding: 12, border: "1px solid #e5e7eb" }}>
                {selectedProduct.image && (
                  <img src={"http://localhost:5001" + selectedProduct.image} alt={selectedProduct.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
                )}
                <div>
                  <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{selectedProduct.name}</p>
                  <p style={{ fontSize: 13, color: "#999", margin: "0 0 4px" }}>{selectedProduct.brand} · {selectedProduct.powerKW} кВт</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#e8950f", margin: 0 }}>{selectedProduct.price.toLocaleString()}₮</p>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Тоо ширхэг</label>
                <input type="number" min={1} max={selectedProduct.stock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: "100%", borderRadius: 6, border: "1.5px solid #e5e7eb", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.border = "1.5px solid #F5A623"}
                  onBlur={(e) => e.target.style.border = "1.5px solid #e5e7eb"}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Тэмдэглэл (заавал биш)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Нэмэлт хүсэлт..."
                  style={{ width: "100%", borderRadius: 6, border: "1.5px solid #e5e7eb", padding: "10px 14px", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.border = "1.5px solid #F5A623"}
                  onBlur={(e) => e.target.style.border = "1.5px solid #e5e7eb"}
                />
              </div>

              <div style={{ background: "#fff8e1", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 600 }}>
                Нийт үнэ: <span style={{ color: "#e8950f", fontSize: 18, fontWeight: 800 }}>{(selectedProduct.price * quantity).toLocaleString()}₮</span>
              </div>

              {message && <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{message}</p>}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setModal(false)} style={{ flex: 1, borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#fff", padding: "12px 0", fontSize: 14, fontWeight: 600, color: "#666", cursor: "pointer" }}>Болих</button>
                <button onClick={handleOrder} disabled={orderLoading || quantity < 1} style={{ flex: 1, borderRadius: 6, border: "none", background: orderLoading ? "#fcd38d" : "#F5A623", padding: "12px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: orderLoading ? "not-allowed" : "pointer" }}>
                  {orderLoading ? "Илгээж байна..." : "Захиалах"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;