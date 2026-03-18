import React from "react";
import { Link } from "react-router-dom";

export default function Conduct() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-2">Code of Conduct</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: March 8, 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <Section title="Our Standards">
            <p>Lenzli is a professional community for visual creators. We expect all members to treat each other with respect, professionalism, and courtesy. This Code of Conduct applies to all interactions on the Platform, including profiles, messages, pings, and any in-person meetings facilitated through Lenzli.</p>
          </Section>

          <Section title="Be Respectful">
            <p>Treat every creator with dignity regardless of their experience level, background, gender, ethnicity, orientation, age, or ability. Constructive feedback is welcome; personal attacks are not. Disagree with ideas, not people.</p>
          </Section>

          <Section title="Be Professional">
            <p>Lenzli is a space for creative work and collaboration. Keep interactions professional and relevant to photography, filmmaking, and visual arts. Honor your commitments — if you agree to a shoot or collaboration, follow through or communicate clearly if plans change.</p>
          </Section>

          <Section title="Be Inclusive">
            <p>We welcome creators of all backgrounds, styles, and experience levels. Do not discriminate or exclude anyone based on personal characteristics. Celebrate the diversity of perspectives that make our creative community stronger.</p>
          </Section>

          <Section title="Content Standards">
            <p>All content shared on Lenzli must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be your own work or content you have permission to share</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Not contain illegal, explicit, or harmful material</li>
              <li>Not promote violence, hate speech, or discrimination</li>
              <li>Include proper credits and model releases where applicable</li>
            </ul>
          </Section>

          <Section title="Harassment Policy">
            <p>Harassment of any kind is not tolerated. This includes but is not limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Unwanted sexual advances or attention</li>
              <li>Intimidation, stalking, or threatening behavior</li>
              <li>Sustained disruption of someone's work or communications</li>
              <li>Publishing someone's private information without consent</li>
              <li>Retaliating against someone who has reported a violation</li>
            </ul>
          </Section>

          <Section title="Fair Collaboration">
            <p>When collaborating with other creators:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Discuss compensation, credit, and usage rights clearly before starting</li>
              <li>Respect the terms you agree upon</li>
              <li>Give proper credit to all contributors</li>
              <li>Do not use someone's work beyond what was agreed upon</li>
            </ul>
          </Section>

          <Section title="Consequences">
            <p>Violations of this Code of Conduct may result in:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A warning and request to modify behavior</li>
              <li>Temporary suspension of your account</li>
              <li>Permanent removal from the Platform</li>
              <li>Reporting to relevant authorities when appropriate</li>
            </ul>
            <p>The severity of the action taken depends on the nature and frequency of the violation.</p>
          </Section>

          <Section title="Reporting Violations">
            <p>If you witness or experience a violation of this Code of Conduct, please report it. All reports are treated with confidentiality and are reviewed promptly.</p>
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-semibold text-black">Lenzli Community Team</p>
              <p>Email: conduct@lenzli.com</p>
            </div>
          </Section>
        </div>
      </main>
      <Footer current="conduct" />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="border-l-2 border-black pl-6">
      <h3 className="text-xl font-bold text-black mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <svg aria-hidden viewBox="0 0 48 48" className="h-7 w-7" fill="none"><rect x="3" y="3" width="42" height="42" rx="12" stroke="#000" strokeWidth="2" /><circle cx="24" cy="24" r="9" stroke="#000" strokeWidth="2" /><path d="M24 15v18M15 24h18" stroke="#000" strokeWidth="1.5" strokeOpacity="0.4" /></svg>
          <span className="text-xl font-bold tracking-tight text-black">Lenzli</span>
        </Link>
        <Link to="/" className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-all text-gray-700">Back to Home</Link>
      </nav>
    </header>
  );
}

function Footer({ current }) {
  const links = [
    { to: '/privacy', label: 'Privacy' },
    { to: '/terms', label: 'Terms' },
    { to: '/safety', label: 'Safety' },
    { to: '/conduct', label: 'Conduct' },
  ];
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <svg aria-hidden viewBox="0 0 48 48" className="h-5 w-5" fill="none"><rect x="3" y="3" width="42" height="42" rx="12" stroke="#000" strokeWidth="2" /><circle cx="24" cy="24" r="9" stroke="#000" strokeWidth="2" /><path d="M24 15v18M15 24h18" stroke="#000" strokeWidth="1.5" strokeOpacity="0.4" /></svg>
          <span className="font-medium">Lenzli © {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6 text-gray-500 text-sm">
          {links.map(l => l.to === `/${current}` ? <span key={l.to} className="text-black font-medium">{l.label}</span> : <Link key={l.to} to={l.to} className="hover:text-black transition font-medium">{l.label}</Link>)}
        </div>
      </div>
    </footer>
  );
}
