import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardShell from '../../components/dashboard/DashboardShell';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { patientSidebarItems } from '../../data/patientNavigation';
import { getPatientProfile, updatePatientProfile } from '../../services/patientService';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const emptyProfile = {
  name: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  bloodGroup: '',
  address: '',
  emergencyContact: '',
  allergies: '',
  medicalConditions: '',
};

const controlClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100';

function formatMemberSince(value) {
  if (!value) return 'Recently joined';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently joined';
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date);
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="border-b border-slate-100 pb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({ defaultValues: emptyProfile });

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setLoadError('');
        const result = await getPatientProfile();
        if (!active) return;
        const values = { ...emptyProfile, ...result, age: result?.age ?? '' };
        setProfile(values);
        reset(values);
      } catch (error) {
        if (active) {
          setLoadError(error.response?.data?.message || 'We could not load your profile. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [reset]);

  const watchedValues = watch();
  const completion = useMemo(() => {
    const fields = ['name', 'phone', 'age', 'gender', 'bloodGroup', 'address', 'emergencyContact'];
    const completed = fields.filter((field) => Boolean(String(watchedValues[field] ?? '').trim())).length;
    return Math.round((completed / fields.length) * 100);
  }, [watchedValues]);

  const initials = (watchedValues.name || user?.name || 'Patient')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const onSubmit = async (values) => {
    try {
      setMessage(null);
      const response = await updatePatientProfile({
        ...values,
        name: values.name.trim(),
        phone: values.phone.trim(),
        age: values.age === '' ? null : Number(values.age),
        address: values.address.trim(),
        emergencyContact: values.emergencyContact.trim(),
        allergies: values.allergies.trim(),
        medicalConditions: values.medicalConditions.trim(),
      });

      const savedProfile = { ...emptyProfile, ...response.profile, age: response.profile?.age ?? '' };
      setProfile(savedProfile);
      reset(savedProfile);
      updateUser?.({ name: savedProfile.name, phone: savedProfile.phone });
      setMessage({ type: 'success', text: response.message || 'Your profile has been updated.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'We could not save your changes. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <DashboardShell title="My profile" sidebarItems={patientSidebarItems}>
        <div className="grid min-h-[65vh] place-items-center rounded-3xl border border-slate-200 bg-white">
          <Loader label="Loading your profile..." />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="My profile" sidebarItems={patientSidebarItems}>
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative bg-slate-950 px-6 py-8 text-white sm:px-8">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 text-2xl font-bold shadow-lg ring-4 ring-white/10">
                {initials || 'P'}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-300">Patient profile</p>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{watchedValues.name || user?.name || 'Your profile'}</h1>
                <p className="mt-1 text-sm text-slate-300">Member since {formatMemberSince(profile?.createdAt)}</p>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:max-w-xs">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Profile completion</span>
                <span className="font-bold text-white">{completion}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-brand-400 transition-all duration-300" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {loadError}
        </div>
      ) : null}

      {message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
          role="status"
        >
          {message.text}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            eyebrow="Personal information"
            title="Basic details"
            description="Keep your contact information current so the care team can reach you when needed."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <FormField
              label="Full name"
              placeholder="Enter your full name"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Full name is required.',
                minLength: { value: 3, message: 'Enter at least 3 characters.' },
              })}
            />
            <FormField label="Email address" type="email" disabled className="opacity-75" {...register('email')} hint="Email cannot be changed here." />
            <FormField
              label="Phone number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10 digit phone number"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required.',
                pattern: { value: /^\d{10}$/, message: 'Enter exactly 10 digits.' },
              })}
            />
            <FormField
              label="Age"
              type="number"
              min="1"
              max="120"
              placeholder="Your age"
              error={errors.age?.message}
              {...register('age', {
                validate: (value) =>
                  value === '' || (Number(value) >= 1 && Number(value) <= 120) || 'Enter an age between 1 and 120.',
              })}
            />
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Gender</span>
              <select className={controlClass} {...register('gender')}>
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Blood group</span>
              <select className={controlClass} {...register('bloodGroup')}>
                <option value="">Select blood group</option>
                {bloodGroups.map((group) => <option key={group} value={group}>{group}</option>)}
              </select>
            </label>
            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Home address</span>
              <textarea rows="3" placeholder="House number, street, city, state and postal code" className={controlClass} {...register('address')} />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            eyebrow="Health information"
            title="Medical details"
            description="This information helps clinicians understand important context before a consultation."
          />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Known allergies</span>
              <textarea rows="4" placeholder="For example: Penicillin, peanuts, latex" className={controlClass} {...register('allergies')} />
              <p className="text-xs text-slate-500">Write “None known” if you have no known allergies.</p>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Existing medical conditions</span>
              <textarea rows="4" placeholder="For example: Asthma, diabetes, hypertension" className={controlClass} {...register('medicalConditions')} />
              <p className="text-xs text-slate-500">Include ongoing or long-term conditions.</p>
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            eyebrow="In case of emergency"
            title="Emergency contact"
            description="Add the phone number of someone the hospital may contact during an emergency."
          />
          <div className="mt-6 max-w-xl">
            <FormField
              label="Emergency contact number"
              type="tel"
              inputMode="numeric"
              placeholder="10 digit phone number"
              error={errors.emergencyContact?.message}
              {...register('emergencyContact', {
                pattern: { value: /^$|^\d{10}$/, message: 'Enter exactly 10 digits.' },
              })}
            />
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">{isDirty ? 'You have unsaved changes.' : 'Your profile is up to date.'}</p>
          <div className="flex gap-3">
            <Button
              type="button"
              disabled={!isDirty || isSubmitting}
              onClick={() => {
                reset(profile || emptyProfile);
                setMessage(null);
              }}
              className="flex-1 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:flex-none"
            >
              Discard
            </Button>
            <Button type="submit" busy={isSubmitting} disabled={!isDirty} className="flex-1 bg-brand-600 text-white hover:bg-brand-700 sm:flex-none">
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </DashboardShell>
  );
}
