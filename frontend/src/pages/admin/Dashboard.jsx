import DashboardPage from '../../components/dashboard/DashboardPage';
import { dashboardContent } from '../../data/dashboardContent';
import { USER_ROLES } from '../../utils/constants';

export default function Dashboard() {
  const config = dashboardContent[USER_ROLES.ADMIN];

  return (
    <DashboardPage role={USER_ROLES.ADMIN} config={config}>
      <section id="overview" className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Welcome Card</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">Review operational health, audit activity, and the Phase 1 platform state.</p>
        </div>
        <div className="rounded-[1.75rem] bg-brand-50 p-6">
          <p className="text-sm font-semibold text-brand-700">System snapshot</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">All core services are in mock-ready Phase 1 mode.</p>
        </div>
      </section>

      <section id="users" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Users</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">User management, access control, and role administration will live here.</p>
      </section>

      <section id="analytics" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Analytics</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Growth charts, usage trends, and system metrics can be rendered here.</p>
      </section>

      <section id="settings" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Settings</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Security settings, department configuration, and theming controls belong here.</p>
      </section>
    </DashboardPage>
  );
}
