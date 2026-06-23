import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LANDING_NAV } from '../../utils/constants';

export default function PublicNavbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.35, 0.5, 0.65],
        rootMargin: '-15% 0px -50% 0px',
      }
    );

    LANDING_NAV.forEach((item) => {
      const sectionId = item.href.replace('#', '');
      const element = document.getElementById(sectionId);

      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

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
          {LANDING_NAV.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <a key={item.label} href={item.href} className={`text-sm font-medium transition ${isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700">
            Login
          </Link>
          <Link to="/register" className="rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            Register
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="text-xl">☰</span>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {LANDING_NAV.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="mt-2 flex gap-3 px-1">
              <Link to="/login" className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                Login
              </Link>
              <Link to="/register" className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white">
                Register
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}