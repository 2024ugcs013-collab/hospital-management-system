import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			select: false,
		},
		role: {
			type: String,
			enum: ['patient', 'doctor', 'receptionist', 'admin'],
			default: 'patient',
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		profileImage: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function savePassword(next) {
	if (!this.isModified('password')) {
		next();
		return;
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
