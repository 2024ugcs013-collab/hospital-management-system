import { Link, NavLink } from 'react-router-dom';

export default function Sidebar({ items = [], user, onClose }) {
  return (
    <aside className="flex h-full flex-col justify-between bg-slate-950 px-5 py-6 text-white">
      <div className="flex flex-col h-full overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10">
        <Link to="/" className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 shrink-0">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500 text-lg font-bold text-white">HM</div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-brand-200">Hospital</p>
            <p className="text-lg font-semibold">Care Center</p>
          </div>
        </Link>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 shrink-0">
          <p className="text-sm text-slate-300">Welcome back</p>
          <p className="mt-1 text-base font-semibold truncate">{user?.name || 'Guest User'}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email || 'Sign in to continue'}</p>
        </div>

        <nav className="mt-6 space-y-1 flex-1">
          {items.map((item) => {
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                    item.onClick();
                  }}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-[0_4px_20px_rgba(13,148,136,0.3)]'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 rounded-2.5xl border border-white/10 bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white shadow-glow shrink-0">
        <p className="text-sm font-medium text-brand-50">Need assistance?</p>
        <p className="mt-1 text-xs text-brand-100/80 leading-5">Our digital clinic support is online 24/7 to resolve queries.</p>
      </div>
    </aside>
  );
}
