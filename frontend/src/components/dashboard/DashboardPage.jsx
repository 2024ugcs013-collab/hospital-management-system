import DashboardShell from './DashboardShell';
import Button from '../common/Button';
import { ROLE_LABELS } from '../../utils/constants';

// Shared dashboard layout used by all four role-specific placeholder dashboards.
export default function DashboardPage({ role, config }) {
  return (
    <DashboardShell title={config.title} sidebarItems={config.sidebarItems}>
      <section className="grid place-items-center py-8 sm:py-12">
        <div className="w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">{ROLE_LABELS[role]}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{config.welcomeTitle}</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">{config.welcomeText}</p>

          <div className="mt-8 rounded-[1.5rem] bg-brand-50 p-6">
            <p className="text-sm font-medium text-brand-700">Welcome message</p>
            <p className="mt-3 text-slate-700">You are signed in as the {ROLE_LABELS[role].toLowerCase()} role. Logout when you are finished.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="bg-brand-600 text-white hover:bg-brand-700">Logout</Button>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
