export default function Button({ children, type = 'button', className = '', busy = false, ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={busy || props.disabled}
      {...props}
    >
      {busy ? 'Please wait...' : children}
    </button>
  );
}

