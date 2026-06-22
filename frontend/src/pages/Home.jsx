import { Link } from 'react-router-dom';
import PublicNavbar from '../components/navbar/PublicNavbar';
import { LANDING_FEATURES } from '../utils/constants';

function Illustration() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-brand-200/40 blur-3xl" />
      <div className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white p-4 shadow-[0_30px_90px_rgba(15,23,42,0.15)]">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-6 text-white">
          <div className="grid gap-4 sm:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.5rem] bg-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-brand-100/90">Healthcare</p>
              <h3 className="mt-4 text-2xl font-semibold">Smart, connected care</h3>
              <p className="mt-3 text-sm leading-7 text-slate-200">A polished mock illustration for the hero panel, showing patient monitoring and service cards.</p>
            </div>
            <div className="space-y-3">
              <div className="rounded-[1.5rem] bg-white/10 p-4">
                <p className="text-sm text-slate-200">Appointments today</p>
                <p className="mt-2 text-3xl font-semibold">18</p>
              </div>
              <div className="rounded-[1.5rem] bg-brand-500/20 p-4 backdrop-blur">
                <p className="text-sm text-brand-100">Secure records</p>
                <p className="mt-2 text-sm text-slate-200">Protected by role-based access and mock authentication.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {['Patients', 'Doctors', 'Reception', 'Admin'].slice(0, 3).map((item) => (
              <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-slate-100">
                {item}
              </div>
            ))}
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

        
        <section id="doctors" className="mt-20">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              { name: 'Dr. Daniel Carter', specialty: 'Cardiology', experience: '8 years' },
              { name: 'Dr. Emily Patel', specialty: 'Pediatrics', experience: '6 years' },
              { name: 'Dr. Hassan Malik', specialty: 'Orthopedics', experience: '12 years' },
            ].map((doctor) => (
              <article key={doctor.name} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">+</div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{doctor.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{doctor.specialty}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{doctor.experience} of experience in patient-centered care.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="mt-20">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {LANDING_FEATURES.map((feature) => (
              <article key={feature.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">+</div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h2>
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