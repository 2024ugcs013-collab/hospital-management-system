import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export async function getUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) { next(error); }
}

export async function getDoctorApplications(req, res, next) {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email phone isVerified').sort({ createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (error) { next(error); }
}

export async function verifyDoctor(req, res, next) {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) { const error = new Error('Status must be approved or rejected.'); error.statusCode = 400; throw error; }
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) { const error = new Error('Doctor application not found.'); error.statusCode = 404; throw error; }
    doctor.verificationStatus = status;
    await doctor.save();
    await User.findByIdAndUpdate(doctor.userId, { isVerified: status === 'approved' });
    res.json({ success: true, message: `Doctor ${status}.`, doctor });
  } catch (error) { next(error); }
}
