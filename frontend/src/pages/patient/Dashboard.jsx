import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardShell from '../../components/dashboard/DashboardShell';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { patientSidebarItems } from '../../data/patientNavigation';
import api from '../../services/api';
import { getAppointments } from '../../services/appointmentService';
import { getMedicalHistory, getPatientProfile } from '../../services/patientService';

const quickActions = [
  {
    title: 'Book appointment',
    description: 'Find a doctor and choose a convenient time.',
    href: '/patient/book-appointment',
    icon: '+',
    color: 'bg-brand-600 text-white',
  },
  {
    title: 'Medical records',
    description: 'Review your diagnoses and visit history.',
    href: '/patient/medical-records',
    icon: '▤',
    color: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Prescriptions',
    description: 'See medicines prescribed by your doctors.',
    href: '/patient/prescriptions',
    icon: 'Rx',
    color: 'bg-violet-50 text-violet-700',
  },
];

function formatDate(value, options = {}) {
  if (!value) return 'Date not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date not available';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date);
}

function StatCard({ label, value, detail, accent }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
        </div>
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${accent}`} />
      </div>
    </article>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid min-h-[55vh] place-items-center rounded-3xl border border-slate-200 bg-white">
      <Loader label="Preparing your health dashboard..." />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    appointments: [],
    profile: null,
    history: { prescriptions: [], medicalRecords: [] },
    notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      const results = await Promise.allSettled([
        getAppointments(),
        getPatientProfile(),
        getMedicalHistory(),
        api.get('/notifications'),
      ]);

      if (!active) return;

      const [appointmentsResult, profileResult, historyResult, notificationsResult] = results;
      const failedCount = results.filter((result) => result.status === 'rejected').length;

      setData({
        appointments: appointmentsResult.status === 'fulfilled' ? appointmentsResult.value : [],
        profile: profileResult.status === 'fulfilled' ? profileResult.value : null,
        history:
          historyResult.status === 'fulfilled'
            ? historyResult.value
            : { prescriptions: [], medicalRecords: [] },
        notifications:
          notificationsResult.status === 'fulfilled'
            ? notificationsResult.value.data?.notifications || []
            : [],
      });

      if (failedCount === results.length) {
        setError('We could not load your dashboard. Check that the API and database are running, then try again.');
      } else if (failedCount > 0) {
        setError('Some dashboard information is temporarily unavailable.');
      }

      setLoading(false);
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return data.appointments
      .filter((appointment) => {
        const date = new Date(appointment.date);
        return !['cancelled', 'completed'].includes(appointment.status) && date >= new Date(now.toDateString());
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data.appointments]);

  const nextAppointment = upcomingAppointments[0];
  const unreadNotifications = data.notifications.filter((notification) => !notification.isRead).length;
  const firstName = (data.profile?.name || user?.name || 'there').trim().split(/\s+/)[0];
  const completedProfileFields = ['phone', 'age', 'gender', 'bloodGroup', 'address'].filter(
    (field) => Boolean(data.profile?.[field])
  ).length;
  const profileCompletion = Math.round((completedProfileFields / 5) * 100);

  return (
    <DashboardShell title="Patient dashboard" sidebarItems={patientSidebarItems}>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {error ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
              {error}
            </div>
          ) : null}

          <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl sm:px-8 sm:py-9">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute -bottom-20 right-1/3 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-sm font-semibold text-brand-300">Your health, at a glance</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Good to see you, {firstName}.</h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                  Manage appointments, prescriptions, and medical records from one calm, organized place.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/patient/book-appointment"
                    className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
                  >
                    Book an appointment
                  </Link>
                  <Link
                    to="/patient/medical-records"
                    className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View health records
                  </Link>
                </div>
              </div>

              <div className="w-full rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm lg:max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">Next appointment</p>
                {nextAppointment ? (
                  <div className="mt-4">
                    <p className="text-xl font-semibold">{nextAppointment.doctor?.name || 'Your doctor'}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {formatDate(nextAppointment.date, { weekday: 'short' })} · {nextAppointment.timeSlot}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold capitalize text-emerald-200">
                        {nextAppointment.status}
                      </span>
                      <Link to="/patient/appointments" className="text-sm font-semibold text-white hover:text-brand-200">
                        View details →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-lg font-semibold">No upcoming visits</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">Book a consultation whenever you need care.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Health summary">
            <StatCard label="Upcoming visits" value={upcomingAppointments.length} detail="Confirmed or pending appointments" accent="bg-brand-500" />
            <StatCard label="Prescriptions" value={data.history.prescriptions?.length || 0} detail="Available in your health history" accent="bg-violet-500" />
            <StatCard label="Medical records" value={data.history.medicalRecords?.length || 0} detail="Consultations and clinical notes" accent="bg-sky-500" />
            <StatCard label="Unread alerts" value={unreadNotifications} detail="Appointment and care updates" accent="bg-amber-500" />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Schedule</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">Upcoming appointments</h2>
                </div>
                <Link to="/patient/appointments" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  View all
                </Link>
              </div>

              <div className="mt-5 divide-y divide-slate-100">
                {upcomingAppointments.length ? (
                  upcomingAppointments.slice(0, 3).map((appointment) => (
                    <article key={appointment._id} className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
                        <span className="text-lg font-bold">{new Date(appointment.date).getDate()}</span>
                        <span className="text-[10px] font-semibold uppercase">{formatDate(appointment.date, { month: 'short' }).split(' ')[1]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">{appointment.doctor?.name || 'Doctor consultation'}</p>
                        <p className="mt-1 text-sm text-slate-500">{appointment.timeSlot} · {appointment.notes || 'General consultation'}</p>
                      </div>
                      <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                        {appointment.status}
                      </span>
                    </article>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="font-semibold text-slate-800">Your calendar is clear</p>
                    <p className="mt-2 text-sm text-slate-500">You do not have any upcoming appointments.</p>
                    <Link to="/patient/book-appointment" className="mt-4 inline-block text-sm font-semibold text-brand-700">
                      Find a doctor →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Profile</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">Health details</h2>
                </div>
                <span className="text-sm font-bold text-slate-700">{profileCompletion}%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-500" style={{ width: `${profileCompletion}%` }} />
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Blood group</dt><dd className="font-semibold text-slate-900">{data.profile?.bloodGroup || 'Not added'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Age</dt><dd className="font-semibold text-slate-900">{data.profile?.age || 'Not added'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Emergency contact</dt><dd className="max-w-[150px] truncate font-semibold text-slate-900">{data.profile?.emergencyContact || 'Not added'}</dd></div>
              </dl>
              <Link to="/patient/profile" className="mt-6 block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700">
                Complete your profile
              </Link>
            </aside>
          </section>

          <section>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Shortcuts</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">What would you like to do?</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-bold ${action.color}`}>{action.icon}</span>
                  <h3 className="mt-4 font-bold text-slate-900 group-hover:text-brand-700">{action.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </DashboardShell>
  );
}
