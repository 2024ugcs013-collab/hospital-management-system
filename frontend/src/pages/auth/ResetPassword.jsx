import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import AuthForm from '../../components/forms/AuthForm';
import { resetPassword } from '../../services/authService';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => params.get('token') || '', [params]);
  const email = params.get('email') || '';
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await resetPassword({ token, password: values.password });
      navigate('/login', { replace: true, state: { registeredEmail: email } });
    } catch (error) {
      setError('root', { message: error.response?.data?.message || error.message });
    }
  };

  return (
    <AuthForm
      title="Set a new password"
      description="Use the link from your email to create a new password."
      footer={
        <span>
          Back to <Link to="/login" className="font-semibold text-brand-700">login</Link>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Reset Password</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Choose a new password</h2>
          <p className="mt-2 text-sm text-slate-500">{token ? `Resetting password for ${email || 'your account'}.` : 'Missing reset token.'}</p>
        </div>

        {errors.root?.message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errors.root.message}</div> : null}

        <FormField
          label="New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter a new password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required.',
            minLength: { value: 8, message: 'Password must be at least 8 characters.' },
          })}
        />

        <FormField
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat the new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password.',
            validate: (value) => value === watch('password') || 'Passwords do not match.',
          })}
        />

        <Button type="submit" className="w-full bg-brand-600 text-white hover:bg-brand-700" busy={isSubmitting} disabled={!token}>
          Update Password
        </Button>
      </form>
    </AuthForm>
  );
}
