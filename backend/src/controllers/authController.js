import mongoose from 'mongoose';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import generateToken from '../utils/generateToken.js';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';
import bcrypt from 'bcryptjs';
const memoryStore = globalThis.__hmsMemoryStore || (globalThis.__hmsMemoryStore = {
  users: [],
  patients: [],
  doctors: [],
});

function usingMongo() {
  return mongoose.connection.readyState === 1;
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: Boolean(user.isVerified),
    profileImage: user.profileImage || '',
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString(),
  };
}

async function findUserByEmail(email) {
  if (usingMongo()) {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  }

  return memoryStore.users.find((item) => item.email.toLowerCase() === email.toLowerCase()) || null;
}

async function findUserById(userId) {
  if (usingMongo()) {
    return User.findById(userId).select('-password');
  }

  return memoryStore.users.find((item) => String(item.id) === String(userId)) || null;
}

async function saveUser(data) {
  if (usingMongo()) {
    return User.create(data);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = {
    id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
    password: hashedPassword,
  };

  memoryStore.users.push(user);
  return user;
}

async function savePatient(data) {
  if (usingMongo()) {
    return Patient.create(data);
  }

  const patient = {
    id: `patient-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };

  memoryStore.patients.push(patient);
  return patient;
}

async function saveDoctor(data) {
  if (usingMongo()) {
    return Doctor.create(data);
  }

  const doctor = {
    id: `doctor-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };

  memoryStore.doctors.push(doctor);
  return doctor;
}

async function comparePassword(user, password) {
  if (usingMongo()) {
    return user.comparePassword(password);
  }

  const bcrypt = await import('bcryptjs');
  return bcrypt.default.compare(password, user.password);
}

function assertUniqueEmail(existingUser) {
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }
}

async function uploadDocument(file, folder, fallbackName) {
  if (!file) {
    return '';
  }

  const result = await uploadBufferToCloudinary(file.buffer, folder, fallbackName || file.originalname);
  return result.secure_url;
}

export async function registerPatient(req, res, next) {
  try {
    console.log("REGISTER BODY:", req.body);
    const { name, email, phone, password } = req.body;
    const existingUser = await findUserByEmail(email);
    assertUniqueEmail(existingUser);

    const user = await saveUser({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'patient',
      isVerified: true,
    });

    await savePatient({
      userId: user._id || user.id,
      age: null,
      gender: '',
      bloodGroup: '',
      address: '',
      emergencyContact: '',
    });

    const responseUser = normalizeUser(user);
    const token = generateToken(responseUser.id, responseUser.role);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      token,
      role: responseUser.role,
      user: responseUser,
    });
  } catch (error) {
  console.error("REGISTER ERROR:", error);
  next(error);
}
}

export async function registerDoctor(req, res, next) {
  try {
    const { name, email, phone, specialization, experience, licenseNumber, password } = req.body;
    const existingUser = await findUserByEmail(email);
    assertUniqueEmail(existingUser);

    const degreeFile = req.files?.degreeCertificate?.[0];
    const licenseFile = req.files?.licenseCertificate?.[0];

    const [degreeCertificateUrl, licenseCertificateUrl] = await Promise.all([
      uploadDocument(degreeFile, 'hospital-management/doctor-documents', 'degree-certificate'),
      uploadDocument(licenseFile, 'hospital-management/doctor-documents', 'license-certificate'),
    ]);

    const user = await saveUser({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'doctor',
      isVerified: false,
    });

    await saveDoctor({
      userId: user._id || user.id,
      specialization,
      experience: Number(experience),
      licenseNumber,
      degreeCertificateUrl,
      licenseCertificateUrl,
      verificationStatus: 'pending',
      consultationFee: 0,
      availability: [],
    });

    res.status(201).json({
      success: true,
      message: 'Doctor registration submitted successfully. Verification is pending.',
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await comparePassword(user, password);

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const normalizedUser = normalizeUser(user);
    const token = generateToken(normalizedUser.id, normalizedUser.role);

    res.status(200).json({
      success: true,
      token,
      role: normalizedUser.role,
      user: normalizedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    const user = await findUserById(req.user.id || req.user._id || req.user.userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      user: normalizeUser(user),
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(_req, res) {
  res.status(200).json({
    success: true,
    message: 'Password reset flow is not active yet.',
  });
}
