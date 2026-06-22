import { forwardRef } from 'react';
import Input from './Input';

const FormField = forwardRef(function FormField({ label, error, hint, className = '', ...props }, ref) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <Input ref={ref} aria-invalid={Boolean(error)} {...props} />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
});

export default FormField;
