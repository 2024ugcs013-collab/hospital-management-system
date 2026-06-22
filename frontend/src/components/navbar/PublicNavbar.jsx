import { Link } from 'react-router-dom';
import { LANDING_NAV } from '../../utils/constants';

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-sm font-bold text-white shadow-glow">HM</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">MediCare</p>
            <p className="text-sm text-slate-500">Healthcare platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LANDING_NAV.map((item) => (
            <a key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-brand-700">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700">
            Login
          </Link>
          <Link to="/register" className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}