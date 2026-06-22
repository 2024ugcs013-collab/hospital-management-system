import Button from '../common/Button';
import StatCard from '../cards/StatCard';
import DashboardShell from './DashboardShell';
import { getRoleLabel } from '../../utils/helpers';

// Shared dashboard layout used by all four role-specific placeholder dashboards.
export default function DashboardPage({ role, config, children }) {
  return (
    <DashboardShell title={config.title} sidebarItems={config.sidebarItems}>
      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-6 text-white shadow-2xl shadow-slate-950/10 sm:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-brand-100/80">{getRoleLabel(role)} portal</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{config.welcomeTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">{config.welcomeText}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {config.actions.map((action) => (
              <Button
                key={action.label}
                className={action.variant === 'secondary' ? 'border border-white/15 bg-white/10 text-white hover:bg-white/15' : 'bg-brand-500 text-white hover:bg-brand-600'}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Today&apos;s overview</p>
          <ul className="mt-4 space-y-4">
            {config.quickFacts.map((item) => (
              <li key={item.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">Statistics</h3>
            <p className="text-sm text-slate-500">High-level snapshot for the current role.</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">Mock data</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {config.stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} description={stat.description} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Placeholder content</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {config.panels.map((panel) => (
              <article key={panel.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">{panel.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{panel.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Next actions</h3>
          <ul className="mt-4 space-y-3">
            {config.nextSteps.map((step) => (
              <li key={step} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {children}
    </DashboardShell>
  );
}
