import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package, ClipboardList, ImageIcon, LogOut, Zap } from "lucide-react";
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

const STATUSES = ["Хүлээгдэж буй", "Батлагдсан", "Хүргэгдсэн", "Цуцлагдсан"];
const emptyForm = { name: "", brand: "", powerKW: "", type: "", price: "", stock: "", description: "" };
const ITEMS_PER_PAGE = 6;

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        API.get("/orders"),
        API.get("/products"),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
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

  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setFormError("");
    setModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({ name: product.name, brand: product.brand, powerKW: product.powerKW, type: product.type, price: product.price, stock: product.stock, description: product.description || "" });
    setImageFile(null);
    setImagePreview(product.image ? `http://localhost:5001${product.image}` : "");
    setFormError("");
    setModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.powerKW || !form.type || !form.price) {
      setFormError("Бүх заавал талбарыг бөглөнө үү");
      return;
    }
    try {
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append("image", imageFile);
      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await API.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setModal(false);
      await fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Бүтээгдэхүүнийг устгах уу?")) return;
    try {
      await API.delete(`/products/${id}`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    }
  };

  const totalOrderPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice((orderPage - 1) * ITEMS_PER_PAGE, orderPage * ITEMS_PER_PAGE);
  const totalProductPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice((productPage - 1) * ITEMS_PER_PAGE, productPage * ITEMS_PER_PAGE);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif", color: "#222" }}>

      {/* Top bar */}
      <div style={{ background: "#1a1a1a", padding: "6px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>ХАС Генераторын удирдлагын систем</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>👤 {user?.fullName} · <span style={{ color: "#F5A623" }}>admin</span></span>
          <button onClick={() => { logout(); navigate("/login"); }} style={{ fontSize: 12, color: "#F5A623", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <LogOut size={12} /> Гарах
          </button>
        </div>
      </div>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/xac-logo.png" alt="ХАС" style={{ width: 44, height: 44, objectFit: "cover" }} />
          <div style={{ width: 1, height: 32, background: "#e5e7eb" }} />
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 16, margin: 0, color: '#fff' }}>Админы самбар</h1>
            <p style={{ fontSize: 12, color: "#999", margin: 0 }}>Захиалга болон бүтээгдэхүүн удирдах</p>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{ borderTop: "1px solid #f0f0f0", padding: "0 24px", display: "flex", maxWidth: 1280, margin: "0 auto" }}>
          {[
            { key: "orders", label: "📋 Захиалгууд", count: orders.length },
            { key: "products", label: "📦 Бүтээгдэхүүн", count: null },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: "12px 20px", fontSize: 13, fontWeight: 600, border: "none", background: "none", cursor: "pointer",
              color: activeTab === tab.key ? "#F5A623" : "#666",
              borderBottom: activeTab === tab.key ? "2px solid #F5A623" : "2px solid transparent",
              display: "flex", alignItems: "center", gap: 6
            }}>
              {tab.label}
              {tab.count > 0 && <span style={{ background: "#F5A623", color: "#fff", borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{tab.count}</span>}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        {loading ? (
          <div style={{ display: "flex", height: 200, alignItems: "center", justifyContent: "center", color: "#999" }}>Уншиж байна...</div>
        ) : (
          <>
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {paginatedOrders.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#999" }}>
                    Захиалга байхгүй байна.
                  </div>
                ) : paginatedOrders.map((o) => (
                  <div key={o._id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {o.product?.image && (
                        <img src={`http://localhost:5001${o.product.image}`} alt={o.product.name} style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", border: "1px solid #e5e7eb", flexShrink: 0 }} />
                      )}
                      <div>
                        <p style={{ fontWeight: 700, margin: "0 0 3px", fontSize: 15 }}>{o.product?.name}</p>
                        <p style={{ fontSize: 12, color: "#999", margin: "0 0 3px" }}>👤 {o.user?.fullName} · {o.user?.email}</p>
                        <p style={{ fontSize: 13, color: "#555", margin: "0 0 3px" }}>{o.quantity} ширхэг · <span style={{ color: "#e8950f", fontWeight: 700 }}>{o.totalPrice?.toLocaleString()}₮</span></p>
                        {o.note && <p style={{ fontSize: 12, color: "#999", margin: 0 }}>"{o.note}"</p>}
                        <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>{new Date(o.createdAt).toLocaleDateString("mn-MN")}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{ borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 700, ...STATUS_COLORS[o.status] }}>{o.status}</span>
                      <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        style={{ borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", padding: "6px 10px", fontSize: 12, outline: "none", cursor: "pointer" }}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                <Pagination currentPage={orderPage} totalPages={totalOrderPages} onPageChange={(p) => { setOrderPage(p); window.scrollTo(0, 0); }} />
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F5A623", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
                    <Plus size={16} /> Бүтээгдэхүүн нэмэх
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                  {paginatedProducts.length === 0 ? (
                    <p style={{ color: "#999" }}>Бүтээгдэхүүн байхгүй байна.</p>
                  ) : paginatedProducts.map((p) => (
                    <div key={p._id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      {p.image ? (
                        <img src={`http://localhost:5001${p.image}`} alt={p.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: 160, background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ImageIcon size={32} color="#ccc" />
                        </div>
                      )}
                      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px" }}>{p.name}</h3>
                          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{p.brand} · {p.type}</p>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          <span style={{ fontSize: 11, background: "#fff8e1", color: "#d97706", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>⚡ {p.powerKW} кВт</span>
                          <span style={{ fontSize: 11, background: "#f5f5f5", color: "#555", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>💰 {p.price?.toLocaleString()}₮</span>
                          <span style={{ fontSize: 11, background: p.stock > 0 ? "#f0fdf4" : "#fef2f2", color: p.stock > 0 ? "#16a34a" : "#dc2626", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>
                            {p.stock} ширхэг
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEdit(p)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", padding: "7px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            <Pencil size={13} /> Засах
                          </button>
                          <button onClick={() => handleDelete(p._id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 6, border: "1px solid #fca5a5", background: "#fef2f2", padding: "7px 0", fontSize: 12, fontWeight: 600, color: "#dc2626", cursor: "pointer" }}>
                            <Trash2 size={13} /> Устгах
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination currentPage={productPage} totalPages={totalProductPages} onPageChange={(p) => { setProductPage(p); window.scrollTo(0, 0); }} />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Product Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 480, borderRadius: 12, background: "#fff", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ background: "#F5A623", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, margin: 0, color: '#fff', color: "#fff" }}>{editProduct ? "Бүтээгдэхүүн засах" : "Бүтээгдэхүүн нэмэх"}</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 22 }}>×</button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Image upload */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>Зураг</label>
                <label style={{ cursor: "pointer", display: "block" }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, border: "2px solid #F5A623" }} />
                  ) : (
                    <div style={{ width: "100%", height: 160, borderRadius: 8, border: "2px dashed #F5A623", background: "#fffbf0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#F5A623" }}>
                      <ImageIcon size={28} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Зураг сонгох</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
              </div>

              {[
                { label: "Нэр *", key: "name", placeholder: "Жишээ: Honda EU22i" },
                { label: "Брэнд *", key: "brand", placeholder: "Жишээ: Honda" },
                { label: "Хүч (кВт) *", key: "powerKW", placeholder: "Жишээ: 2.2", type: "number" },
                { label: "Төрөл *", key: "type", placeholder: "Жишээ: Инвертор" },
                { label: "Үнэ (₮) *", key: "price", placeholder: "Жишээ: 1500000", type: "number" },
                { label: "Нөөц (ширхэг)", key: "stock", placeholder: "Жишээ: 10", type: "number" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>{label}</label>
                  <input type={type || "text"} placeholder={placeholder} value={form[key]} onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width: "100%", borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => e.target.style.border = "1.5px solid #F5A623"}
                    onBlur={(e) => e.target.style.border = "1.5px solid #e5e7eb"}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Тайлбар</label>
                <textarea rows={3} placeholder="Бүтээгдэхүүний тайлбар..." value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{ width: "100%", borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "10px 14px", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "sans-serif" }}
                  onFocus={(e) => e.target.style.border = "1.5px solid #F5A623"}
                  onBlur={(e) => e.target.style.border = "1.5px solid #e5e7eb"}
                />
              </div>

              {formError && <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{formError}</p>}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setModal(false)} style={{ flex: 1, borderRadius: 6, border: "1.5px solid #e5e7eb", background: "#fff", padding: "11px 0", fontSize: 14, fontWeight: 600, color: "#666", cursor: "pointer" }}>Болих</button>
                <button onClick={handleSave} disabled={saving} style={{ flex: 1, borderRadius: 6, border: "none", background: saving ? "#fcd38d" : "#F5A623", padding: "11px 0", fontSize: 14, fontWeight: 700, color: "#fff", cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Хадгалж байна..." : editProduct ? "Хадгалах" : "Нэмэх"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;2