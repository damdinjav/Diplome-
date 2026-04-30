import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import API from "../services/api";
import { saveUser } from "../utils/auth";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await API.post("/auth/login", form);
      if (res.data.user.role !== "admin") {
        setError("Та админ эрхгүй байна");
        return;
      }
      saveAuth(res.data);
      window.location.href = "/admin-dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Нэвтрэх мэдээлэл буруу байна");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/xac-logo.png" alt="ХАС" style={{ width: 72, height: 72, objectFit: "cover", marginBottom: 12 }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 999, padding: "4px 14px" }}>
            <Shield size={12} color="#F5A623" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#F5A623", letterSpacing: 1 }}>АДМИНЫ НЭВТРЭЛТ</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#242424", borderRadius: 16, border: "1px solid rgba(245,166,35,0.15)", padding: 32 }}>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: "#fff", margin: "0 0 8px" }}>Тавтай морил</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 28px" }}>Админы хяналтын самбарт нэвтрэнэ үү.</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>Имэйл хаяг</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 10, border: "1px solid rgba(245,166,35,0.2)", background: "rgba(255,255,255,0.05)", padding: "11px 14px" }}>
                <Mail size={15} color="#F5A623" />
                <input type="email" placeholder="admin@example.com" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "#fff" }}
                  className="placeholder-stone-600"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>Нууц үг</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 10, border: "1px solid rgba(245,166,35,0.2)", background: "rgba(255,255,255,0.05)", padding: "11px 14px" }}>
                <Lock size={15} color="#F5A623" />
                <input type={showPass ? "text" : "password"} placeholder="Нууц үг" value={form.password} onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "#fff" }}
                  className="placeholder-stone-600"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,166,35,0.5)" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ borderRadius: 8, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              borderRadius: 10, border: "none", background: loading ? "rgba(245,166,35,0.4)" : "linear-gradient(135deg,#F5A623,#e8950f)",
              padding: "13px 0", fontSize: 14, fontWeight: 700, color: "#0a0800", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(245,166,35,0.3)", marginTop: 4
            }}>
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;