import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import AuthForm from '../../components/forms/AuthForm';
import { useAuth } from '../../context/AuthContext';
import { AUTH_TABS, ROLE_DASHBOARD_PATHS, USER_ROLES } from '../../utils/constants';

const fileAccept = '.pdf,.jpg,.jpeg,.png';

function strongPassword(value) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value) || 'Use 8+ characters with upper, lower, number, and symbol.';
}

export default function Register() {
  const [role, setRole] = useState(USER_ROLES.PATIENT);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { registerPatient, registerDoctor } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      medicalLicenseNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setMessage('');
    setUploadProgress(0);
    reset();
  };

  const onSubmit = async (values) => {
    try {
      setMessage('');
      if (role === USER_ROLES.PATIENT) {
        await registerPatient({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        });
      } else {
        const payload = {
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          specialization: values.specialization,
          experience: values.experience,
          licenseNumber: values.medicalLicenseNumber,
          degreeCertificate: values.degreeCertificate?.[0],
          licenseCertificate: values.licenseCertificate?.[0],
          password: values.password,
        };

        await registerDoctor(payload, (event) => {
          if (event.total) {
            setUploadProgress(Math.round((event.loaded * 100) / event.total));
          }
        });
      }

      setMessage('Registration successful. Redirecting to login...');
      window.setTimeout(() => {
        navigate('/login', { replace: true, state: { registeredEmail: values.email } });
      }, 900);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthForm
      title="Create your account"
      description="Choose the correct role to personalize the experience across appointments, records, and operations."
      footer={
        <span>
          Already registered? <Link to="/login" className="font-semibold text-brand-700">Back to login</Link>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Register</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">Patient is selected by default. Switch to doctor when needed.</p>
        </div>

        {message ? <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">{message}</div> : null}

        {role === USER_ROLES.DOCTOR && uploadProgress > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Upload progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          {AUTH_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchRole(tab.id)}
              className={
                role === tab.id
                  ? 'rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-brand-700 shadow-sm'
                  : 'rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:text-slate-900'
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <FormField
          label="Full Name"
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          {...register('fullName', {
            required: 'Full name is required.',
            minLength: { value: 3, message: 'Full name must be at least 3 characters.' },
          })}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address.',
            },
          })}
        />

        <FormField
          label="Phone"
          type="tel"
          placeholder="10 digit phone number"
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Phone is required.',
            pattern: { value: /^\d{10}$/, message: 'Phone number must contain exactly 10 digits.' },
          })}
        />

        {role === USER_ROLES.DOCTOR ? (
          <>
            <FormField
              label="Specialization"
              placeholder="Cardiology, Pediatrics, Orthopedics..."
              error={errors.specialization?.message}
              {...register('specialization', { required: 'Specialization is required.' })}
            />

            <FormField
              label="Experience"
              type="number"
              min="0"
              placeholder="Years of experience"
              error={errors.experience?.message}
              {...register('experience', {
                required: 'Experience is required.',
                validate: (value) => Number(value) >= 0 || 'Experience must be zero or greater.',
              })}
            />

            <FormField
              label="Medical License Number"
              placeholder="License ID"
              error={errors.medicalLicenseNumber?.message}
              {...register('medicalLicenseNumber', { required: 'Medical license number is required.' })}
            />

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Degree Certificate Upload</span>
              <input
                type="file"
                accept={fileAccept}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                {...register('degreeCertificate', { required: 'Degree certificate is required.' })}
              />
              <p className="text-xs text-slate-500">{watch('degreeCertificate')?.[0]?.name || 'No file selected'}</p>
              {errors.degreeCertificate?.message ? <p className="text-sm text-rose-600">{errors.degreeCertificate.message}</p> : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">License Certificate Upload</span>
              <input
                type="file"
                accept={fileAccept}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm file:mr-4 file:rounded-full file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                {...register('licenseCertificate', { required: 'License certificate is required.' })}
              />
              <p className="text-xs text-slate-500">{watch('licenseCertificate')?.[0]?.name || 'No file selected'}</p>
              {errors.licenseCertificate?.message ? <p className="text-sm text-rose-600">{errors.licenseCertificate.message}</p> : null}
            </label>
          </>
        ) : null}

        <FormField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required.',
            validate: strongPassword,
          })}
        />

        <FormField
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password.',
            validate: (value) => value === watch('password') || 'Passwords do not match.',
          })}
        />

        <Button type="submit" className="w-full bg-brand-600 text-white hover:bg-brand-700" busy={isSubmitting}>
          Create Account
        </Button>

        <p className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-slate-700">
          File uploads are sent as FormData. Allowed formats: PDF, JPG, and PNG.
        </p>
      </form>
    </AuthForm>
  );
}
