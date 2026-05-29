import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../config/firebase";

export default function LenzliLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("lenzli_intro_seen"));
  const [introExiting, setIntroExiting] = useState(false);
  const titleRef = useRef(null);
  const phoneRef = useRef(null);

  const heroReady = !showIntro;

  useEffect(() => {
    if (!showIntro) return;
    const exitTimer = setTimeout(() => setIntroExiting(true), 1700);
    const removeTimer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("lenzli_intro_seen", "true");
    }, 2500);
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
  }, [showIntro]);

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showIntro]);

  useEffect(() => {
    const handleScroll = () => {
      const s = window.scrollY;
      if (titleRef.current) titleRef.current.style.transform = `translateY(${s * 0.06}px)`;
      if (phoneRef.current) phoneRef.current.style.transform = `translateY(${s * -0.04}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Empty string => same-origin (/api/waitlist serverless function on Vercel).
    // Set VITE_WAITLIST_API to a full URL only if the API lives elsewhere.
    const apiBase = import.meta.env.VITE_WAITLIST_API ?? "";

    try {
      // 1) Store the signup in Firestore — the source of truth.
      let stored = false;
      if (isFirebaseConfigured()) {
        try {
          await addDoc(collection(db, "waitlist"), {
            email,
            timestamp: new Date().toISOString(),
            source: "landing_page",
          });
          stored = true;
        } catch (fbErr) {
          console.warn("Firestore write failed:", fbErr);
        }
      }

      // 2) Send the confirmation email via our serverless function.
      //    Best-effort: the API key stays server-side, and a hiccup here
      //    never costs us the signup.
      let emailed = false;
      try {
        const res = await fetch(`${apiBase}/api/waitlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: "landing_page" }),
        });
        const data = await res.json().catch(() => ({}));
        emailed = res.ok && data.ok;
      } catch (mailErr) {
        console.warn("Confirmation email request failed:", mailErr);
      }

      if (stored || emailed) {
        setSubmitted(true);
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink overflow-x-hidden antialiased">
      {showIntro && (
        <div className={`intro-overlay ${introExiting ? 'intro-exit' : 'intro-enter'}`}>
          <div className="intro-content">
            <div className="intro-icon"><IntroLogo /></div>
            <span className="intro-title">Lenzli</span>
            <span className="intro-tagline">Connect · Collaborate · Create</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes star-pop {
          0%   { transform: scale(0.35) rotate(-14deg); opacity: 0; }
          35%  { transform: scale(1.12) rotate(5deg);   opacity: 1; }
          70%  { transform: scale(0.98) rotate(0deg);   opacity: 1; }
          100% { transform: scale(1.04) rotate(0deg);   opacity: 0; }
        }
        .animate-star-pop { animation: star-pop .85s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes star-ring {
          0%   { transform: scale(0.5); opacity: 0.55; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .animate-star-ring { animation: star-ring .8s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @media (prefers-reduced-motion: reduce) {
          .animate-star-pop, .animate-star-ring { animation-duration: .01ms !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 z-50 w-full">
        <div className="mt-3 mx-3 md:mx-auto flex max-w-6xl items-center justify-between rounded-full border border-line/80 bg-surface/70 px-5 py-2.5 backdrop-blur-xl shadow-soft">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold font-display tracking-tight text-ink">Lenzli</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted">
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <a href="#how" className="hover:text-ink transition-colors">How it works</a>
            <a href="#waitlist" className="hover:text-ink transition-colors">Waitlist</a>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO
         ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* soft ambient wash, no cursor grid */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-[-20%] h-[640px] w-[900px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(27,27,24,0.05), transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'radial-gradient(rgba(27,27,24,0.045) 1px, transparent 1px)', backgroundSize: '26px 26px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 35%, #000 40%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 35%, #000 40%, transparent 78%)' }} />
        </div>

        <div className="mx-auto max-w-6xl px-6 w-full pt-28 pb-16 relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div ref={titleRef} className="space-y-7">
              <h1 className="font-display text-[clamp(2.8rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink">
                <span className={`block hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '60ms' }}>Connect.</span>
                <span className={`block hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '120ms' }}>Collaborate.</span>
                <span className={`block hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '180ms' }}>
                  <span className="font-serif-accent italic pr-2">Create.</span>
                </span>
              </h1>

              <p className={`hero-el ${heroReady ? 'hero-visible' : ''} text-muted text-lg md:text-xl max-w-md leading-relaxed`} style={{ transitionDelay: '260ms' }}>
                The network where image-makers discover each other by style, find real-time help on shoots, and build crews.
              </p>

              <div className={`hero-el ${heroReady ? 'hero-visible' : ''} flex flex-wrap items-center gap-3 pt-1`} style={{ transitionDelay: '340ms' }}>
                <a href="#waitlist" className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-all hover:bg-ink-soft hover:shadow-float">
                  Join the waitlist
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

            </div>

            <div ref={phoneRef} className="relative">
              <div className={`hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '300ms' }}>
                <PhoneMockup />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-muted-soft">
          <span className="text-[11px] uppercase tracking-[0.25em]">Scroll</span>
          <span className="h-9 w-[1px] bg-gradient-to-b from-line-strong to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE
         ══════════════════════════════════════ */}
      <div className="border-y border-line bg-surface/60 py-5 overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map(i => (
            <div key={i} className="flex items-center gap-10 text-sm font-medium text-muted-soft uppercase tracking-[0.22em] whitespace-nowrap px-5">
              {['Photography','Filmmaking','Visual Storytelling','Collaboration','Cinematography','Post-Production','Creative Direction','Portraits','Documentaries','Music Videos','Commercials','Street'].map((w, j) => (
                <React.Fragment key={j}><span>{w}</span><span className="text-line-strong">✦</span></React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES
         ══════════════════════════════════════ */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-28 md:py-40">
        <Reveal direction="up">
          <div className="max-w-2xl mb-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-soft mb-4">Features</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.03em] text-ink leading-[1.05]">
              Built for the way <span className="font-serif-accent italic">creators</span> actually work.
            </h2>
            <p className="mt-5 text-muted text-lg md:text-xl max-w-lg">Discover styles, find collaborators, and get help on set — without the cold DMs.</p>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal delay={0} direction="up"><FeatureCard title="Swipe to discover" desc="Browse work by genre and vibe. Save the creators you want to build with." icon={<SwipeIcon />} /></Reveal>
          <Reveal delay={120} direction="up"><FeatureCard title="Real-time help pings" desc="Need a gaffer at 4pm? Post a ping and nearby pros can jump in." icon={<MapPinIcon />} /></Reveal>
          <Reveal delay={240} direction="up"><FeatureCard title="Tags that matter" desc="Filter by gear (A7SIII, C70), roles (AC, colorist), and styles (street, weddings)." icon={<TagIcon />} /></Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BIG STATEMENT
         ══════════════════════════════════════ */}
      <section className="py-28 md:py-44 border-y border-line bg-surface/40">
        <TextReveal
          className="text-center font-display text-4xl md:text-6xl lg:text-[4.5rem] font-semibold tracking-[-0.035em] leading-[1.04] px-6 max-w-5xl mx-auto"
          segments={[
            { text: "Where visual creators", className: "text-muted-soft" },
            { text: "find their crew.", className: "text-ink font-serif-accent uppercase" },
          ]}
        />
        <Reveal direction="up" delay={400}>
          <p className="text-center text-muted text-lg mt-8 max-w-xl mx-auto px-6">
            No more cold DMs. No more guessing. Lenzli matches you with creators who share your style, gear, and ambition.
          </p>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
         ══════════════════════════════════════ */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-28 md:py-40">
        <Reveal direction="up">
          <div className="max-w-2xl mb-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-soft mb-4">How it works</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.03em] text-ink leading-[1.05]">Three steps to your next collaboration.</h2>
          </div>
        </Reveal>

        <div className="space-y-px">
          {STEPS.map((step, i) => (
            <Reveal key={i} delay={i * 140} direction="up">
              <div className="flex items-start gap-6 md:gap-12 py-10 border-t border-line group">
                <span className="font-display text-5xl md:text-7xl font-semibold text-line-strong leading-none flex-shrink-0 w-16 md:w-24 transition-colors duration-500 group-hover:text-ink select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="pt-1 md:pt-3">
                  <h4 className="text-2xl md:text-3xl font-semibold text-ink mb-2.5 tracking-tight">{step.title}</h4>
                  <p className="text-muted text-lg leading-relaxed max-w-lg">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          WAITLIST CTA
         ══════════════════════════════════════ */}
      <section id="waitlist" className="mx-auto max-w-6xl px-6 pb-28 md:pb-40">
        <Reveal direction="up" distance={50}>
          <div className="cta-card relative overflow-hidden rounded-[2rem] bg-ink p-10 md:p-20 text-center shadow-float">
            <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.10), transparent)' }} />
            <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(255,255,255,0.06), transparent)' }} />

            <div className="relative z-10">
              <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-paper tracking-[-0.03em] leading-tight">
                Join the <span className="font-serif-accent italic text-paper">waitlist</span>
              </h3>
              <p className="mt-4 text-white/50 text-lg md:text-xl max-w-lg mx-auto">Be among the first to experience Lenzli when we launch.</p>

              <div className="mt-10 max-w-md mx-auto">
                {error && <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="relative">
                    <input type="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
                      className="w-full rounded-full bg-white/[0.06] border border-white/15 pl-5 pr-14 py-3.5 text-sm outline-none placeholder-white/35 focus:ring-2 focus:ring-white/15 focus:border-white/30 disabled:opacity-50 text-white transition-all" />
                    <button type="submit" disabled={loading} aria-label="Join the waitlist"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-paper text-ink flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 active:scale-95">
                      {loading
                        ? <span className="h-3.5 w-3.5 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
                        : <ArrowIcon className="h-4 w-4" />}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-3.5 text-sm text-emerald-300">
                    Thank you — you've joined our waitlist! Check your inbox for a confirmation email.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-line bg-surface/50">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2 text-muted">
            <Logo small />
            <span className="font-medium text-ink">Lenzli</span>
            <span className="text-muted-soft">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-7 text-muted text-sm">
            <Link to="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-ink transition-colors">Terms</Link>
            <Link to="/safety" className="hover:text-ink transition-colors">Safety</Link>
            <Link to="/conduct" className="hover:text-ink transition-colors">Conduct</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════ DATA ═══════════════════════════════════════ */

const STEPS = [
  { title: "Create your creator card", desc: "Add sample shots, the roles you do, your gear, and where you're based. Your card is your creative identity." },
  { title: "Browse & connect", desc: "Swipe through work you love and send a quick connect to collaborate with creators who match your vibe." },
  { title: "Post or accept shoots", desc: "Share what you need — time, location, role — and build a crew in minutes, not days." },
];

/* ═══════════════════════════════════════ SCROLL REVEAL ═══════════════════════════════════════ */

function Reveal({ children, delay = 0, direction = 'up', className = '', distance = 28 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const easing = `cubic-bezier(0.16, 1, 0.3, 1)`;
  const t = () => {
    switch (direction) {
      case 'up': return `translateY(${distance}px)`;
      case 'down': return `translateY(-${distance}px)`;
      case 'scale': return 'scale(0.94)';
      default: return 'none';
    }
  };

  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : t(),
      filter: vis ? 'blur(0)' : 'blur(2px)',
      transition: `opacity 0.62s ${easing} ${delay}ms, transform 0.62s ${easing} ${delay}ms, filter 0.62s ${easing} ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════ WORD-BY-WORD TEXT REVEAL ═══════════════════════════════════════ */

// Animates word-by-word. `segments` is an array of { text, className } so
// different parts of the line can carry different styling (color, font, case).
function TextReveal({ segments, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ease = 'cubic-bezier(0.16,1,0.3,1)';
  let idx = 0; // global word index for the stagger

  return (
    <h2 ref={ref} className={className}>
      {segments.map((seg, si) => (
        <span key={si} className={seg.className}>
          {seg.text.split(' ').map((word, wi) => {
            const i = idx++;
            return (
              <span key={wi} className="inline-block" style={{
                opacity: vis ? 1 : 0,
                transform: vis ? 'translateY(0)' : 'translateY(16px)',
                filter: vis ? 'blur(0)' : 'blur(3px)',
                transition: `opacity 0.55s ${ease} ${i * 55}ms, transform 0.55s ${ease} ${i * 55}ms, filter 0.55s ${ease} ${i * 55}ms`,
              }}>
                {word}&nbsp;
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

/* ═══════════════════════════════════════ CONTENT ═══════════════════════════════════════ */

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-8 transition-all duration-500 hover:border-line-strong hover:shadow-card hover:-translate-y-1 group">
      <div className="mb-6 h-12 w-12 rounded-xl bg-ink flex items-center justify-center text-paper transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink tracking-tight">{title}</h3>
      <p className="mt-2.5 text-muted leading-relaxed">{desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════════ ICONS ═══════════════════════════════════════ */

function Logo({ small }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={small ? "h-5 w-5" : "h-7 w-7"} fill="none">
      <rect x="3" y="3" width="42" height="42" rx="13" stroke="#1B1B18" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="8.5" stroke="#1B1B18" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="2.5" fill="#1B1B18" />
    </svg>
  );
}

function IntroLogo() {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="intro-logo-svg" fill="none">
      <rect x="3" y="3" width="42" height="42" rx="13" stroke="white" strokeWidth="2.5" className="intro-draw" />
      <circle cx="24" cy="24" r="8.5" stroke="white" strokeWidth="2.5" className="intro-draw intro-draw-delay" />
      <circle cx="24" cy="24" r="2.5" fill="white" className="intro-draw intro-draw-delay-2" />
    </svg>
  );
}

function ArrowIcon({ className }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
function SwipeIcon() {
  // A single creator card with a photo glyph — the work you swipe through.
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      <rect x="5" y="3" width="14" height="18" rx="3" />
      <circle cx="9.5" cy="9" r="1.4" />
      <path d="M6.5 17l3.5-4 2.5 2.5L16 12l2.5 3" />
    </svg>
  );
}
function MapPinIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" /><circle cx="12" cy="11" r="2.5" /></svg>;
}
function TagIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 13l-7 7-9-9V4h7l9 9z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>;
}
function XMarkIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>;
}
function MessageIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>;
}
function BigStarIcon() {
  return <svg viewBox="0 0 24 24" className="h-[5.5rem] w-[5.5rem]" fill="#fff" stroke="#fff" strokeWidth="0.5" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}
function StarIcon({ color = 'white' }) {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill={color} stroke={color} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}

/* ═══════════════════════════════════════ PHONE MOCKUP ═══════════════════════════════════════ */

function PhoneMockup() {
  const [currentCard, setCurrentCard] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [liked, setLiked] = useState(false);
  const cards = [
    { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop", name: "Alex Rivera", role: "Portrait Photographer", gear: "Sony A7IV", tag: "85mm f/1.4", loc: "Los Angeles" },
    { image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=800&auto=format&fit=crop", name: "Jordan Lee", role: "Street Photographer", gear: "Fuji X-T5", tag: "35mm f/2", loc: "New York" },
    { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", name: "Sam Taylor", role: "Landscape DP", gear: "Canon R5", tag: "24-70mm", loc: "Denver" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextVisible(false);
      setLiked(false);
      setTimeout(() => {
        setCurrentCard(p => (p + 1) % cards.length);
        setTimeout(() => setTextVisible(true), 300);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const advance = () => {
    setTextVisible(false);
    setTimeout(() => { setCurrentCard(p => (p + 1) % cards.length); setTimeout(() => setTextVisible(true), 300); }, 300);
  };

  const handleLike = () => {
    setLiked(true);
    setTimeout(() => {
      setTextVisible(false);
      setTimeout(() => { setCurrentCard(p => (p + 1) % cards.length); setLiked(false); setTimeout(() => setTextVisible(true), 300); }, 320);
    }, 560);
  };

  const card = cards[currentCard];

  return (
    <div className="relative mx-auto w-[280px] md:w-[320px]" style={{ animation: 'floatY 7s ease-in-out infinite' }}>
      {/* soft pedestal glow */}
      <div className="absolute -inset-10 -z-10 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(27,27,24,0.10), transparent 70%)' }} />

      {/* subtle side buttons */}
      <div className="absolute -left-[2px] top-[22%] h-7 w-[3px] rounded-l-sm bg-neutral-700/70" />
      <div className="absolute -left-[2px] top-[30%] h-12 w-[3px] rounded-l-sm bg-neutral-700/70" />
      <div className="absolute -right-[2px] top-[26%] h-16 w-[3px] rounded-r-sm bg-neutral-700/70" />

      {/* sleek single titanium bezel — thin frame */}
      <div className="relative rounded-[2.6rem] p-[6px] shadow-float" style={{ background: 'linear-gradient(155deg, #34342f 0%, #1a1a17 38%, #0c0c0a 100%)' }}>
        {/* fine edge highlight + inner ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[2.6rem] ring-1 ring-white/[0.07]" />
        <div className="pointer-events-none absolute inset-x-10 top-[2px] h-px rounded-full bg-white/20" />
        <div className="rounded-[2.2rem] bg-black p-[1px]">
          <div className="relative rounded-[2.15rem] overflow-hidden bg-neutral-900" style={{ aspectRatio: '9 / 19.5' }}>
            {/* Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-6 w-24 rounded-full bg-black z-30" />

            {/* Card images crossfade */}
            {cards.map((c, idx) => (
              <div key={idx} className="absolute inset-0 bg-cover bg-center" style={{
                backgroundImage: `url('${c.image}')`,
                opacity: idx === currentCard ? 1 : 0,
                transform: idx === currentCard ? 'scale(1.05)' : 'scale(1)',
                transition: `opacity 1.1s ease-in-out, transform ${idx === currentCard ? '7s' : '0.6s'} ease-out`,
              }} />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/25 z-10" />

            {liked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-24 w-24 rounded-full border border-white/50 animate-star-ring" />
                  <span className="animate-star-pop drop-shadow-[0_6px_22px_rgba(0,0,0,0.45)]">
                    <BigStarIcon />
                  </span>
                </div>
              </div>
            )}

            {/* Card info */}
            <div className="absolute bottom-24 left-5 right-5 z-10" style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/70 bg-white/10 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/10">{card.loc}</span>
              </div>
              <h3 className="text-[1.65rem] font-semibold text-white tracking-tight leading-none font-display">{card.name}</h3>
              <p className="text-white/60 text-sm mt-1.5">{card.role}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/85 border border-white/10">{card.gear}</span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/85 border border-white/10">{card.tag}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="absolute inset-x-0 bottom-0 p-5 flex items-center justify-center gap-4 z-10">
              <button onClick={advance} className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90">
                <XMarkIcon />
              </button>
              <button onClick={handleLike} className={`h-14 w-14 rounded-full bg-white text-ink flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 ${liked ? 'scale-110' : ''}`}>
                <StarIcon color="#1B1B18" />
              </button>
              <button className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90">
                <MessageIcon />
              </button>
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {cards.map((_, idx) => (
                <div key={idx} className={`h-1 rounded-full transition-all duration-700 ${idx === currentCard ? 'w-5 bg-white' : 'w-1 bg-white/30'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
