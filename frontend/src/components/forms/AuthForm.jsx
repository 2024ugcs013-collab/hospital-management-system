export default function AuthForm({ children, title, description, footer }) {
  return (
    <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 px-8 py-10 text-white lg:block lg:px-10 xl:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">MediCare Cloud</p>
        <h1 className="mt-6 max-w-lg text-4xl font-semibold tracking-tight xl:text-5xl">{title}</h1>
        {description ? <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200 xl:text-base">{description}</p> : null}
        <div className="mt-12 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm font-semibold text-brand-100">Why this matters</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li>Role-based access across all hospital teams</li>
            <li>Mock sessions that persist through refreshes</li>
            <li>Production-ready structure for backend integration later</li>
          </ul>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 lg:hidden">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">MediCare Cloud</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
            {description ? <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p> : null}
          </div>
          {children}
          {footer ? <div className="mt-6 text-center text-sm text-slate-600">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}
