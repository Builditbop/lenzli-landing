import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, isFirebaseConfigured, getFirebaseConfigError } from "../config/firebase";

const GRID_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1465056836900-8f1e940f2114?w=400&h=400&fit=crop",
];

const GRID_COLS = 8;
const GRID_ROWS = 6;

export default function LenzliLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("lenzli_intro_seen"));
  const [introExiting, setIntroExiting] = useState(false);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const phoneRef = useRef(null);

  const heroReady = !showIntro;

  useEffect(() => {
    if (!showIntro) return;
    const exitTimer = setTimeout(() => setIntroExiting(true), 2200);
    const removeTimer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("lenzli_intro_seen", "true");
    }, 3200);
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
  }, [showIntro]);

  useEffect(() => {
    document.body.style.overflow = showIntro ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showIntro]);

  useEffect(() => {
    const handleScroll = () => {
      const s = window.scrollY;
      if (titleRef.current) titleRef.current.style.transform = `translateY(${s * 0.12}px)`;
      if (phoneRef.current) phoneRef.current.style.transform = `translateY(${s * -0.06}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!isFirebaseConfigured()) {
      setError(getFirebaseConfigError() || 'Firebase is not configured.');
      setLoading(false);
      return;
    }
    try {
      await addDoc(collection(db, "waitlist"), { email, timestamp: new Date().toISOString(), source: "landing_page" });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(`Error: ${err.message || "Something went wrong."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {showIntro && (
        <div className={`intro-overlay ${introExiting ? 'intro-exit' : 'intro-enter'}`}>
          <div className="intro-content">
            <div className="intro-icon"><IntroLogo /></div>
            <span className="intro-title">Lenzli</span>
            <span className="intro-tagline">Connect. Collaborate. Create.</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ping-once { 0%{transform:scale(0.8);opacity:0} 50%{transform:scale(1.2);opacity:1} 100%{transform:scale(1.5);opacity:0} }
        .animate-ping-once{animation:ping-once .6s cubic-bezier(0,0,.2,1)}
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Logo dark />
            <span className="text-xl font-bold tracking-tight text-black">Lenzli</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-black transition font-medium">Features</a>
            <a href="#how" className="hover:text-black transition font-medium">How it works</a>
            <a href="#waitlist" className="hover:text-black transition font-medium">Join</a>
          </div>
          {import.meta.env.VITE_LANDING_ONLY !== 'true' && (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:inline-block rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700">Log In</Link>
              <Link to="/signup" className="rounded-xl bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle">Sign Up</Link>
            </div>
          )}
        </nav>
      </header>

      {/* ══════════════════════════════════════
          HERO — image grid + parallax
         ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <ImageGrid heroRef={heroRef} active={heroReady} />
        {/* Decorative gradient blobs */}
        <div className="absolute top-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full pointer-events-none z-[1]" style={{ background: 'radial-gradient(circle, rgba(243,244,246,0.7) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none z-[1]" style={{ background: 'radial-gradient(circle, rgba(243,244,246,0.5) 0%, transparent 65%)' }} />

        <div className="mx-auto max-w-7xl px-6 w-full pt-24 relative z-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div ref={titleRef} className="space-y-4">
              <div className={`hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '0ms' }}>
                <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0] text-black">Connect.</span>
              </div>
              <div className={`hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '120ms' }}>
                <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0] text-black">Collaborate.</span>
              </div>
              <div className={`hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '240ms' }}>
                <span className="block text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0] text-black">Create.</span>
              </div>
              <div className={`hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '400ms' }}>
                <p className="text-gray-500 text-lg md:text-xl max-w-md leading-relaxed pt-4">
                  The network where image-makers discover each other by style, find real-time help on shoots, and build crews.
                </p>
              </div>
            </div>
            <div ref={phoneRef}>
              <div className={`hero-el ${heroReady ? 'hero-visible' : ''}`} style={{ transitionDelay: '600ms' }}>
                <PhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE — two rows, opposite directions
         ══════════════════════════════════════ */}
      <div className="border-y border-gray-200 bg-gray-50 py-4 overflow-hidden space-y-2">
        <div className="marquee-track">
          {[0, 1].map(i => (
            <div key={i} className="flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap px-4">
              {['Photography','Filmmaking','Visual Storytelling','Collaboration','Cinematography','Post-Production','Creative Direction','Photography','Filmmaking','Visual Storytelling','Collaboration','Cinematography'].map((w, j) => (
                <React.Fragment key={j}><span>{w}</span><span className="text-gray-300">•</span></React.Fragment>
              ))}
            </div>
          ))}
        </div>
        <div className="marquee-track-reverse">
          {[0, 1].map(i => (
            <div key={i} className="flex items-center gap-8 text-sm font-medium text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap px-4">
              {['Portraits','Documentaries','Weddings','Music Videos','Commercials','Street Photography','Drone','Portraits','Documentaries','Weddings','Music Videos','Commercials'].map((w, j) => (
                <React.Fragment key={j}><span>{w}</span><span className="text-gray-200">•</span></React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES
         ══════════════════════════════════════ */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-32 md:py-48">
        <Reveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-tight">
              Built for creators
            </h2>
            <p className="mt-5 text-gray-400 text-lg md:text-xl">Discover styles, find collaborators, and get help — fast.</p>
          </div>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          <Reveal delay={0} direction="pop">
            <FeatureCard title="Swipe to discover" desc="Quickly browse work by genre and vibe. Save creators you want to connect with." icon={<SwipeIcon />} />
          </Reveal>
          <Reveal delay={180} direction="pop">
            <FeatureCard title="Real-time help pings" desc="Need a gaffer at 4pm? Post a ping and nearby pros can jump in." icon={<MapPinIcon />} />
          </Reveal>
          <Reveal delay={360} direction="pop">
            <FeatureCard title="Tags that matter" desc="Filter by gear (A7SIII, C70), roles (AC, colorist), and styles (street, weddings)." icon={<TagIcon />} />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BIG STATEMENT — word-by-word reveal
         ══════════════════════════════════════ */}
      <section className="py-36 md:py-52 border-y border-gray-100">
        <TextReveal
          text="Where visual creators find their crew."
          className="text-center text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-black px-6 max-w-5xl mx-auto"
          highlightFrom={4}
        />
        <Reveal direction="up" delay={600}>
          <p className="text-center text-gray-400 text-lg mt-8 max-w-xl mx-auto px-6">
            No more cold DMs. No more guessing. Lenzli matches you with creators who share your style, gear, and ambition.
          </p>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — timeline
         ══════════════════════════════════════ */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-32 md:py-48">
        <Reveal direction="up">
          <div className="mx-auto max-w-2xl text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black">How it works</h2>
            <p className="mt-5 text-gray-400 text-lg">Three steps to your next collaboration.</p>
          </div>
        </Reveal>

        <div className="max-w-3xl mx-auto">
          <Reveal delay={0} direction="pop">
            <div className="flex items-start gap-6 md:gap-10 py-12 border-t border-gray-100 group">
              <span className="text-6xl md:text-8xl font-bold text-gray-100 leading-none flex-shrink-0 w-24 md:w-32 text-right transition-colors duration-500 group-hover:text-gray-300 select-none">01</span>
              <div className="pt-2 md:pt-4">
                <h4 className="text-2xl md:text-3xl font-bold text-black mb-3">Create your creator card</h4>
                <p className="text-gray-500 text-lg leading-relaxed max-w-lg">Add sample shots, roles you do, gear, and where you're based. Your card is your creative identity.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200} direction="pop">
            <div className="flex items-start gap-6 md:gap-10 py-12 border-t border-gray-100 group">
              <span className="text-6xl md:text-8xl font-bold text-gray-100 leading-none flex-shrink-0 w-24 md:w-32 text-right transition-colors duration-500 group-hover:text-gray-300 select-none">02</span>
              <div className="pt-2 md:pt-4">
                <h4 className="text-2xl md:text-3xl font-bold text-black mb-3">Browse & connect</h4>
                <p className="text-gray-500 text-lg leading-relaxed max-w-lg">Swipe through work you love and send a quick connect to collaborate with creators who match your vibe.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={400} direction="pop">
            <div className="flex items-start gap-6 md:gap-10 py-12 border-t border-b border-gray-100 group">
              <span className="text-6xl md:text-8xl font-bold text-gray-100 leading-none flex-shrink-0 w-24 md:w-32 text-right transition-colors duration-500 group-hover:text-gray-300 select-none">03</span>
              <div className="pt-2 md:pt-4">
                <h4 className="text-2xl md:text-3xl font-bold text-black mb-3">Post or accept shoots</h4>
                <p className="text-gray-500 text-lg leading-relaxed max-w-lg">Share what you need — time, location, role — and build a crew in minutes, not days.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WAITLIST CTA
         ══════════════════════════════════════ */}
      <section id="waitlist" className="mx-auto max-w-7xl px-6 py-32 md:py-44">
        <Reveal direction="pop" distance={50}>
          <div className="cta-card rounded-3xl bg-black p-10 md:p-20 text-center shadow-elevated relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-gray-700/30 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-gray-700/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <Reveal direction="up" delay={200}>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">Join the waitlist</h3>
              </Reveal>
              <Reveal direction="up" delay={350}>
                <p className="mt-4 text-gray-400 text-lg md:text-xl max-w-lg mx-auto">Be among the first to experience Lenzli when we launch.</p>
              </Reveal>
              <Reveal direction="up" delay={500}>
                <div className="mt-10 max-w-md mx-auto">
                  {error && <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading}
                        className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3.5 text-sm outline-none placeholder-gray-500 focus:ring-2 focus:ring-white/20 focus:border-white/30 disabled:opacity-50 text-white backdrop-blur-sm" />
                      <button disabled={loading} className="rounded-xl bg-white text-black px-6 py-3.5 text-sm font-semibold hover:bg-gray-100 transition-all disabled:opacity-50">
                        {loading ? 'Saving...' : 'Join'}
                      </button>
                    </form>
                  ) : (
                    <div className="rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">You're on the list! We'll email you when Lenzli is ready.</div>
                  )}
                  {import.meta.env.VITE_LANDING_ONLY !== 'true' && (
                    <p className="mt-4 text-xs text-gray-500">
                      Already have an account? <Link to="/login" className="text-white font-semibold hover:underline">Log in</Link>
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Logo small dark />
            <span className="font-medium">Lenzli © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <Link to="/privacy" className="hover:text-black transition font-medium">Privacy</Link>
            <Link to="/terms" className="hover:text-black transition font-medium">Terms</Link>
            <Link to="/safety" className="hover:text-black transition font-medium">Safety</Link>
            <Link to="/conduct" className="hover:text-black transition font-medium">Conduct</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════ */

function Reveal({ children, delay = 0, direction = 'up', className = '', distance = 60 }) {
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

  const isPop = direction === 'pop';
  const easing = isPop
    ? `cubic-bezier(0.34, 1.56, 0.64, 1)`
    : `cubic-bezier(0.16, 1, 0.3, 1)`;

  const t = () => {
    switch (direction) {
      case 'up': return `translateY(${distance}px)`;
      case 'down': return `translateY(-${distance}px)`;
      case 'left': return `translateX(${distance}px)`;
      case 'right': return `translateX(-${distance}px)`;
      case 'scale': return 'scale(0.88)';
      case 'pop': return `translateY(${distance * 0.5}px) scale(0.82)`;
      default: return 'none';
    }
  };

  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : t(),
      filter: vis ? 'blur(0)' : `blur(${isPop ? 4 : 2}px)`,
      transition: `opacity 0.9s ${easing} ${delay}ms, transform 0.9s ${easing} ${delay}ms, filter 0.9s ${easing} ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════
   WORD-BY-WORD TEXT REVEAL
   ═══════════════════════════════════════ */

function TextReveal({ text, className = '', highlightFrom = -1 }) {
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

  const words = text.split(' ');

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block" style={{
          opacity: vis ? 1 : 0,
          transform: vis ? 'translateY(0)' : 'translateY(30px)',
          filter: vis ? 'blur(0)' : 'blur(6px)',
          color: highlightFrom >= 0 && i >= highlightFrom ? '#d1d5db' : undefined,
          transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`,
        }}>
          {word}&nbsp;
        </span>
      ))}
    </h2>
  );
}

/* ═══════════════════════════════════════
   IMAGE GRID — background mosaic
   ═══════════════════════════════════════ */

function ImageGrid({ heroRef, active }) {
  const [hoverCell, setHoverCell] = useState(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || !active) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const col = Math.floor(((e.clientX - rect.left) / rect.width) * GRID_COLS);
      const row = Math.floor(((e.clientY - rect.top) / rect.height) * GRID_ROWS);
      if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
        setHoverCell(null);
        return;
      }
      setHoverCell(`${row}-${col}`);
    };

    const handleLeave = () => setHoverCell(null);

    el.addEventListener('mousemove', handleMove, { passive: true });
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [heroRef, active]);

  const getCellOpacity = (r, c) => {
    if (!hoverCell) return 0;
    const [hr, hc] = hoverCell.split('-').map(Number);
    const dr = Math.abs(r - hr);
    const dc = Math.abs(c - hc);
    if (dr === 0 && dc === 0) return 0.28;
    if (dr <= 1 && dc <= 1) return 0.14;
    if (dr <= 2 && dc <= 2) return 0.05;
    return 0;
  };

  return (
    <div className="absolute inset-0 hidden md:grid pointer-events-none z-0" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`, gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)` }}>
      {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => {
        const row = Math.floor(i / GRID_COLS);
        const col = i % GRID_COLS;
        const op = getCellOpacity(row, col);
        return (
          <div key={i} className="relative overflow-hidden">
            <img
              src={GRID_IMAGES[i % GRID_IMAGES.length]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: op,
                transform: op > 0 ? 'scale(1)' : 'scale(1.15)',
                filter: `grayscale(${op > 0.2 ? 0.1 : 0.4})`,
                transition: 'opacity 0.35s ease-out, transform 0.5s ease-out, filter 0.35s ease-out',
              }}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   CONTENT COMPONENTS
   ═══════════════════════════════════════ */

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10 hover:border-gray-300 hover:shadow-card hover:-translate-y-1 transition-all duration-500 group">
      <div className="mb-5 h-14 w-14 rounded-2xl bg-black flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-[-3deg] transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-black">{title}</h3>
      <p className="mt-3 text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════════
   SVG ICONS
   ═══════════════════════════════════════ */

function Logo({ small, dark }) {
  const c = dark ? '#000' : '#fff';
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={small ? "h-5 w-5" : "h-7 w-7"} fill="none">
      <rect x="3" y="3" width="42" height="42" rx="12" stroke={c} strokeWidth="2" />
      <circle cx="24" cy="24" r="9" stroke={c} strokeWidth="2" />
      <path d="M24 15v18M15 24h18" stroke={c} strokeWidth="1.5" strokeOpacity="0.4" />
    </svg>
  );
}

function IntroLogo() {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="intro-logo-svg" fill="none">
      <rect x="3" y="3" width="42" height="42" rx="12" stroke="white" strokeWidth="2" className="intro-draw" />
      <circle cx="24" cy="24" r="9" stroke="white" strokeWidth="2" className="intro-draw intro-draw-delay" />
      <path d="M24 15v18M15 24h18" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" className="intro-draw intro-draw-delay-2" />
    </svg>
  );
}

function SwipeIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 8h10M4 12h8M4 16h6" /><path d="M14 8l3-3 3 3M20 5v10" /></svg>;
}
function MapPinIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" /><circle cx="12" cy="11" r="2.5" /></svg>;
}
function TagIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 13l-7 7-9-9V4h7l9 9z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>;
}
function LightningIcon() {
  return <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2L4 11h5l-1 7 7-9h-5l1-7z" /></svg>;
}
function GearIcon() {
  return <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="2.5" /><path d="M8.5 2.5h3l.4 1.8a5.5 5.5 0 011.5.9l1.8-.6 1.5 2.6-1.4 1.2a5.5 5.5 0 010 1.7l1.4 1.2-1.5 2.6-1.8-.6a5.5 5.5 0 01-1.5.9l-.4 1.8h-3l-.4-1.8a5.5 5.5 0 01-1.5-.9l-1.8.6-1.5-2.6 1.4-1.2a5.5 5.5 0 010-1.7L3.3 7.2l1.5-2.6 1.8.6a5.5 5.5 0 011.5-.9L8.5 2.5z" /></svg>;
}
function XMarkIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>;
}
function MessageIcon() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>;
}
function HeartIcon() {
  return <svg viewBox="0 0 24 24" className="h-20 w-20" fill="#ef4444" stroke="#ef4444" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
}
function StarIcon({ color = 'white' }) {
  return <svg viewBox="0 0 24 24" className="h-6 w-6" fill={color} stroke={color} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}
function PinIcon() {
  return <svg viewBox="0 0 16 16" className="h-3 w-3 inline mr-0.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 14s5-3.5 5-7.5a5 5 0 10-10 0C3 10.5 8 14 8 14z" /><circle cx="8" cy="6.5" r="1.5" /></svg>;
}

/* ═══════════════════════════════════════
   PHONE MOCKUP
   ═══════════════════════════════════════ */

function PhoneMockup() {
  const [currentCard, setCurrentCard] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [liked, setLiked] = useState(false);
  const cards = [
    { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop", name: "Alex Rivera", role: "Portrait Photographer", gear: "Sony A7IV • 85mm f/1.4" },
    { image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=800&auto=format&fit=crop", name: "Jordan Lee", role: "Street Photographer", gear: "Fuji X-T5 • 35mm f/2" },
    { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", name: "Sam Taylor", role: "Landscape DP", gear: "Canon R5 • 24-70mm" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextVisible(false);
      setLiked(false);
      setTimeout(() => {
        setCurrentCard(p => (p + 1) % cards.length);
        setTimeout(() => setTextVisible(true), 300);
      }, 400);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = () => {
    setLiked(true);
    setTimeout(() => {
      setTextVisible(false);
      setTimeout(() => {
        setCurrentCard(p => (p + 1) % cards.length);
        setLiked(false);
        setTimeout(() => setTextVisible(true), 300);
      }, 300);
    }, 400);
  };

  const card = cards[currentCard];

  return (
    <div className="mx-auto w-[300px] md:w-[340px] lg:w-[370px]">
      <div className="relative rounded-[44px] border border-gray-200 bg-gray-100 p-2.5 shadow-elevated">
        <div className="rounded-[36px] bg-black p-2">
          <div className="rounded-[30px] overflow-hidden bg-gray-900 relative" style={{ height: '600px' }}>
            {/* Dynamic Island notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-7 w-28 rounded-full bg-black z-30" />

            {/* Card images — smooth crossfade with Ken Burns zoom */}
            {cards.map((c, idx) => (
              <div
                key={idx}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${c.image}')`,
                  opacity: idx === currentCard ? 1 : 0,
                  transform: idx === currentCard ? 'scale(1.06)' : 'scale(1)',
                  transition: `opacity 1.2s ease-in-out, transform ${idx === currentCard ? '8s' : '0.6s'} ease-out`,
                }}
              />
            ))}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 z-10" />

            {/* Like animation */}
            {liked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="animate-ping-once"><HeartIcon /></div>
              </div>
            )}

            {/* Card info — smooth text transition */}
            <div className="absolute bottom-28 left-5 right-5 z-10" style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}>
              <h3 className="text-2xl font-bold text-white tracking-tight">{card.name}</h3>
              <p className="text-white/60 text-sm mt-1">{card.role}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/80 border border-white/10">{card.gear}</span>
              </div>
            </div>

            {/* Action buttons — glassmorphic */}
            <div className="absolute inset-x-0 bottom-0 p-5 flex items-center justify-center gap-5 z-10">
              <button onClick={() => { setTextVisible(false); setTimeout(() => { setCurrentCard(p => (p + 1) % cards.length); setTimeout(() => setTextVisible(true), 300); }, 300); }}
                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90">
                <XMarkIcon />
              </button>
              <button onClick={handleLike}
                className={`h-16 w-16 rounded-full bg-white text-black hover:scale-105 transition-all shadow-lg flex items-center justify-center active:scale-95 ${liked ? 'scale-110' : ''}`}>
                <StarIcon color="black" />
              </button>
              <button className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90">
                <MessageIcon />
              </button>
            </div>

            {/* Indicator dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
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
