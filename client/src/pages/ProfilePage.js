import DashboardShell from "../layouts/DashboardShell";
import { getUser } from "../utils/auth";
import { User, Mail, Shield } from "lucide-react";

function ProfilePage() {
  const user = getUser();

  return (
    <DashboardShell title="Профайл" subtitle="Таны бүртгэлийн мэдээлэл." role="user">
      <div style={{ maxWidth: 480 }}>
        <div style={{ borderRadius: 24, border: "1px solid rgba(245,166,35,0.15)", background: "rgba(245,166,35,0.03)", padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#F5A623,#e8950f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={28} color="#0a0800" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>{user?.fullName}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>Хэрэглэгч</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={16} color="#F5A623" />
              </div>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Нэр</p>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{user?.fullName}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={16} color="#F5A623" />
              </div>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Имэйл</p>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{user?.email}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={16} color="#F5A623" />
              </div>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Эрх</p>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{user?.role === "admin" ? "Админ" : "Хэрэглэгч"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default ProfilePage;