import { useNavigate, Link } from "react-router-dom";
import { getUser, logout } from "../utils/auth";
import { LogOut, ShoppingCart } from "lucide-react";

function DashboardShell({ title, subtitle, children }) {
  const user = getUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{background: "linear-gradient(135deg, #0a0800 0%, #1a1200 50%, #0f0c00 100%)", color: "#fff"}}>
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(245,166,35,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Header */}
      <header style={{
        borderBottom: "1px solid rgba(245,166,35,0.15)",
        background: "rgba(10,8,0,0.8)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/xac-logo.png" alt="ХАС" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div style={{width: 1, height: 20, background: "rgba(245,166,35,0.2)"}} />
            <div>
              <h1 className="text-base font-bold">{title}</h1>
              {subtitle && <p className="text-xs" style={{color: "rgba(255,255,255,0.4)"}}>{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Сагсны товч - зөвхөн хэрэглэгчид харагдана */}
            {user?.role === "user" && (
              <Link to="/cart" style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 999, fontSize: 14,
                border: "1px solid rgba(245,166,35,0.3)",
                color: "#F5A623", textDecoration: "none",
                background: "rgba(245,166,35,0.08)",
              }}>
                <ShoppingCart size={16} /> Сагс
              </Link>
            )}

            <div className="px-4 py-2 rounded-full text-sm" style={{
              background: "rgba(245,166,35,0.1)",
              border: "1px solid rgba(245,166,35,0.2)",
              color: "#F5A623",
            }}>
              {user?.fullName}
              <span className="ml-2 text-xs" style={{color: "rgba(245,166,35,0.5)"}}>· {user?.role}</span>
            </div>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,166,35,0.3)"; e.currentTarget.style.color = "#F5A623"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
            >
              <LogOut size={14} /> Гарах
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardShell;