import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:72px_72px] opacity-50" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.13),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.95))]" />

      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg shadow-amber-300/40">
              <Zap className="h-6 w-6 fill-white" />
            </div>

            <div className="leading-tight">
              <p className="text-lg font-black tracking-wide text-slate-950">
                ХАС
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Generator
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-amber-300 hover:text-amber-700 sm:inline-flex"
            >
              Нэвтрэх
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-300/40 transition hover:bg-amber-300"
            >
              Бүртгүүлэх
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default PageShell;