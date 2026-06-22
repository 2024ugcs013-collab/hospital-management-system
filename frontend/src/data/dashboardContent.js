import { USER_ROLES } from '../utils/constants';

export const dashboardContent = {
  [USER_ROLES.PATIENT]: {
    title: 'Patient Dashboard',
    welcomeTitle: 'Your care journey, organized in one place.',
    welcomeText: 'Track appointments, view prescriptions, and review medical history with a clean mock patient workspace.',
    sidebarItems: [
      { label: 'Dashboard', href: '#overview' },
      { label: 'Appointments', href: '#appointments' },
      { label: 'Medical Records', href: '#records' },
      { label: 'Bills', href: '#billing' },
    ],
    stats: [
      { title: 'Upcoming visits', value: '03', description: 'Appointments confirmed this week.' },
      { title: 'Prescriptions', value: '12', description: 'Recent digital prescriptions available.' },
      { title: 'Outstanding bills', value: '01', description: 'One invoice waiting for payment.' },
      { title: 'Unread alerts', value: '04', description: 'Reminders and care updates.' },
    ],
    quickFacts: [
      { label: 'Next appointment', value: 'Wednesday, 10:30 AM' },
      { label: 'Preferred doctor', value: 'Dr. Daniel Carter' },
      { label: 'Current status', value: 'Follow-up required' },
    ],
    actions: [
      { label: 'Book Appointment' },
      { label: 'View Prescriptions', variant: 'secondary' },
    ],
    panels: [
      { title: 'Health summary', description: 'A summary card for labs, medications, and care notes can be rendered here.' },
      { title: 'Reminder center', description: 'Missed visits, medication reminders, and wellness prompts belong in this area.' },
    ],
    nextSteps: ['Add appointment booking flow', 'Wire patient medical records', 'Integrate bill payment history'],
  },
  [USER_ROLES.DOCTOR]: {
    title: 'Doctor Dashboard',
    welcomeTitle: 'Review consultations and manage your patient schedule quickly.',
    welcomeText: 'This dashboard keeps appointments, treatment notes, and clinical follow-ups within reach.',
    sidebarItems: [
      { label: 'Dashboard', href: '#overview' },
      { label: 'Schedule', href: '#schedule' },
      { label: 'Patients', href: '#patients' },
      { label: 'Reports', href: '#reports' },
    ],
    stats: [
      { title: 'Today appointments', value: '08', description: 'Consults scheduled for today.' },
      { title: 'Patients in care', value: '126', description: 'Active patients under review.' },
      { title: 'Pending reports', value: '05', description: 'Reports awaiting completion.' },
      { title: 'Follow-ups', value: '11', description: 'Patients needing follow-up.' },
    ],
    quickFacts: [
      { label: 'First consult', value: '09:00 AM' },
      { label: 'Department', value: 'Cardiology' },
      { label: 'Prescription queue', value: 'Ready for review' },
    ],
    actions: [
      { label: 'Open Schedule' },
      { label: 'Create Prescription', variant: 'secondary' },
    ],
    panels: [
      { title: 'Clinical inbox', description: 'Use this block for lab results, patient messages, and review prompts.' },
      { title: 'Ward summary', description: 'A compact patient status panel can live here in the next phase.' },
    ],
    nextSteps: ['Connect appointment calendar', 'Add patient list filters', 'Generate reports and prescriptions'],
  },
  [USER_ROLES.RECEPTIONIST]: {
    title: 'Receptionist Dashboard',
    welcomeTitle: 'Coordinate arrivals, appointments, and front-desk operations.',
    welcomeText: 'Use this space for scheduling, patient registration, and billing coordination.',
    sidebarItems: [
      { label: 'Dashboard', href: '#overview' },
      { label: 'Check-ins', href: '#checkins' },
      { label: 'Scheduling', href: '#scheduling' },
      { label: 'Billing', href: '#billing' },
    ],
    stats: [
      { title: 'Today arrivals', value: '42', description: 'Check-ins recorded so far.' },
      { title: 'Pending bookings', value: '14', description: 'Patients waiting to be scheduled.' },
      { title: 'Bills generated', value: '19', description: 'Invoices created today.' },
      { title: 'Doctor blocks', value: '06', description: 'Schedule blocks currently open.' },
    ],
    quickFacts: [
      { label: 'Front desk load', value: 'Moderate' },
      { label: 'Support queue', value: '3 waiting' },
      { label: 'Shift handoff', value: '4:00 PM' },
    ],
    actions: [
      { label: 'Register Patient' },
      { label: 'Open Billing', variant: 'secondary' },
    ],
    panels: [
      { title: 'Queue management', description: 'Track walk-ins, appointment reschedules, and urgent requests here.' },
      { title: 'Scheduling notes', description: 'Use this section for room allocations and doctor availability reminders.' },
    ],
    nextSteps: ['Add queue status widgets', 'Wire patient registration', 'Add billing workflow'],
  },
  [USER_ROLES.ADMIN]: {
    title: 'Admin Dashboard',
    welcomeTitle: 'Monitor the full hospital platform from a single command center.',
    welcomeText: 'This admin shell is ready for analytics, user management, department control, and settings.',
    sidebarItems: [
      { label: 'Dashboard', href: '#overview' },
      { label: 'Users', href: '#users' },
      { label: 'Analytics', href: '#analytics' },
      { label: 'Settings', href: '#settings' },
    ],
    stats: [
      { title: 'Registered users', value: '248', description: 'Seed and mock users in the system.' },
      { title: 'Departments', value: '11', description: 'Active service departments.' },
      { title: 'Weekly usage', value: '82%', description: 'System usage trend this week.' },
      { title: 'Open alerts', value: '02', description: 'System issues needing review.' },
    ],
    quickFacts: [
      { label: 'Platform uptime', value: '99.9%' },
      { label: 'Latest audit', value: 'Clean' },
      { label: 'Theme', value: 'Healthcare modern' },
    ],
    actions: [
      { label: 'Manage Users' },
      { label: 'Open Analytics', variant: 'secondary' },
    ],
    panels: [
      { title: 'System overview', description: 'Future analytics cards, KPIs, and charts can sit inside this container.' },
      { title: 'Governance panel', description: 'Access control, department configuration, and audit controls belong here.' },
    ],
    nextSteps: ['Connect analytics charts', 'Add user and department management', 'Configure app settings'],
  },
};
