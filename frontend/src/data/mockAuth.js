const AUTH_TOKEN_KEY = 'hms_mock_token';
const AUTH_USER_KEY = 'hms_mock_user';
const REGISTERED_USERS_KEY = 'hms_mock_registered_users';

export const seedUsers = [
  {
    role: 'patient',
    fullName: 'Sarah Johnson',
    email: 'patient@hospital.test',
    phone: '9876543210',
    password: 'Patient@123',
  },
  {
    role: 'doctor',
    fullName: 'Dr. Daniel Carter',
    email: 'doctor@hospital.test',
    phone: '9123456780',
    specialization: 'Cardiology',
    experience: '8',
    medicalLicenseNumber: 'DOC-458901',
    password: 'Doctor@123',
  },
  {
    role: 'receptionist',
    fullName: 'Mia Rodriguez',
    email: 'receptionist@hospital.test',
    phone: '9012345678',
    password: 'Reception@123',
  },
  {
    role: 'admin',
    fullName: 'Ava Thompson',
    email: 'admin@hospital.test',
    phone: '9988776655',
    password: 'Admin@123',
  },
];

function readJson(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getRegisteredUsers() {
  return readJson(REGISTERED_USERS_KEY, []);
}

export function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  const nextUsers = [...users.filter((item) => item.email !== user.email), user];
  writeJson(REGISTERED_USERS_KEY, nextUsers);
  return user;
}

export function getMockUsers() {
  return [...getRegisteredUsers(), ...seedUsers];
}

export function createMockToken(user) {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.btoa(
    JSON.stringify({
      email: user.email,
      role: user.role,
      issuedAt: Date.now(),
    })
  );
}

export function authenticateMockUser(email, password) {
  const user = getMockUsers().find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password. Use one of the mock demo accounts or a registered user.');
  }

  const token = createMockToken(user);
  const sessionUser = {
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };

  if (typeof window !== 'undefined') {
    writeJson(AUTH_TOKEN_KEY, token);
    writeJson(AUTH_USER_KEY, sessionUser);
  }

  return { token, user: sessionUser };
}

export function registerMockUser(payload) {
  const user = {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    specialization: payload.specialization || '',
    experience: payload.experience || '',
    medicalLicenseNumber: payload.medicalLicenseNumber || '',
    degreeCertificateName: payload.degreeCertificateName || '',
    licenseCertificateName: payload.licenseCertificateName || '',
    password: payload.password,
  };

  saveRegisteredUser(user);
  return user;
}

export function hydrateSession() {
  const token = readJson(AUTH_TOKEN_KEY, '');
  const user = readJson(AUTH_USER_KEY, null);

  return {
    token,
    user,
  };
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}
