import { Link } from 'react-router-dom';

export default function Sidebar({ items = [], user, onClose }) {
  return (
    <aside className="flex h-full flex-col justify-between bg-slate-950 px-5 py-6 text-white">
      <div>
        <Link to="/" className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500 text-lg font-bold text-white">HM</div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-brand-200">Hospital</p>
            <p className="text-lg font-semibold">Care Center</p>
          </div>
        </Link>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-300">Welcome back</p>
          <p className="mt-1 text-lg font-semibold">{user?.fullName || 'Guest User'}</p>
          <p className="text-sm text-slate-400">{user?.email || 'Sign in to continue'}</p>
        </div>

        <nav className="mt-6 space-y-1">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <span>{item.label}</span>
              <span className="text-xs text-slate-300">{item.badge || ''}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white shadow-glow">
        <p className="text-sm font-medium text-brand-50">Need help?</p>
        <p className="mt-2 text-sm text-brand-50/90">Use the built-in mock auth accounts while backend integration is pending.</p>
      </div>
    </aside>
  );
}


