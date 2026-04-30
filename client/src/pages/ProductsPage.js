import { useEffect, useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import DashboardShell from "../layouts/DashboardShell";
import API from "../services/api";
import { useCart } from "../context/CartContext";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState([]);
  const { addToCart } = useCart();

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

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedIds((prev) => [...prev, product._id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product._id));
    }, 1500);
  };

  return (
    <DashboardShell title="Генераторууд" subtitle="Захиалах генераторыг сонгоно уу." role="user">
      {loading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">Уншиж байна...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <p className="text-slate-400">Бүтээгдэхүүн байхгүй байна.</p>
          ) : products.map((p) => {
            const added = addedIds.includes(p._id);
            return (
              <div key={p._id} style={{ borderRadius: 24, border: "1px solid rgba(245,166,35,0.12)", background: "rgba(245,166,35,0.03)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {p.image ? (
                  <img src={"http://localhost:5001" + p.image} alt={p.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: 128, background: "rgba(245,166,35,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>⚡</div>
                )}
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{p.name}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>{p.brand} · {p.type}</p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ borderRadius: 10, border: "1px solid rgba(245,166,35,0.2)", padding: "3px 10px", fontSize: 12, color: "#F5A623" }}>⚡ {p.powerKW} кВт</span>
                    <span style={{ borderRadius: 10, border: "1px solid rgba(245,166,35,0.2)", padding: "3px 10px", fontSize: 12, color: "#F5A623" }}>💰 {p.price?.toLocaleString()}₮</span>
                    <span style={{ borderRadius: 10, padding: "3px 10px", fontSize: 12, border: p.stock > 0 ? "1px solid rgba(80,200,120,0.3)" : "1px solid rgba(255,80,80,0.3)", color: p.stock > 0 ? "#4ade80" : "#f87171" }}>
                      {p.stock > 0 ? `${p.stock} ширхэг` : "Дууссан"}
                    </span>
                  </div>
                  {p.description && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>{p.description}</p>}
                  <button
                    onClick={() => handleAddToCart(p)}
                    disabled={p.stock === 0}
                    style={{
                      marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      borderRadius: 14, padding: "10px 0", fontSize: 13, fontWeight: 700, border: "none",
                      cursor: p.stock === 0 ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      background: p.stock === 0
                        ? "rgba(245,166,35,0.2)"
                        : added
                        ? "linear-gradient(135deg,#4ade80,#22c55e)"
                        : "linear-gradient(135deg,#F5A623,#e8950f)",
                      color: p.stock === 0 ? "rgba(255,255,255,0.3)" : "#0a0800",
                    }}
                  >
                    {added ? <><Check size={15} /> Нэмэгдлээ!</> : <><ShoppingCart size={15} /> Сагсанд нэмэх</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}

export default ProductsPage;