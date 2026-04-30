import { Zap } from "lucide-react";

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(245,166,35,0.1)",
      marginTop: 48,
      padding: "24px 0",
      textAlign: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={12} color="#0a0800" fill="#0a0800" />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F5A623" }}>
          ХАС Генератор
        </span>
      </div>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif" }}>
        © 2024 ХАС Генераторын онлайн захиалгын систем. Бүх эрх хуулиар хамгаалагдсан.
      </p>
    </footer>
  );
}

export default Footer;