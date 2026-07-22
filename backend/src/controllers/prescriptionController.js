import Prescription from '../models/Prescription.js';
import User from '../models/User.js';

export async function getPrescriptions(req, res, next) {
  try {
    const { search } = req.query;
    let query = req.user.role === 'doctor' ? { doctorId: req.user._id } : { patientId: req.user._id };

    const prescriptions = await Prescription.find(query)
      .populate({
        path: 'doctorId',
        select: 'name email phone profileImage'
      })
      .populate({ path: 'patientId', select: 'name email phone' })
      .sort({ issueDate: -1 });

    // Client-side text search if query exists
    let results = prescriptions;
    if (search) {
      const regex = new RegExp(search, 'i');
      results = prescriptions.filter(p => {
        const docName = p.doctorId?.name || '';
        const medMatch = p.medicines.some(m => regex.test(m.name));
        return regex.test(docName) || medMatch;
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      prescriptions: results
    });
  } catch (error) {
    next(error);
  }
}

export async function createPrescription(req, res, next) {
  try {
    const { patientId, appointmentId, medicineName, dosage, duration, notes } = req.body;
    if (!patientId || !medicineName || !dosage || !duration) { const error = new Error('Patient and medicine details are required.'); error.statusCode = 400; throw error; }
    const prescription = await Prescription.create({ patientId, appointmentId, doctorId: req.user._id, medicines: [{ name: medicineName, dosage, duration }], notes });
    res.status(201).json({ success: true, prescription });
  } catch (error) { next(error); }
}

export async function getPrescriptionById(req, res, next) {
  try {
    const pres = await Prescription.findById(req.params.id)
      .populate({
        path: 'doctorId',
        select: 'name email phone profileImage'
      })
      .populate({
        path: 'patientId',
        select: 'name email phone'
      });

    if (!pres) {
      const error = new Error('Prescription not found');
      error.statusCode = 404;
      throw error;
    }

    if (String(pres.patientId._id) !== String(req.user._id)) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({
      success: true,
      prescription: pres
    });
  } catch (error) {
    next(error);
  }
}
