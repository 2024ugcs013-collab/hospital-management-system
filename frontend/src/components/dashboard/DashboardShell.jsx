import { useState } from 'react';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function DashboardShell({ title, sidebarItems, children }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <Sidebar items={sidebarItems} user={user} />
      </aside>

      <div className="min-w-0">
        <Navbar title={title} user={user} onMenuClick={() => setMobileOpen(true)} onLogout={logout} />
        <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 z-10 w-[85%] max-w-sm shadow-2xl">
            <Sidebar items={sidebarItems} user={user} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
