import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		age: {
			type: Number,
			default: null,
		},
		gender: {
			type: String,
			default: '',
		},
		bloodGroup: {
			type: String,
			default: '',
		},
		address: {
			type: String,
			default: '',
		},
		emergencyContact: {
			type: String,
			default: '',
		},
		allergies: {
			type: String,
			default: '',
			trim: true,
		},
		medicalConditions: {
			type: String,
			default: '',
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Patient', patientSchema);
