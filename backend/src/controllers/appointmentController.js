import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Notification from '../models/Notification.js';

export async function getAppointments(req, res, next) {
  try {
    const patientId = req.user._id;
    const { status } = req.query;

    let query = { patientId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'doctorId',
        select: 'name email phone profileImage'
      })
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
        } : null
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
    if (String(appt.patientId._id) !== String(req.user._id)) {
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
    const doctorProfile = await Doctor.findOne({ userId: doctorId });
    const fee = doctorProfile ? doctorProfile.consultationFee : 500;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date: new Date(date),
      timeSlot,
      notes,
      fee,
      status: 'confirmed', // Auto-confirm mock booking
      meetingLink: 'https://zoom.us/mock-meeting-id',
      paymentStatus: 'paid', // Mark as paid for mock Razorpay simulation
      paymentId: 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase()
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
