import DashboardPage from '../../components/dashboard/DashboardPage';
import { dashboardContent } from '../../data/dashboardContent';
import { USER_ROLES } from '../../utils/constants';

export default function Dashboard() {
  const config = dashboardContent[USER_ROLES.RECEPTIONIST];

  return (
    <DashboardPage role={USER_ROLES.RECEPTIONIST} config={config}>
      <section id="overview" className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Welcome Card</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">Keep check-ins moving, align doctor schedules, and support billing coordination.</p>
        </div>
        <div className="rounded-[1.75rem] bg-brand-50 p-6">
          <p className="text-sm font-semibold text-brand-700">Front desk status</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">Several walk-in patients are awaiting check-in assistance.</p>
        </div>
      </section>

      <section id="checkins" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Check-ins</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Track walk-ins, appointment reschedules, and urgent requests here.</p>
      </section>

      <section id="scheduling" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Scheduling</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Appointment rescheduling, doctor availability, and room allocation belong here.</p>
      </section>

      <section id="billing" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Billing</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Create and review invoices, payment status, and billing notes here.</p>
      </section>
    </DashboardPage>
  );
}
