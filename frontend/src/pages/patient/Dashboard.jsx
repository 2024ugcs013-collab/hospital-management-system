import DashboardPage from '../../components/dashboard/DashboardPage';
import { dashboardContent } from '../../data/dashboardContent';
import { USER_ROLES } from '../../utils/constants';

export default function Dashboard() {
  const config = dashboardContent[USER_ROLES.PATIENT];

  return (
    <DashboardPage role={USER_ROLES.PATIENT} config={config}>
      <section id="overview" className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Welcome Card</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">Review upcoming appointments, recent prescriptions, and outstanding billing items from a single dashboard.</p>
        </div>
        <div className="rounded-[1.75rem] bg-brand-50 p-6">
          <p className="text-sm font-semibold text-brand-700">Today&apos;s focus</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">Your next appointment is scheduled for tomorrow at 10:30 AM.</p>
        </div>
      </section>

      <section id="appointments" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Appointments</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Appointment timeline, notifications, and visit details will live here.</p>
      </section>

      <section id="records" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Medical Records</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Lab results, consultation notes, and record history can be added here.</p>
      </section>

      <section id="billing" className="rounded-[1.75rem] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Billing</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">Invoices, payments, and coverage summaries can be added here.</p>
      </section>
    </DashboardPage>
  );
}
