import React, { useState } from "react";

// Lightweight, dependency-free animations via CSS keyframes.

export default function LenzliLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Inline CSS for safe animations and shapes */}
      <style>{`
        :root { --card-radius: 24px; }
        @keyframes floatA {
          0%, 100% { transform: rotate(-8deg) translateY(0); }
          50% { transform: rotate(-6deg) translateY(-8px); }
        }
        @keyframes floatB {
          0%, 100% { transform: rotate(6deg) translateY(0); }
          50% { transform: rotate(8deg) translateY(8px); }
        }
        @keyframes pulseCard {
          0%, 100% { transform: scale(0.96); }
          50% { transform: scale(1.02); }
        }
        .phone-shell { border-radius: 28px; }
        .phone-inner { border-radius: 22px; }
        .phone-screen { border-radius: 18px; height: 640px; }
        .card-a { animation: floatA 2.8s ease-in-out infinite; border-radius: var(--card-radius); }
        .card-b { animation: floatB 3.1s ease-in-out infinite; border-radius: var(--card-radius); }
        .card-main { animation: pulseCard 2.2s ease-in-out infinite; border-radius: var(--card-radius); }
        .badge { font-weight: 600; font-size: 12px; padding: 6px 10px; border-radius: 12px; display: inline-block; }
        .bg-grid::before { content: ""; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(255,255,255,0.06), transparent 30%, transparent 70%); pointer-events:none; }
      `}</style>

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur bg-black/60 border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-semibold tracking-tight">Lenzli</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#join" className="hidden sm:inline-block rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">Join waitlist</a>
            <a href="#download" className="rounded-2xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition">Get the app</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[80rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/25 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-grid opacity-40" />

        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <Sparkles />
                New • Network for photographers & filmmakers
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
                Connect. Collaborate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Create.</span>
              </h1>
              <p className="text-white/70 text-lg max-w-prose">
                Lenzli helps image-makers discover each other by style and interests, find real-time help on shoots, and build crews by location, genre, and gear — all in one community.
              </p>
              <div id="join" className="w-full max-w-md">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none placeholder-white/40 focus:ring-2 focus:ring-white/20"
                    />
                    <button className="rounded-2xl bg-white text-black px-5 py-3 text-sm font-medium hover:bg-white/90 transition">
                      Join waitlist
                    </button>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                    You’re on the list! We’ll email you when Lenzli is ready.
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex -space-x-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-7 w-7 rounded-full border border-white/10 bg-gradient-to-br from-white/20 to-white/5" />
                  ))}
                </div>
                <span>1,200+ early signups</span>
              </div>
            </div>

            <div className="relative">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social proof */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/50 mb-6">Trusted by visual creators from</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 opacity-70">
            {['Unsplash','Behance','Dribbble','TikTok','Instagram'].map((brand) => (
              <div key={brand} className="flex items-center justify-center rounded-xl border border-white/10 bg-black/40 py-3 text-sm">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Built for creators — not dating</h2>
          <p className="mt-3 text-white/70">Discover styles, find collaborators, and get help — fast.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard title="Swipe to discover" desc="Quickly browse work by genre and vibe. Save creators you want to connect with." icon={<SwipeIcon />} />
          <FeatureCard title="Real-time help pings" desc="Need a gaffer at 4pm? Post a ping and nearby pros can jump in." icon={<MapPinIcon />} />
          <FeatureCard title="Tags that matter" desc="Filter by gear (A7SIII, C70), roles (AC, colorist), and styles (street, weddings)." icon={<TagIcon />} />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-6 pb-16 md:pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-3">
            <Step n={1} title="Create your creator card" desc="Add sample shots, roles you do, gear, and where you’re based." />
            <Step n={2} title="Browse & connect" desc="Swipe to save work you like and send a quick connect to collaborate." />
            <Step n={3} title="Post or accept shoots" desc="Share what you need (time, location, role) and build a crew in minutes." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24" id="download">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-10 md:p-14 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold">Claim your handle</h3>
          <p className="mt-3 text-white/70">Be part of the first wave of the Lenzli creator network.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a className="rounded-2xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition" href="#join">Join waitlist</a>
            <button className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm hover:bg-white/10 transition">View demo</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-5xl px-6 pb-24">
        <h4 className="text-2xl font-semibold mb-6">Frequently asked questions</h4>
        <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
          <FAQ q="Who is Lenzli for?" a="Photographers, filmmakers, and visual creatives looking to find collaborators, crews, and community." />
          <FAQ q="How do connections work?" a="Save creators you like and send a quick connect. If they accept, you can chat, share briefs, and plan." />
          <FAQ q="Can I find help fast?" a="Yes — post a real-time ping with role, time, and location. Nearby creators get notified." />
          <FAQ q="Is Lenzli free?" a="Core features are free. We’ll offer optional pro tools like boosted pings and advanced filters." />
          <FAQ q="Does Lenzli support teams?" a="You can list roles you’re hiring for and build a roster by tags like gear, style, and availability." />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/70">
            <Logo small />
            <span>Lenzli © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-white/60 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Safety</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="mb-4 h-10 w-10 rounded-2xl border border-white/10 bg-white/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-white/70">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/80">{n}</span>
        Step {n}
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-white/70">{desc}</p>
    </div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-5 sm:p-6">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <span className="font-medium">{q}</span>
        <span className="ml-4 text-white/60">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-white/70">{a}</p>}
    </div>
  );
}

function Logo({ small }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={small ? "h-5 w-5" : "h-7 w-7"} fill="none">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="12" stroke="url(#g)" strokeOpacity="0.8" />
      <circle cx="24" cy="24" r="9" stroke="url(#g)" strokeOpacity="0.9" />
      <path d="M24 15v18M15 24h18" stroke="url(#g)" strokeOpacity="0.6" />
    </svg>
  );
}

function Sparkles() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l1.2 3.8 3.8 1.2-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3zM19 14l.6 1.8 1.8.6-1.8.6L19 19l-.6-1.8L16.6 16l1.8-.6L19 14zM5 15l.6 1.8 1.8.6-1.8.6L5 20l-.6-1.8L2.6 18l1.8-.6L5 15z" />
    </svg>
  );
}

function SwipeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 8h10M4 12h8M4 16h6" />
      <path d="M14 8l3-3 3 3M20 5v10" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 13l-7 7-9-9V4h7l9 9z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 5h16v10H7l-3 3V5z" />
    </svg>
  );
}

function PhoneMockup() {
  return (
    <div className="mx-auto w-[320px] md:w-[360px] lg:w-[380px]">
      <div className="relative phone-shell border border-white/15 bg-gradient-to-b from-white/10 to-transparent p-3 shadow-2xl">
        <div className="phone-inner bg-black p-3 border border-white/10">
          {/* Top bar */}
          <div className="mx-auto mb-3 h-1.5 w-24 rounded-full bg-white/10" />
          {/* Screen */}
          <div className="phone-screen overflow-hidden border border-white/10 bg-gradient-to-b from-white/10 via-black to-black relative">
            {/* Floating cards */}
            <div className="absolute left-6 top-10 right-6 h-48 card-a border border-white/10 bg-white/10 backdrop-blur" />
            <div className="absolute left-8 top-20 right-8 h-48 card-b border border-white/10 bg-white/10 backdrop-blur" />

            {/* Main card with landscape image */}
            <div
              className="absolute left-4 right-4 bottom-20 top-28 card-main border border-white/20 bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop')" }}
            >
              {/* Action badges tailored to collaboration */}
              <div className="absolute left-4 top-4">
                <div className="badge border-2 border-emerald-400/70 text-emerald-300/90 -rotate-12">PING</div>
              </div>
              <div className="absolute right-4 top-4">
                <div className="badge border-2 border-white/30 text-white/70 rotate-12">SKIP</div>
              </div>

              {/* Bottom controls */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-center gap-4">
                <button className="h-12 w-12 rounded-full border border-white/20 bg-black/60 backdrop-blur hover:bg-black/40">⟲</button>
                <button className="h-14 w-14 rounded-full bg-white text-black font-semibold hover:bg-white/90">＋</button>
                <button className="h-12 w-12 rounded-full border border-white/20 bg-black/60 backdrop-blur hover:bg-black/40">✉</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
