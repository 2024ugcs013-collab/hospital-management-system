import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Notification from '../models/Notification.js';

export async function getAppointments(req, res, next) {
  try {
    const { status } = req.query;
    let query = req.user.role === 'doctor' ? { doctorId: req.user._id } : { patientId: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate({ path: 'doctorId', select: 'name email phone profileImage' })
      .populate({ path: 'patientId', select: 'name email phone' })
      .sort({ date: 1, timeSlot: 1 });

    // Format for frontend consumption
    const formatted = appointments.map(appt => {
      // Get specialization from doctor details
      return {
        _id: appt._id,
        date: appt.date,
        timeSlot: appt.timeSlot,
        status: appt.status,
        meetingLink: appt.meetingLink || 'https://zoom.us/mock-meeting-id',
        notes: appt.notes,
        fee: appt.fee,
        paymentStatus: appt.paymentStatus,
        paymentId: appt.paymentId,
        doctor: appt.doctorId ? {
          _id: appt.doctorId._id,
          name: appt.doctorId.name,
          email: appt.doctorId.email,
          phone: appt.doctorId.phone,
          profileImage: appt.doctorId.profileImage
        } : null,
        patient: appt.patientId ? { _id: appt.patientId._id, name: appt.patientId.name, email: appt.patientId.email, phone: appt.patientId.phone } : null
      };
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      appointments: formatted
    });
  } catch (error) {
    next(error);
  }
}

export async function getAppointmentById(req, res, next) {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate({
        path: 'doctorId',
        select: 'name email phone profileImage'
      })
      .populate({
        path: 'patientId',
        select: 'name email phone'
      });

    if (!appt) {
      const error = new Error('Appointment not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify ownership
    if (req.user.role !== 'admin' && String(req.user._id) !== String(appt.patientId._id) && String(req.user._id) !== String(appt.doctorId._id)) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    res.status(200).json({
      success: true,
      appointment: appt
    });
  } catch (error) {
    next(error);
  }
}

export async function bookAppointment(req, res, next) {
  try {
    const patientId = req.user._id;
    const { doctorId, date, timeSlot, notes } = req.body;

    if (!doctorId || !date || !timeSlot) {
      const error = new Error('Please provide doctorId, date, and timeSlot.');
      error.statusCode = 400;
      throw error;
    }

    // Get doctor consultation fee
    const doctorProfile = await Doctor.findOne({ userId: doctorId, verificationStatus: 'approved' });
    if (!doctorProfile) {
      const error = new Error('This doctor is not available for appointments.');
      error.statusCode = 400;
      throw error;
    }
    const fee = doctorProfile ? doctorProfile.consultationFee : 500;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date: new Date(date),
      timeSlot,
      notes,
      fee,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Create Notification
    const doctorUser = await User.findById(doctorId);
    await Notification.create({
      userId: patientId,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctorUser?.name || 'Doctor'} has been scheduled for ${new Date(date).toLocaleDateString()} at ${timeSlot}.`,
      type: 'appointment'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAppointmentStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      const error = new Error('Invalid appointment status.'); error.statusCode = 400; throw error;
    }
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) { const error = new Error('Appointment not found'); error.statusCode = 404; throw error; }
    if (req.user.role !== 'admin' && String(appointment.doctorId) !== String(req.user._id)) {
      const error = new Error('Only the assigned doctor can update this request.'); error.statusCode = 403; throw error;
    }
    appointment.status = status;
    if (status === 'confirmed' && !appointment.meetingLink) appointment.meetingLink = 'https://meet.example.com/appointment-' + appointment._id;
    await appointment.save();
    await Notification.create({ userId: appointment.patientId, title: `Appointment ${status}`, message: `Your appointment request has been ${status} by the doctor.`, type: 'appointment' });
    res.json({ success: true, appointment });
  } catch (error) { next(error); }
}

export async function rescheduleAppointment(req, res, next) {
  try {
    const { date, timeSlot } = req.body;
    const appt = await Appointment.findById(req.params.id);

    if (!appt) {
      const error = new Error('Appointment not found');
      error.statusCode = 404;
      throw error;
    }

    if (String(appt.patientId) !== String(req.user._id)) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    appt.date = new Date(date);
    appt.timeSlot = timeSlot;
    await appt.save();

    // Create Notification
    const doctorUser = await User.findById(appt.doctorId);
    await Notification.create({
      userId: req.user._id,
      title: 'Appointment Rescheduled',
      message: `Your appointment with Dr. ${doctorUser?.name || 'Doctor'} has been rescheduled to ${new Date(date).toLocaleDateString()} at ${timeSlot}.`,
      type: 'appointment'
    });

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment: appt
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelAppointment(req, res, next) {
  try {
    const appt = await Appointment.findById(req.params.id);

    if (!appt) {
      const error = new Error('Appointment not found');
      error.statusCode = 404;
      throw error;
    }

    if (String(appt.patientId) !== String(req.user._id)) {
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      throw error;
    }

    appt.status = 'cancelled';
    await appt.save();

    // Create Notification
    const doctorUser = await User.findById(appt.doctorId);
    await Notification.create({
      userId: req.user._id,
      title: 'Appointment Cancelled',
      message: `Your appointment with Dr. ${doctorUser?.name || 'Doctor'} has been cancelled.`,
      type: 'appointment'
    });

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment: appt
    });
  } catch (error) {
    next(error);
  }
}
