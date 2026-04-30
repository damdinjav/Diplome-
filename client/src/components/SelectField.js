function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SelectField({ label, error, options, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <select
        {...props}
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
        className={cn(
          "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition",
          error ? "border-rose-400" : "border-slate-300 focus:border-amber-400"
        )}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}

export default SelectField;