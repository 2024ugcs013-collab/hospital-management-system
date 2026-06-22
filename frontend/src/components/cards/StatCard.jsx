export default function StatCard({ title, value, description }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</h3>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
    </article>
  );
}

