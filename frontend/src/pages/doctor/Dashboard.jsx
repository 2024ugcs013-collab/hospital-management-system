import DashboardPage from '../../components/dashboard/DashboardPage';
import { dashboardContent } from '../../data/dashboardContent';
import { USER_ROLES } from '../../utils/constants';

export default function Dashboard() {
  const config = dashboardContent[USER_ROLES.DOCTOR];

  return (
    <DashboardPage role={USER_ROLES.DOCTOR} config={config}>
      <section id="overview" className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Welcome Card</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">Review today&apos;s patient queue, open reports, and pending prescriptions.</p>
        </div>
        <div className="rounded-[1.75rem] bg-brand-50 p-6">
          <p className="text-sm font-semibold text-brand-700">Next consultation</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">Four follow-up appointments are waiting for your review.</p>
        </div>
      </section>

      <section id="schedule" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Schedule</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Time blocks, availability, and consult schedules will be rendered here.</p>
      </section>

      <section id="patients" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Patients</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Patient charts, consultation notes, and report generation will appear here.</p>
      </section>

      <section id="reports" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Reports</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Lab result summaries, visit reports, and exports belong in this area.</p>
      </section>
    </DashboardPage>
  );
}
