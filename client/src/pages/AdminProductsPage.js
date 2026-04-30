import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ImageIcon, X } from "lucide-react";
import DashboardShell from "../layouts/DashboardShell";
import API from "../services/api";

const emptyForm = { name: "", brand: "", powerKW: "", type: "", price: "", stock: "", description: "" };

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (product) => {
    setSelectedProduct(product);
    setDetailModal(true);
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
      await fetchProducts();
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
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Алдаа гарлаа");
    }
  };

  return (
    <DashboardShell title="Бүтээгдэхүүн" subtitle="Бүтээгдэхүүнүүдийг удирдах" role="admin">
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 14, background: "linear-gradient(135deg,#F5A623,#e8950f)", border: "none", padding: "10px 20px", fontSize: 14, fontWeight: 700, color: "#0a0800", cursor: "pointer" }}>
          <Plus size={16} /> Бүтээгдэхүүн нэмэх
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">Уншиж байна...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <p className="text-slate-400">Бүтээгдэхүүн байхгүй байна.</p>
          ) : products.map((p) => (
            <div key={p._id} style={{ borderRadius: 24, border: "1px solid #e5e7eb", background: "white", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}
              onClick={() => openDetail(p)}>
              {p.image ? (
                <img src={`http://localhost:5001${p.image}`} alt={p.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 160, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db" }}>
                  <ImageIcon size={32} />
                </div>
              )}
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#111827" }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{p.brand} · {p.type}</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <span style={{ borderRadius: 10, border: "1px solid #fde68a", background: "#fffbeb", padding: "3px 10px", fontSize: 12, color: "#d97706" }}>⚡ {p.powerKW} кВт</span>
                  <span style={{ borderRadius: 10, border: "1px solid #fde68a", background: "#fffbeb", padding: "3px 10px", fontSize: 12, color: "#d97706" }}>💰 {p.price?.toLocaleString()}₮</span>
                  <span style={{ borderRadius: 10, padding: "3px 10px", fontSize: 12, border: p.stock > 0 ? "1px solid #bbf7d0" : "1px solid #fecaca", color: p.stock > 0 ? "#16a34a" : "#dc2626", background: p.stock > 0 ? "#f0fdf4" : "#fef2f2" }}>
                    {p.stock} ширхэг
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openEdit(p)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, border: "1px solid #e5e7eb", background: "white", padding: "8px 0", fontSize: 13, color: "#374151", cursor: "pointer" }}>
                    <Pencil size={14} /> Засах
                  </button>
                  <button onClick={() => handleDelete(p._id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, border: "1px solid #fecaca", background: "#fef2f2", padding: "8px 0", fontSize: 13, color: "#dc2626", cursor: "pointer" }}>
                    <Trash2 size={14} /> Устгах
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && selectedProduct && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 480, borderRadius: 24, background: "white", overflow: "hidden" }}>
            {selectedProduct.image ? (
              <img src={`http://localhost:5001${selectedProduct.image}`} alt={selectedProduct.name} style={{ width: "100%", height: 220, objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: 220, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db" }}>
                <ImageIcon size={48} />
              </div>
            )}
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: 20, margin: 0, color: "#111827" }}>{selectedProduct.name}</h2>
                  <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>{selectedProduct.brand} · {selectedProduct.type}</p>
                </div>
                <button onClick={() => setDetailModal(false)} style={{ border: "none", background: "#f3f4f6", borderRadius: 10, padding: 8, cursor: "pointer", color: "#6b7280" }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span style={{ borderRadius: 10, border: "1px solid #fde68a", background: "#fffbeb", padding: "5px 12px", fontSize: 13, color: "#d97706" }}>⚡ {selectedProduct.powerKW} кВт</span>
                <span style={{ borderRadius: 10, border: "1px solid #fde68a", background: "#fffbeb", padding: "5px 12px", fontSize: 13, color: "#d97706" }}>💰 {selectedProduct.price?.toLocaleString()}₮</span>
                <span style={{ borderRadius: 10, padding: "5px 12px", fontSize: 13, border: selectedProduct.stock > 0 ? "1px solid #bbf7d0" : "1px solid #fecaca", color: selectedProduct.stock > 0 ? "#16a34a" : "#dc2626", background: selectedProduct.stock > 0 ? "#f0fdf4" : "#fef2f2" }}>
                  {selectedProduct.stock > 0 ? `${selectedProduct.stock} ширхэг бэлэн` : "Дууссан"}
                </span>
              </div>
              {selectedProduct.description && (
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{selectedProduct.description}</p>
              )}
              <button onClick={() => setDetailModal(false)} style={{ borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", padding: "11px 0", fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: 16 }}>
          <div style={{ width: "100%", maxWidth: 440, borderRadius: 24, background: "#fff", padding: 24, display: "flex", flexDirection: "column", gap: 14, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ borderBottom: "2px solid #F5A623", paddingBottom: 12 }}>
              <h2 style={{ fontWeight: 800, fontSize: 18, margin: 0, color: "#1a1a1a" }}>{editProduct ? "Бүтээгдэхүүн засах" : "Бүтээгдэхүүн нэмэх"}</h2>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>Зураг</label>
              <label style={{ cursor: "pointer", display: "block" }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12, border: "2px solid #F5A623" }} />
                ) : (
                  <div style={{ width: "100%", height: 160, borderRadius: 12, border: "2px dashed #F5A623", background: "#fffbf0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#F5A623" }}>
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
                <input type={type || "text"} placeholder={placeholder} value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "10px 14px", fontSize: 14, color: "#1a1a1a", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.border = "1.5px solid #F5A623"}
                  onBlur={(e) => e.target.style.border = "1.5px solid #e5e7eb"}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 4 }}>Тайлбар</label>
              <textarea rows={3} placeholder="Бүтээгдэхүүний тайлбар..." value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                style={{ width: "100%", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#f9fafb", padding: "10px 14px", fontSize: 14, color: "#1a1a1a", outline: "none", resize: "none", boxSizing: "border-box" }}
                onFocus={(e) => e.target.style.border = "1.5px solid #F5A623"}
                onBlur={(e) => e.target.style.border = "1.5px solid #e5e7eb"}
              />
            </div>
            {formError && <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>{formError}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", padding: "11px 0", fontSize: 14, fontWeight: 600, color: "#666", cursor: "pointer" }}>Болих</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, borderRadius: 10, border: "none", background: saving ? "#fcd38d" : "linear-gradient(135deg,#F5A623,#e8950f)", padding: "11px 0", fontSize: 14, fontWeight: 700, color: "#0a0800", cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Хадгалж байна..." : editProduct ? "Хадгалах" : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default AdminProductsPage;