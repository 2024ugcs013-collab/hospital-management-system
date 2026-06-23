import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Order from '../models/Order.js';

export async function getPatientProfile(req, res, next) {
  try {
    const userId = req.user._id;
    let patient = await Patient.findOne({ userId });

    if (!patient) {
      // Auto-create profile if missing
      patient = await Patient.create({
        userId,
        age: null,
        gender: '',
        bloodGroup: '',
        address: '',
        emergencyContact: ''
      });
    }

    res.status(200).json({
      success: true,
      profile: {
        patientId: patient._id,
        email: req.user.email,
        name: req.user.name,
        phone: req.user.phone,
        createdAt: req.user.createdAt,
        age: patient.age,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        allergies: patient.allergies || '',
        medicalConditions: patient.medicalConditions || ''
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePatientProfile(req, res, next) {
  try {
    const userId = req.user._id;
    const { name, phone, age, gender, bloodGroup, address, emergencyContact, allergies, medicalConditions } = req.body;

    // Update User details
    const user = await User.findById(userId);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();

    // Update Patient details
    let patient = await Patient.findOne({ userId });
    if (!patient) {
      patient = new Patient({ userId });
    }

    if (age !== undefined) patient.age = age ? Number(age) : null;
    if (gender !== undefined) patient.gender = gender;
    if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
    if (address !== undefined) patient.address = address;
    if (emergencyContact !== undefined) patient.emergencyContact = emergencyContact;
    
    if (allergies !== undefined) patient.allergies = allergies;
    if (medicalConditions !== undefined) patient.medicalConditions = medicalConditions;
    
    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        patientId: patient._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
        age: patient.age,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        allergies: patient.allergies || '',
        medicalConditions: patient.medicalConditions || ''
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getMedicalHistory(req, res, next) {
  try {
    const patientId = req.user._id;

    // Fetch all related items
    const appointments = await Appointment.find({ patientId, status: 'completed' })
      .populate({ path: 'doctorId', select: 'name specialization' })
      .sort({ date: -1 });

    const prescriptions = await Prescription.find({ patientId })
      .populate({ path: 'doctorId', select: 'name specialization' })
      .sort({ issueDate: -1 });

    const medicalRecords = await MedicalRecord.find({ patientId })
      .populate({ path: 'doctorId', select: 'name specialization' })
      .sort({ date: -1 });

    const orders = await Order.find({ patientId, status: 'delivered' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
      prescriptions,
      medicalRecords,
      orders
    });
  } catch (error) {
    next(error);
  }
}
