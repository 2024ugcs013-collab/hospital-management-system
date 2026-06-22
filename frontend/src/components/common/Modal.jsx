export default function Modal({ children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div role="dialog" className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

