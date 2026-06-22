import Button from '../common/Button';

export default function Navbar({ onMenuClick, title = 'Dashboard', user, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <span className="text-lg">☰</span>
          </button>
          <div>
            <p className="text-sm text-slate-500">{user?.role ? user.role.toUpperCase() : 'HOSPITAL'}</p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.fullName || 'Guest User'}</p>
            <p className="text-xs text-slate-500">{user?.email || 'Please sign in'}</p>
          </div>
          {onLogout ? (
            <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={onLogout}>
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

