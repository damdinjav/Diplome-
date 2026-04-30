import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const btnStyle = (active) => ({
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.2s",
    border: active ? "none" : "1px solid rgba(245,166,35,0.2)",
    background: active ? "linear-gradient(135deg,#F5A623,#e8950f)" : "transparent",
    color: active ? "#0a0800" : "rgba(255,255,255,0.5)",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 32 }}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...btnStyle(false),
          opacity: currentPage === 1 ? 0.3 : 1,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} style={{ color: "rgba(255,255,255,0.3)", padding: "0 4px" }}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={btnStyle(page === currentPage)}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...btnStyle(false),
          opacity: currentPage === totalPages ? 0.3 : 1,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;