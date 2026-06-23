import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Medicine from '../models/Medicine.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase(req, res, next) {
  try {
    // 1. Seed Doctors (User + Doctor Model)
    const doctorDetails = [
      {
        name: 'Dr. Daniel Carter',
        email: 'daniel.carter@hospital.local',
        phone: '1234567890',
        specialization: 'Cardiology',
        experience: 8,
        licenseNumber: 'LIC-CAR-101',
        consultationFee: 800,
        availability: [
          { day: 'Monday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
          { day: 'Wednesday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM', '05:00 PM'] },
          { day: 'Friday', slots: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'] }
        ]
      },
      {
        name: 'Dr. Emily Patel',
        email: 'emily.patel@hospital.local',
        phone: '2345678901',
        specialization: 'Pediatrics',
        experience: 6,
        licenseNumber: 'LIC-PED-202',
        consultationFee: 600,
        availability: [
          { day: 'Tuesday', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
          { day: 'Thursday', slots: ['10:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] }
        ]
      },
      {
        name: 'Dr. Hassan Malik',
        email: 'hassan.malik@hospital.local',
        phone: '3456789012',
        specialization: 'Orthopedics',
        experience: 12,
        licenseNumber: 'LIC-ORT-303',
        consultationFee: 1000,
        availability: [
          { day: 'Monday', slots: ['10:00 AM', '11:30 AM', '02:30 PM'] },
          { day: 'Thursday', slots: ['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM'] }
        ]
      },
      {
        name: 'Dr. Sarah Jenkins',
        email: 'sarah.jenkins@hospital.local',
        phone: '4567890123',
        specialization: 'Dermatology',
        experience: 9,
        licenseNumber: 'LIC-DER-404',
        consultationFee: 750,
        availability: [
          { day: 'Wednesday', slots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
          { day: 'Friday', slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] }
        ]
      }
    ];

    const salt = await bcrypt.genSalt(10);
    const hashedMockPassword = await bcrypt.hash('password123', salt);

    const doctorsList = [];
    for (const d of doctorDetails) {
      let user = await User.findOne({ email: d.email });
      if (!user) {
        user = await User.create({
          name: d.name,
          email: d.email,
          phone: d.phone,
          password: 'password123', // hooks hash this on pre-save
          role: 'doctor',
          isVerified: true
        });
      }
      
      let docRecord = await Doctor.findOne({ userId: user._id });
      if (!docRecord) {
        docRecord = await Doctor.create({
          userId: user._id,
          specialization: d.specialization,
          experience: d.experience,
          licenseNumber: d.licenseNumber,
          degreeCertificateUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop',
          licenseCertificateUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop',
          verificationStatus: 'approved',
          consultationFee: d.consultationFee,
          availability: d.availability
        });
      }
      doctorsList.push({ user, docRecord });
    }

    // 2. Seed Medicines
    const medicineDetails = [
      {
        name: 'Lipitor (Atorvastatin)',
        brand: 'Pfizer',
        category: 'Tablets',
        price: 450,
        stock: 50,
        description: 'Lipitor is a statin medication used to prevent cardiovascular disease in those at high risk and lower abnormal lipid levels.',
        composition: 'Atorvastatin Calcium 10mg',
        dosageInfo: 'Take one tablet daily at evening, or as directed by doctor.',
        warnings: 'Avoid grapefruit juice. Do not take if pregnant.'
      },
      {
        name: 'Ventolin HFA (Albuterol)',
        brand: 'GSK',
        category: 'Inhalers',
        price: 850,
        stock: 25,
        description: 'Ventolin is a bronchodilator that relaxes muscles in the airways and increases air flow to the lungs.',
        composition: 'Albuterol Sulfate 90mcg per inhalation',
        dosageInfo: 'Inhale 2 puffs every 4 to 6 hours as needed for wheezing.',
        warnings: 'May cause rapid heartbeats or shaking hands. Consult doctor if symptoms worsen.'
      },
      {
        name: 'Metformin Hydrochloride',
        brand: 'Bristol-Myers Squibb',
        category: 'Tablets',
        price: 180,
        stock: 120,
        description: 'Metformin is the first-line medication for the treatment of type 2 diabetes, particularly in people who are overweight.',
        composition: 'Metformin HCl 500mg',
        dosageInfo: 'Take one tablet twice daily with meals (breakfast and dinner).',
        warnings: 'Limit alcohol consumption. Monitor blood sugar levels regularly.'
      },
      {
        name: 'Amoxicillin Trihydrate',
        brand: 'Teva Pharmaceuticals',
        category: 'Tablets',
        price: 320,
        stock: 60,
        description: 'Amoxicillin is an antibiotic useful for the treatment of a number of bacterial infections, such as middle ear infections, strep throat, and pneumonia.',
        composition: 'Amoxicillin 500mg',
        dosageInfo: 'Take one tablet three times daily (every 8 hours) for 7 days. Complete the course.',
        warnings: 'Do not use if allergic to penicillin.'
      },
      {
        name: 'Panadol (Paracetamol)',
        brand: 'Haleon',
        category: 'Tablets',
        price: 60,
        stock: 300,
        description: 'Panadol is a common painkiller and fever reducer used to treat mild to moderate pain.',
        composition: 'Paracetamol 500mg',
        dosageInfo: '1-2 tablets every 4 to 6 hours as needed. Max 8 tablets in 24 hours.',
        warnings: 'Do not exceed the recommended dose. Avoid taking other paracetamol-containing drugs.'
      },
      {
        name: 'Allegra (Fexofenadine)',
        brand: 'Sanofi',
        category: 'Tablets',
        price: 240,
        stock: 90,
        description: 'Allegra is an antihistamine pharmaceutical drug used in the treatment of allergy symptoms, such as hay fever and urticaria.',
        composition: 'Fexofenadine Hydrochloride 120mg',
        dosageInfo: 'Take one tablet daily with water. Do not take with fruit juices.',
        warnings: 'May cause mild drowsiness in rare cases.'
      },
      {
        name: 'Benadryl Cough Syrup',
        brand: 'Johnson & Johnson',
        category: 'Syrups',
        price: 150,
        stock: 45,
        description: 'Benadryl syrup provides fast relief from cough, congestion, and itchy throat.',
        composition: 'Diphenhydramine HCl 12.5mg, Ammonium Chloride 125mg per 5ml',
        dosageInfo: 'Take 10ml three times daily. Shake well before use.',
        warnings: 'Causes significant drowsiness. Do not drive or operate heavy machinery after use.'
      }
    ];

    const medicinesList = [];
    for (const m of medicineDetails) {
      let med = await Medicine.findOne({ name: m.name });
      if (!med) {
        med = await Medicine.create(m);
      }
      medicinesList.push(med);
    }

    // 3. Check if there's a logged-in user or find the first patient user to seed history for
    let targetPatientId = req.user?.id;
    if (!targetPatientId) {
      const patientUser = await User.findOne({ role: 'patient' });
      if (patientUser) {
        targetPatientId = patientUser._id;
      }
    }

    if (targetPatientId) {
      // 4. Seed notifications for this patient
      const notifCount = await Notification.countDocuments({ userId: targetPatientId });
      if (notifCount === 0) {
        await Notification.create([
          {
            userId: targetPatientId,
            title: 'Welcome to Care Center',
            message: 'Your patient account has been successfully registered. You can now manage prescriptions, book consultations, and view billing.',
            type: 'system',
            isRead: false
          },
          {
            userId: targetPatientId,
            title: 'Prescription Uploaded',
            message: 'Dr. Daniel Carter has uploaded a new prescription for your cardiology check-up.',
            type: 'prescription',
            isRead: false
          },
          {
            userId: targetPatientId,
            title: 'Appointment Confirmed',
            message: 'Your appointment with Dr. Emily Patel on Friday at 10:00 AM has been confirmed.',
            type: 'appointment',
            isRead: true
          }
        ]);
      }

      // 5. Seed some past appointments & prescriptions for patient
      const apptCount = await Appointment.countDocuments({ patientId: targetPatientId });
      if (apptCount === 0 && doctorsList.length > 0) {
        // Create 1 completed appointment with prescription
        const carterDoc = doctorsList[0].user;
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 5);
        
        const pastAppt = await Appointment.create({
          patientId: targetPatientId,
          doctorId: carterDoc._id,
          date: pastDate,
          timeSlot: '10:00 AM',
          status: 'completed',
          meetingLink: 'https://zoom.us/mock-meeting-id',
          notes: 'Routine cardiovascular follow-up.',
          fee: 800,
          paymentStatus: 'paid',
          paymentId: 'pay_mock123'
        });

        // Add prescription
        await Prescription.create({
          appointmentId: pastAppt._id,
          patientId: targetPatientId,
          doctorId: carterDoc._id,
          issueDate: pastDate,
          medicines: [
            { name: 'Lipitor (Atorvastatin)', dosage: '0-0-1', duration: '30 days', instructions: 'Take daily at evening after meals.' },
            { name: 'Panadol (Paracetamol)', dosage: '1-0-1', duration: '5 days', instructions: 'Take only as needed for pain.' }
          ],
          notes: 'Lower cholesterol intake. Review in 1 month.'
        });

        // Create 1 upcoming appointment
        const patelDoc = doctorsList[1].user;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3);

        await Appointment.create({
          patientId: targetPatientId,
          doctorId: patelDoc._id,
          date: futureDate,
          timeSlot: '10:00 AM',
          status: 'confirmed',
          meetingLink: 'https://zoom.us/mock-meeting-id-2',
          notes: 'General pediatric follow-up.',
          fee: 600,
          paymentStatus: 'paid',
          paymentId: 'pay_mock456'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully with doctors, medicines, notifications, and patient histories.'
    });
  } catch (error) {
    console.error("SEEDING ERROR:", error);
    next(error);
  }
}
