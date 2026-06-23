export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  patient: 'Patient',
  doctor: 'Doctor',
  receptionist: 'Receptionist',
  admin: 'Admin',
};

export const ROLE_DASHBOARD_PATHS = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  receptionist: '/receptionist/dashboard',
  admin: '/admin/dashboard',
};

export const AUTH_TABS = [
  { id: 'patient', label: 'Patient' },
  { id: 'doctor', label: 'Doctor' },
];

export const AUTH_STORAGE_KEYS = {
  token: 'hms_token',
  user: 'hms_user',
};

export const LANDING_NAV = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Contact', href: '#contact' },
];

export const LANDING_FEATURES = [
  {
    title: 'Online Appointments',
    description: 'Let patients book consultation slots in a smooth, guided flow.',
    icon: 'calendar',
  },
  {
    title: 'Doctor Consultation',
    description: 'Support in-person and virtual care with role-based access to patient records.',
    icon: 'stethoscope',
  },
  {
    title: 'Digital Prescriptions',
    description: 'Create and review prescriptions with paperless sharing and easy follow-up.',
    icon: 'document',
  },
  {
    title: 'Secure Medical Records',
    description: 'Keep sensitive health data organized behind role-based permissions.',
    icon: 'shield',
  },
];

export const LANDING_DOCTORS = [
  {
    name: 'Dr. Daniel Carter',
    specialty: 'Cardiology',
    experience: '8 years',
  },
  {
    name: 'Dr. Emily Patel',
    specialty: 'Pediatrics',
    experience: '6 years',
  },
  {
    name: 'Dr. Hassan Malik',
    specialty: 'Orthopedics',
    experience: '12 years',
  },
];
