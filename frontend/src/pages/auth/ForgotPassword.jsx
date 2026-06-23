import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import AuthForm from '../../components/forms/AuthForm';
import { forgotPassword } from '../../services/authService';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      setMessage('');
      await forgotPassword(values);
      setSubmitted(true);
      setMessage('Password reset request submitted.');
    } catch (error) {
      setSubmitted(false);
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthForm
      title="Reset access"
      description="Capture the reset request now."
      footer={
        <span>
          Remembered your password? <Link to="/login" className="font-semibold text-brand-700">Return to login</Link>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Forgot Password</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Send a reset request</h2>
          <p className="mt-2 text-sm text-slate-500">We will validate the email input and show a success state.</p>
        </div>

        {message ? <div className={`rounded-2xl px-4 py-3 text-sm ${submitted ? 'border border-brand-200 bg-brand-50 text-brand-800' : 'border border-rose-200 bg-rose-50 text-rose-700'}`}>{message}</div> : null}

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

        <Button type="submit" className="w-full bg-brand-600 text-white hover:bg-brand-700" busy={isSubmitting}>
          Send Reset Link
        </Button>
      </form>
    </AuthForm>
  );
}
