function PrimaryButton({
  children,
  type = "submit",
  loading = false,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-300/40 transition",
        "hover:-translate-y-0.5 hover:bg-amber-300",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
        className,
      ].join(" ")}
    >
      {loading ? "Уншиж байна..." : children}
    </button>
  );
}

export default PrimaryButton;