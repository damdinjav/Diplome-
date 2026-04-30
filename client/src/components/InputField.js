function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-bold text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={[
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition",
          "placeholder:text-slate-400",
          "focus:border-amber-400 focus:ring-4 focus:ring-amber-100",
          error
            ? "border-red-300 bg-red-50"
            : "border-slate-200 hover:border-slate-300",
        ].join(" ")}
      />

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
}

export default InputField;