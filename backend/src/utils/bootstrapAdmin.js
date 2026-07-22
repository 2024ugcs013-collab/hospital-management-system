import User from '../models/User.js';

export async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@hospital.local';
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name: 'System Administrator', email, phone: '9999999999',
      password: process.env.ADMIN_PASSWORD || 'password123', role: 'admin', isVerified: true,
    });
    console.log(`Demo admin created: ${email}`);
  }
}
