import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/navbar/PublicNavbar';
import { getDoctors } from '../services/doctorService';

function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-8 text-slate-600">{description}</p> : null}
    </div>
  );
}

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function IconBadge({ children }) {
  return <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition duration-300 group-hover:scale-105">{children}</div>;
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-brand-200/40 blur-3xl" />
      <div className="grid gap-4 rounded-[2.5rem] border border-white/70 bg-white p-4 shadow-[0_30px_90px_rgba(15,23,42,0.12)] sm:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-6 text-white transition duration-500 hover:-translate-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-brand-100/90">Premium care platform</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight">A calmer way to book, consult, and follow up.</h3>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-200">A refined experience for patients, doctors, and hospital teams, designed to feel fast, clear, and trustworthy.</p>
          <div className="mt-8 grid gap-3 text-sm text-slate-100">
            {['Instant booking flow', 'Role-based access', 'Polished clinical workspace'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition duration-300 hover:bg-white/10">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] bg-slate-50 p-4 transition duration-500 hover:-translate-y-1">
          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Patient journey</p>
            <h4 className="mt-2 text-lg font-semibold text-slate-950">Built around confidence and speed</h4>
            <p className="mt-3 text-sm leading-7 text-slate-600">Clean spacing and strong hierarchy help the entire experience feel premium from the first screen.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Fast onboarding', 'Move from interest to action with fewer steps.'],
              ['Clear communication', 'Keep patients and staff aligned at every stage.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[1.5rem] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <article className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
      <IconBadge>{icon}</IconBadge>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

function SpecialtyCard({ title, count, note }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
      <p className="text-sm font-medium text-brand-700">{count} doctors</p>
      <h3 className="mt-3 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
    </article>
  );
}

function ProcessStep({ step, title, description }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">{step}</div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

function TestimonialCard({ name, role, quote }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm leading-7 text-slate-600">“{quote}”</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">{name.slice(0, 1)}</div>
        <div>
          <p className="text-sm font-semibold text-slate-950">{name}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
    </article>
  );
}

function FaqItem({ q, a }) {
  return (
    <details className="group rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 open:shadow-md">
      <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">{q}</summary>
      <p className="mt-3 text-sm leading-7 text-slate-600">{a}</p>
    </details>
  );
}

export default function Home() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors().then(setDoctors).catch(() => setDoctors([]));
  }, []);

  const stats = useMemo(() => {
    const specialties = new Set(doctors.map((doctor) => doctor.specialization).filter(Boolean));
    return [
      { label: 'Specialists', value: doctors.length || '—', detail: 'Verified doctors available on the platform.' },
      { label: 'Specialties', value: specialties.size || '—', detail: 'A growing clinical network across departments.' },
      { label: 'Patient-first', value: '24/7', detail: 'Designed for round-the-clock access and clarity.' },
    ];
  }, [doctors]);

  const specialtyCards = useMemo(() => {
    const map = new Map();
    doctors.forEach((doctor) => {
      const key = doctor.specialization || 'General Medicine';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).slice(0, 6).map(([title, count]) => ({
      title,
      count,
      note: 'Care teams ready for consultation, coordination, and follow-up.' ,
    }));
  }, [doctors]);

  const featuredDoctors = useMemo(() => doctors.slice(0, 3), [doctors]);

  const features = [
    ['📅', 'Smart appointment flow', 'Guide patients from discovery to booking with fewer distractions.'],
    ['🛡️', 'Secure role-based access', 'Keep clinical data organized with clear access boundaries.'],
    ['💬', 'Better patient communication', 'Present every next step with calm, readable messaging.'],
    ['📄', 'Digital records and prescriptions', 'Support a paperless workflow without losing clarity.'],
  ];

  const steps = [
    ['01', 'Search and select', 'Browse specialists by department and find the right care path.'],
    ['02', 'Book in seconds', 'Choose a suitable slot and confirm with a simple flow.'],
    ['03', 'Stay connected', 'Use a clean dashboard to manage follow-ups and records.'],
  ];

  const testimonials = [
    ['Aarav Mehta', 'Patient', 'The interface feels calm, modern, and easy to understand. Booking took only a few clicks.'],
    ['Dr. Sarah Lewis', 'Cardiologist', 'The layout makes the platform feel credible and efficient for both staff and patients.'],
    ['Nina Shah', 'Receptionist', 'Everything is spaced well and simple to navigate, which makes front-desk work smoother.'],
  ];

  const faqs = [
    ['How do I book an appointment?', 'Create an account, choose a specialist, and follow the guided booking flow.'],
    ['Can I access my records later?', 'Yes. The platform is structured to keep patient information organized for follow-up care.'],

  ];

  return (
    <div id="home" className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(19,165,127,0.14),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)]">
      <PublicNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-8">
            
            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Modern healthcare, designed to feel premium from the first screen.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                A polished hospital experience for appointment booking, specialist discovery, patient communication, and care coordination.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(19,165,127,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-brand-700 sm:w-auto">
                Book Appointment
              </Link>
              <Link to="/register" className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 sm:w-auto">
                Register
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>
          </div>

          <HeroIllustration />
        </section>

        <section className="mt-14 rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur lg:p-10">
          <SectionHeading
            eyebrow="Why it works"
            title="Clear structure, premium spacing, and a calmer visual hierarchy."
            description="The experience stays focused on what matters most: finding care, booking faster, and making the platform feel trustworthy."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map(([icon, title, description]) => <FeatureCard key={title} icon={icon} title={title} description={description} />)}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Specialties"
            title="Find the right doctor by specialty."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specialtyCards.map((item) => <SpecialtyCard key={item.title} {...item} />)}
            {!specialtyCards.length ? <p className="text-slate-500"></p> : null}
          </div>
        </section>

        <section id="doctors" className="mt-16">
          <SectionHeading
            eyebrow="Doctors"
            title="Featured specialists"
            description="A quick preview of the care team available through the platform."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredDoctors.map((doctor) => (
              <article key={doctor._id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-2xl">👩‍⚕️</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">{doctor.specialization || 'Specialist'}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">Dr. {doctor.userId?.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Consultations, follow-ups, and dependable care coordination.</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">Professional profiles with clear next steps.</p>
                  <Link to={`/doctors/${doctor._id}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700">View profile</Link>
                </div>
              </article>
            ))}
            {!featuredDoctors.length ? <p className="text-slate-500"></p> : null}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="How it works"
            title="Simple enough for patients, structured enough for staff."
            align="center"
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map(([step, title, description]) => <ProcessStep key={step} step={step} title={title} description={description} />)}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by patients and care teams."
            description="Short, credible feedback that matches the tone of a premium healthcare product."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map(([name, role, quote]) => <TestimonialCard key={name} name={name} role={role} quote={quote} />)}
          </div>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions, answered clearly."
            description="Keep the landing page reassuring without adding clutter."
          />
          <div className="space-y-4">
            {faqs.map(([q, a]) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </section>

        <footer id="contact" className="mt-16 rounded-[2rem] bg-slate-950 px-6 py-10 text-white sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-100">Hospital management platform</p>
              <h3 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Premium healthcare operations, made easier to use.</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">A polished finish for patients, doctors, and staff with a clean, modern interface that feels reliable on every screen.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link to="/register" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">Book Appointment</Link>
              <Link to="/login" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Login</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
