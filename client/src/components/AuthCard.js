function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur sm:p-8">
        {eyebrow && (
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-amber-600">
            {eyebrow}
          </p>
        )}

        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        )}

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export default AuthCard;