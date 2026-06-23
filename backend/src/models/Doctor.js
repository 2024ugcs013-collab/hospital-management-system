import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		specialization: {
			type: String,
			required: true,
		},
		experience: {
			type: Number,
			required: true,
		},
		licenseNumber: {
			type: String,
			required: true,
			unique: true,
		},
		degreeCertificateUrl: {
			type: String,
			required: true,
		},
		licenseCertificateUrl: {
			type: String,
			required: true,
		},
		verificationStatus: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		consultationFee: {
			type: Number,
			default: 0,
		},
		availability: {
			type: [
				{
					day: String,
					slots: [String],
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Doctor', doctorSchema);
