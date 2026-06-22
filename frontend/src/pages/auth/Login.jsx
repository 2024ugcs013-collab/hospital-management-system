import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import AuthForm from '../../components/forms/AuthForm';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../utils/helpers';

export default function Login() {
  const { login, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: location.state?.registeredEmail || '',
      password: '',
      rememberMe: true,
    },
  });

  useEffect(() => {
    if (isAuthenticated && userRole) {
      navigate(getDashboardPath(userRole), { replace: true });
    }
  }, [isAuthenticated, navigate, userRole]);

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (error) {
      setError('root', { message: error.message });
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      description="Sign in to continue managing appointments, prescriptions, patient records, and operational tasks."
      footer={
        <span>
          New here? <Link to="/register" className="font-semibold text-brand-700">Create an account</Link>
        </span>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Login</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to your account</h2>
          
        </div>

        {errors.root?.message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errors.root.message}</div> : null}

        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-slate-700">
          
          
        </div>

        <FormField
          label="Email"
          type="email"
          autoComplete="email"
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
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required.',
            minLength: { value: 8, message: 'Password must be at least 8 characters.' },
          })}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" {...register('rememberMe')} />
            Remember Me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-brand-600 text-white hover:bg-brand-700" busy={isSubmitting}>
          Login
        </Button>
      </form>
    </AuthForm>
  );
}
