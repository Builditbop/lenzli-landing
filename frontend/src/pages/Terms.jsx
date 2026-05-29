import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: March 8, 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <Section title="Acceptance of Terms">
            <p>By accessing or using Lenzli, you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform. We may update these terms at any time, and continued use constitutes acceptance of changes.</p>
          </Section>

          <Section title="Account Registration">
            <p>To use certain features, you must create an account. You agree to provide accurate information, keep your credentials secure, and are responsible for all activity under your account. You must be at least 16 years old to create an account.</p>
          </Section>

          <Section title="User Content">
            <p>You retain ownership of content you post on Lenzli, including photos, videos, and text. By posting content, you grant Lenzli a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content within the Platform to facilitate its features.</p>
            <p>You are responsible for ensuring you have the rights to content you post and that it does not infringe on any third-party rights.</p>
          </Section>

          <Section title="Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation</li>
              <li>Use the Platform to spam, solicit, or distribute unsolicited content</li>
              <li>Attempt to gain unauthorized access to other accounts or Platform systems</li>
              <li>Use automated tools (bots, scrapers) to access the Platform without permission</li>
              <li>Interfere with or disrupt the Platform's infrastructure or other users' experience</li>
            </ul>
          </Section>

          <Section title="Intellectual Property">
            <p>The Lenzli name, logo, design, and all associated intellectual property are owned by Lenzli. You may not use our trademarks without written permission. The Platform's software, design, and original content are protected by copyright and other laws.</p>
          </Section>

          <Section title="Termination">
            <p>We may suspend or terminate your account at any time for violations of these terms, harmful behavior, or at our discretion. You may delete your account at any time through your settings. Upon termination, your right to use the Platform ceases immediately.</p>
          </Section>

          <Section title="Disclaimers">
            <p>Lenzli is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the Platform will be uninterrupted, error-free, or meet your specific requirements. We are not responsible for content posted by users or interactions between users.</p>
          </Section>

          <Section title="Limitation of Liability">
            <p>To the maximum extent permitted by law, Lenzli shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including loss of profits, data, or goodwill.</p>
          </Section>

          <Section title="Governing Law">
            <p>These Terms are governed by and construed in accordance with the laws of the United States. Any disputes arising from these terms will be resolved through binding arbitration or in a court of competent jurisdiction.</p>
          </Section>

          <Section title="Contact">
            <p>For questions about these Terms of Service:</p>
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-semibold text-black">Lenzli</p>
              <p>Email: legal@lenzli.com</p>
            </div>
          </Section>
        </div>
      </main>
      <Footer current="terms" />
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
