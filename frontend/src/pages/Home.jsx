import { Link } from 'react-router-dom';
import PublicNavbar from '../components/navbar/PublicNavbar';
import { LANDING_DOCTORS, LANDING_FEATURES } from '../utils/constants';

const featureIcons = {
  calendar: '📅',
  stethoscope: '🩺',
  document: '📄',
  shield: '🛡️',
};

function Illustration() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-brand-200/40 blur-3xl" />
      <div className="grid gap-4 rounded-[2.5rem] border border-white/70 bg-white p-4 shadow-[0_30px_90px_rgba(15,23,42,0.15)] sm:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white/10 ring-8 ring-white/10">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-2xl text-brand-800">👨‍⚕️</div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-brand-100/90">Doctor profile</p>
              <h3 className="mt-2 text-2xl font-semibold">Dr. Daniel Carter</h3>
              <p className="mt-1 text-sm text-slate-200">Cardiology</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-white/10 p-4">
            <p className="text-sm font-medium text-brand-100">Hospital graphic</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              <div className="col-span-2 rounded-2xl bg-white/15 p-4">
                <div className="mb-2 h-3 w-16 rounded-full bg-white/50" />
                <div className="h-16 rounded-2xl bg-white/20" />
              </div>
              <div className="col-span-2 rounded-2xl bg-white/15 p-4">
                <div className="mb-2 h-3 w-12 rounded-full bg-white/50" />
                <div className="h-16 rounded-2xl bg-brand-500/60" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] bg-slate-50 p-4">
          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Healthcare dashboard</p>
                <h4 className="mt-1 text-lg font-semibold text-slate-950">Live overview</h4>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Secure</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Patients', '128'],
                ['Appointments', '24'],
                ['Prescriptions', '39'],
                ['Reports', '12'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Medical dashboard mockup</p>
            <div className="mt-3 space-y-3">
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-3/4 rounded-full bg-brand-600" />
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-2/5 rounded-full bg-brand-400" />
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-5/6 rounded-full bg-slate-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div id="home" className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(19,165,127,0.12),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)]">
      <PublicNavbar />

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              Modern healthcare SaaS for patients and staff
            </span>
            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Healthcare Made Simple</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Book appointments, consult doctors, manage prescriptions, and access healthcare services online.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register" className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 sm:w-auto">
                Get Started
              </Link>
              <a href="#doctors" className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700 sm:w-auto">
                Find Doctors
              </a>
            </div>
          </div>

          <Illustration />
        </section>

        <section id="about" className="mt-20 grid gap-6 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">About</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">A modern frontend foundation for every hospital role.</h2>
          </div>
          <p className="text-base leading-8 text-slate-600">
            Phase 2 connects the polished landing experience to backend authentication, while preserving the existing layout and making each section feel more clinical and product-like.
          </p>
        </section>

        <section id="doctors" className="mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Doctors</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Featured specialists</h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {LANDING_DOCTORS.map((doctor) => (
              <article key={doctor.name} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-2xl">👩‍⚕️</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{doctor.specialty}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{doctor.experience}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-slate-950">{doctor.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Available for consultations, follow-ups, and digital care support.</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-brand-200" />
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-300" />
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-brand-400" />
                  </div>
                  <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700">
                    View Profile
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="mt-20">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Features</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Everything a modern healthcare platform needs</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {LANDING_FEATURES.map((feature) => (
              <article key={feature.title} className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-2xl transition group-hover:scale-105">
                  {featureIcons[feature.icon]}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer id="contact" className="mt-20 rounded-[2rem] bg-slate-950 px-6 py-10 text-white sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Contact</h3>
              <p className="mt-4 text-slate-200">support@medicare.local</p>
              <p className="mt-2 text-sm text-slate-400">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Address</h3>
              <p className="mt-4 max-w-xs text-slate-200">123 Wellness Avenue, Health District, City Center</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">Quick Links</h3>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
                <a href="#home" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/10">
                  Home
                </a>
                <a href="#about" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/10">
                  About
                </a>
                <a href="#doctors" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/10">
                  Doctors
                </a>
                <a href="#features" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/10">
                  Features
                </a>
                <a href="#contact" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/10">
                  Contact
                </a>
                <Link to="/login" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/10">
                  Login
                </Link>
                <Link to="/register" className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/10">
                  Register
                </Link>
              </div>
              <p className="mt-5 text-sm text-slate-400">Social Media: LinkedIn, Instagram, Facebook</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}