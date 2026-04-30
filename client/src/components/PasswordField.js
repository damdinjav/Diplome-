import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);

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

      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            "w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-sm font-semibold text-slate-950 outline-none transition",
            "placeholder:text-slate-400",
            "focus:border-amber-400 focus:ring-4 focus:ring-amber-100",
            error
              ? "border-red-300 bg-red-50"
              : "border-slate-200 hover:border-slate-300",
          ].join(" ")}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
}

export default PasswordField;