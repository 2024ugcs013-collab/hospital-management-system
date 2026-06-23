import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export async function getDoctors(req, res, next) {
  try {
    const { search, specialization, minExperience, maxFee, day, rating, gender, sort } = req.query;

    // Build the query
    let userQuery = { role: 'doctor' };
    if (search) {
      userQuery.name = { $regex: search, $options: 'i' };
    }

    // Find users who match name search
    const matchingUsers = await User.find(userQuery).select('_id name email phone profileImage');
    const userIds = matchingUsers.map(u => u._id);

    // Build doctor profile query
    let docQuery = { userId: { $in: userIds } };

    if (specialization) {
      docQuery.specialization = specialization;
    }
    if (minExperience) {
      docQuery.experience = { $gte: Number(minExperience) };
    }
    if (maxFee) {
      docQuery.consultationFee = { $lte: Number(maxFee) };
    }
    if (day) {
      docQuery['availability.day'] = day;
    }

    let doctors = await Doctor.find(docQuery).populate({
      path: 'userId',
      select: 'name email phone profileImage'
    });

    // Client side filtering for mockup rating & gender simulation to avoid schema clutter
    let results = doctors.map(doc => {
      // Simulate doctor attributes for client filters
      const seedVal = doc.licenseNumber.charCodeAt(doc.licenseNumber.length - 1);
      const simulatedRating = (4.0 + (seedVal % 10) * 0.1).toFixed(1);
      const simulatedGender = seedVal % 2 === 0 ? 'male' : 'female';
      const simulatedLanguages = seedVal % 2 === 0 ? ['English', 'Spanish'] : ['English', 'Hindi'];
      const simulatedBio = `Dr. ${doc.userId.name} is a highly accomplished specialist in ${doc.specialization} with over ${doc.experience} years of clinical expertise. He/She has dedicated his/her career to providing personalized patient care and pioneering treatment plans.`;
      
      return {
        _id: doc._id,
        userId: doc.userId,
        specialization: doc.specialization,
        experience: `${doc.experience} years`,
        experienceVal: doc.experience,
        licenseNumber: doc.licenseNumber,
        consultationFee: doc.consultationFee,
        availability: doc.availability,
        rating: Number(simulatedRating),
        gender: simulatedGender,
        languages: simulatedLanguages,
        biography: simulatedBio,
        qualification: 'M.D., MBBS'
      };
    });

    // Apply gender filter
    if (gender) {
      results = results.filter(r => r.gender.toLowerCase() === gender.toLowerCase());
    }
    // Apply rating filter
    if (rating) {
      results = results.filter(r => r.rating >= Number(rating));
    }

    // Apply sorting
    if (sort) {
      if (sort === 'highest-rated') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'lowest-fee') {
        results.sort((a, b) => a.consultationFee - b.consultationFee);
      } else if (sort === 'most-experienced') {
        results.sort((a, b) => b.experienceVal - a.experienceVal);
      }
    }

    res.status(200).json({
      success: true,
      count: results.length,
      doctors: results
    });
  } catch (error) {
    next(error);
  }
}

export async function getDoctorById(req, res, next) {
  try {
    const doc = await Doctor.findById(req.params.id).populate({
      path: 'userId',
      select: 'name email phone profileImage'
    });

    if (!doc) {
      const error = new Error('Doctor not found');
      error.statusCode = 404;
      throw error;
    }

    // Simulate doctor extra attributes
    const seedVal = doc.licenseNumber.charCodeAt(doc.licenseNumber.length - 1);
    const simulatedRating = (4.0 + (seedVal % 10) * 0.1).toFixed(1);
    const simulatedGender = seedVal % 2 === 0 ? 'male' : 'female';
    const simulatedLanguages = seedVal % 2 === 0 ? ['English', 'Spanish'] : ['English', 'Hindi'];
    const simulatedBio = `Dr. ${doc.userId.name} is a highly accomplished specialist in ${doc.specialization} with over ${doc.experience} years of clinical expertise. He/She has dedicated his/her career to providing personalized patient care and pioneering treatment plans.`;
    
    // Simulate reviews
    const simulatedReviews = [
      {
        id: 'rev-1',
        patientName: 'Jane Smith',
        rating: 5,
        date: '2026-05-14',
        comment: 'Extremely attentive and explained the treatment options clearly. Highly recommended!'
      },
      {
        id: 'rev-2',
        patientName: 'Robert Johnson',
        rating: 4.5,
        date: '2026-06-02',
        comment: 'Great clinic environment and very professional consultation.'
      }
    ];

    const result = {
      _id: doc._id,
      userId: doc.userId,
      specialization: doc.specialization,
      experience: `${doc.experience} years`,
      licenseNumber: doc.licenseNumber,
      consultationFee: doc.consultationFee,
      availability: doc.availability,
      rating: Number(simulatedRating),
      gender: simulatedGender,
      languages: simulatedLanguages,
      biography: simulatedBio,
      qualification: 'M.D., MBBS',
      reviews: simulatedReviews
    };

    res.status(200).json({
      success: true,
      doctor: result
    });
  } catch (error) {
    next(error);
  }
}
