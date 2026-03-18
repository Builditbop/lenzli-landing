import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: March 8, 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          <Section title="Introduction">
            <p>Lenzli ("we," "our," or "us") is a social networking platform for photographers, filmmakers, and visual creators. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Platform").</p>
            <p>By accessing or using Lenzli, you agree to this Privacy Policy. If you do not agree, please do not access the Platform.</p>
          </Section>

          <Section title="Information We Collect">
            <h4 className="font-semibold text-black mt-4 mb-2">Information You Provide</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
              <li><strong>Profile Information:</strong> Location, professional roles, gear, shooting styles, and sample work you choose to share.</li>
              <li><strong>Waitlist Information:</strong> Your email address if you join our waitlist.</li>
              <li><strong>Communications:</strong> Content of messages you send to other users or to us.</li>
            </ul>
            <h4 className="font-semibold text-black mt-4 mb-2">Information Collected Automatically</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> Pages viewed, features used, and actions taken on the Platform.</li>
              <li><strong>Device Information:</strong> Device type, operating system, and browser type.</li>
              <li><strong>Location Data:</strong> With your permission, approximate location to connect you with nearby creators.</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and maintain your account</li>
              <li>Connect you with photographers and filmmakers based on style, gear, location, and interests</li>
              <li>Facilitate real-time help pings and collaboration requests</li>
              <li>Send updates about the Platform, features, and security</li>
              <li>Improve and optimize performance and user experience</li>
              <li>Respond to inquiries and provide support</li>
              <li>Detect and prevent technical issues or fraud</li>
            </ul>
          </Section>

          <Section title="Information Sharing">
            <p>We do not sell your personal information. We may share information in these circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>With Other Users:</strong> Profile information visible to other users as part of discovery and connection features.</li>
              <li><strong>Service Providers:</strong> Third-party providers that help operate the Platform (cloud hosting, analytics).</li>
              <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process.</li>
              <li><strong>Safety:</strong> When necessary to protect the safety of our users or the public.</li>
            </ul>
          </Section>

          <Section title="Data Security">
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption, secure infrastructure, and access controls.</p>
            <p>No method of transmission or storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
          </Section>

          <Section title="Your Rights and Choices">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of personal information we hold about you.</li>
              <li><strong>Correction:</strong> Update or correct profile information through account settings.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data.</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from promotional emails using the link in those messages.</li>
              <li><strong>Location:</strong> Disable location services through your device settings.</li>
            </ul>
          </Section>

          <Section title="Data Retention">
            <p>We retain your personal information for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymize your information within 30 days, except where required for legal or legitimate business purposes.</p>
          </Section>

          <Section title="Cookies and Tracking">
            <p>We use essential cookies to maintain your session. We may also use analytics tools to understand Platform usage. You can manage cookie preferences through your browser settings.</p>
          </Section>

          <Section title="Children's Privacy">
            <p>Lenzli is not intended for users under 16. We do not knowingly collect information from children. If we become aware we have collected information from a child under 16, we will delete it promptly.</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy and changing the "Last updated" date. Continued use after changes constitutes acceptance.</p>
          </Section>

          <Section title="Contact Us">
            <p>If you have questions about this Privacy Policy or our data practices:</p>
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="font-semibold text-black">Lenzli</p>
              <p>Email: privacy@lenzli.com</p>
            </div>
          </Section>
        </div>
      </main>
      <Footer current="privacy" />
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
