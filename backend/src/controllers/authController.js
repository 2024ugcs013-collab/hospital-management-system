import mongoose from 'mongoose';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import generateToken from '../utils/generateToken.js';
import { uploadBufferToCloudinary } from '../config/cloudinary.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService.js';
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

async function persistUser(user, updates) {
  if (usingMongo()) {
    Object.assign(user, updates);
    return user.save();
  }

  Object.assign(user, updates, { updatedAt: new Date().toISOString() });
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

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link has been sent.',
      });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    await persistUser(user, { resetPasswordToken, resetPasswordExpires });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      text: `Reset your password using this link: ${resetUrl}\nThis link expires in 30 minutes.`,
      html: `<p>Reset your password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes.</p>`,
    });

    res.status(200).json({
      success: true,
      message: 'If the email exists, a reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    let user = null;

    if (usingMongo()) {
      user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: new Date() },
      });
    } else {
      user = memoryStore.users.find((item) => item.resetPasswordToken === resetPasswordToken && item.resetPasswordExpires && new Date(item.resetPasswordExpires) > new Date()) || null;
    }

    if (!user) {
      const error = new Error('Reset link is invalid or has expired.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = usingMongo() ? password : await bcrypt.hash(password, 10);
    await persistUser(user, {
      password: hashedPassword,
      resetPasswordToken: '',
      resetPasswordExpires: null,
    });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
}
