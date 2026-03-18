import React from "react";
import { Link } from "react-router-dom";

export default function Safety() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-2">Safety</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: March 8, 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <Section title="Our Commitment">
            <p>Lenzli is committed to building a safe environment for photographers, filmmakers, and visual creators. We take the safety of our community seriously and have measures in place to protect you.</p>
          </Section>

          <Section title="Reporting">
            <p>If you encounter behavior that violates our guidelines or makes you feel unsafe, you can report it directly through the app. Reports are reviewed by our team and are kept confidential. You can report:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Inappropriate or harmful content</li>
              <li>Harassment or threatening behavior</li>
              <li>Fake or impersonating accounts</li>
              <li>Spam or scams</li>
              <li>Any behavior that violates our Code of Conduct</li>
            </ul>
          </Section>

          <Section title="Blocking">
            <p>You can block any user at any time. Blocked users cannot view your profile, send you messages, or interact with your content. Blocking is private — the other person will not be notified.</p>
          </Section>

          <Section title="Content Moderation">
            <p>We review content that is reported by users and may use automated tools to detect content that violates our guidelines. Content that is illegal, explicit, violent, or otherwise harmful will be removed. Repeated violations may result in account suspension or termination.</p>
          </Section>

          <Section title="Meeting In Person">
            <p>Lenzli connects creators for professional collaboration, which may involve meeting in person for shoots. We recommend:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Meeting in public, well-lit locations for the first time</li>
              <li>Telling a friend or family member where you are going and who you are meeting</li>
              <li>Trusting your instincts — if something feels wrong, leave</li>
              <li>Verifying the other person's identity and portfolio before meeting</li>
              <li>Not sharing personal details like your home address until trust is established</li>
            </ul>
          </Section>

          <Section title="Account Security">
            <p>Protect your account by using a strong, unique password and being cautious of phishing attempts. Lenzli will never ask for your password via email or message. If you suspect your account has been compromised, change your password immediately and contact us.</p>
          </Section>

          <Section title="Data Protection">
            <p>Your data is encrypted in transit and at rest. We follow industry best practices for security and regularly review our systems. For full details on how we handle your data, see our <Link to="/privacy" className="text-black font-semibold hover:underline">Privacy Policy</Link>.</p>
          </Section>

          <Section title="Contact">
            <p>If you have safety concerns or need to report an urgent issue:</p>
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-semibold text-black">Lenzli Safety Team</p>
              <p>Email: safety@lenzli.com</p>
            </div>
          </Section>
        </div>
      </main>
      <Footer current="safety" />
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
