import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc, getDoc, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { filterBlockedUsers } from '../utils/safety';

export default function Discover() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [creators, setCreators] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    fetchCreators();
  }, [currentUser]);

  const fetchCreators = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('profileComplete', '==', true),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const creatorsData = [];
      
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentUser.uid) {
          creatorsData.push({ id: doc.id, ...doc.data() });
        }
      });
      
      // Filter out blocked users
      const filteredCreators = await filterBlockedUsers(currentUser.uid, creatorsData);
      setCreators(filteredCreators);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const [slideDirection, setSlideDirection] = useState(null);

  const handleAction = async (action) => {
    if (currentIndex >= creators.length) return;

    const currentCreator = creators[currentIndex];
    setSlideDirection(action);

    // Save the connection if they clicked connect
    if (action === 'connect') {
      try {
        const connectionRef = doc(db, 'connections', `${currentUser.uid}_${currentCreator.id}`);
        await setDoc(connectionRef, {
          userId: currentUser.uid,
          creatorId: currentCreator.id,
          status: 'pending',
          createdAt: new Date().toISOString()
        });

        // Check if there's a mutual connection
        const reverseConnectionRef = doc(db, 'connections', `${currentCreator.id}_${currentUser.uid}`);
        const reverseConnection = await getDoc(reverseConnectionRef);
        
        if (reverseConnection.exists()) {
          // It's a match!
          setMatchedUser(currentCreator);
          setShowMatch(true);
          setTimeout(() => setShowMatch(false), 3000);
        }
      } catch (error) {
        console.error('Error saving connection:', error);
      }
    }

    // Move to next card with animation
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setSlideDirection(null);
    }, 400);
  };

  const currentCreator = creators[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-vibrant text-white relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="relative z-10">
          {/* Header Skeleton */}
          <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-cyan-900/80 border-b-2 border-purple-400/30">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-16 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </nav>
          </header>

          {/* Card Skeleton */}
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
            <div className="w-full max-w-md mx-auto">
              <div className="aspect-[3/4] rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="space-y-3">
                    <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                      <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-vibrant text-white relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      <div className="relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-cyan-900/80 border-b-2 border-purple-400/30">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link to="/discover" className="text-xl font-bold text-gradient-primary">Lenzli</Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/90">
            <Link to="/discover" className="hover:text-gradient-primary transition font-medium">Discover</Link>
            <Link to="/connections" className="hover:text-gradient-primary transition font-medium">Connections</Link>
            <Link to="/messages" className="hover:text-gradient-primary transition font-medium">Messages</Link>
            <Link to="/profile" className="hover:text-gradient-primary transition font-medium">Profile</Link>
          </div>
        </nav>
      </header>

      {/* Match Notification */}
      {showMatch && matchedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-400/30 via-emerald-500/30 to-emerald-600/30 p-12 text-center max-w-md mx-6 animate-scale-in backdrop-blur-md glow-emerald">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gradient-secondary">It's a Match!</h2>
            <p className="text-white/90 mb-6 font-medium">
              You and <span className="font-bold text-gradient-primary">{matchedUser.displayName}</span> can now collaborate
            </p>
            <div className="flex gap-3">
              <Link
                to="/messages"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all shadow-lg glow-purple"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send Message
              </Link>
              <button
                onClick={() => setShowMatch(false)}
                className="rounded-2xl border-2 border-purple-400/50 bg-purple-500/20 px-6 py-3 text-sm font-medium hover:bg-purple-500/30 transition-all glow-purple"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-md px-6 py-8">
        {currentIndex < creators.length ? (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold mb-2">Discover Creators</h2>
              <p className="text-white/60 text-sm">
                {creators.length - currentIndex} {creators.length - currentIndex === 1 ? 'creator' : 'creators'} remaining
              </p>
            </div>

            {/* Card Display */}
            <div className="relative h-[600px]">
              {/* Background cards for depth effect */}
              {creators.slice(currentIndex + 1, currentIndex + 3).map((creator, idx) => (
                <div
                  key={creator.id}
                  className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5"
                  style={{
                    transform: `scale(${1 - (idx + 1) * 0.05}) translateY(${(idx + 1) * -10}px)`,
                    zIndex: 10 - idx
                  }}
                />
              ))}

              {/* Main Card */}
              <div
                className={`absolute inset-0 rounded-3xl border border-white/20 bg-cover bg-center shadow-2xl transition-all duration-400 ${
                  slideDirection === 'pass' ? '-translate-x-full opacity-0 -rotate-12' :
                  slideDirection === 'connect' ? 'translate-x-full opacity-0 rotate-12' : ''
                }`}
                style={{
                  backgroundImage: currentCreator?.portfolioImages?.[0]
                    ? `url(${currentCreator.portfolioImages[0]})`
                    : 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.8))',
                  zIndex: 20
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 rounded-3xl" />

                {/* Action indicators */}
                <div className={`absolute left-8 top-8 px-6 py-3 rounded-2xl border-2 font-bold text-lg transition-opacity ${
                  slideDirection === 'pass' 
                    ? 'opacity-100 border-rose-400 bg-rose-400/20 text-rose-300' 
                    : 'opacity-0 border-rose-400/30 text-rose-300/50'
                }`}>
                  PASS
                </div>
                
                <div className={`absolute right-8 top-8 px-6 py-3 rounded-2xl border-2 font-bold text-lg transition-opacity ${
                  slideDirection === 'connect' 
                    ? 'opacity-100 border-emerald-400 bg-emerald-400/20 text-emerald-300' 
                    : 'opacity-0 border-emerald-400/30 text-emerald-300/50'
                }`}>
                  CONNECT
                </div>

                {/* Creator Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold">{currentCreator?.displayName || 'Creator'}</h3>
                    <p className="text-white/80">{currentCreator?.role || 'Photographer'}</p>
                  </div>

                  {currentCreator?.bio && (
                    <p className="text-sm text-white/70 line-clamp-2">{currentCreator.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {currentCreator?.location && (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
                        {currentCreator.location}
                      </span>
                    )}
                    {currentCreator?.gear?.slice(0, 2).map((gear) => (
                      <span key={gear} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
                        {gear}
                      </span>
                    ))}
                  </div>

                  {currentCreator?.specialties && currentCreator.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {currentCreator.specialties.slice(0, 3).map((specialty) => (
                        <span key={specialty} className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 backdrop-blur">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-center gap-4">
              {/* Pass Button */}
              <button
                onClick={() => handleAction('pass')}
                className="group flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-rose-400 bg-gradient-to-br from-rose-400/20 to-pink-500/20 hover:from-rose-400/30 hover:to-pink-500/30 hover:border-rose-400 transition-all shadow-lg hover:shadow-rose-400/30 glow-pink"
                title="Pass"
              >
                <svg className="w-6 h-6 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-bold text-rose-300">Pass</span>
              </button>

              {/* View Profile Button */}
              <button
                onClick={() => {
                  navigate(`/profile/${currentCreator?.id}`);
                }}
                className="flex items-center gap-2 px-5 py-4 rounded-2xl border-2 border-purple-400/50 bg-purple-500/20 hover:bg-purple-500/30 transition-all shadow-lg glow-purple"
                title="View Profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-semibold text-sm">Profile</span>
              </button>

              {/* Connect Button */}
              <button
                onClick={() => handleAction('connect')}
                className="group flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 hover:from-emerald-400/30 hover:to-emerald-500/30 hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-400/30 glow-emerald"
                title="Connect"
              >
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-emerald-300">Connect</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Click Pass to skip • Click Connect to match
              </p>
              <p className="text-xs text-white/40 mt-1">
                {currentIndex + 1} of {creators.length}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 px-6 backdrop-blur-md glow-purple">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gradient-primary">You've seen everyone!</h2>
            <p className="text-white/80 mb-6 font-medium">Check back later for more creators</p>
            <Link
              to="/connections"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-primary text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all shadow-lg glow-purple"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              View Connections
            </Link>
          </div>
        )}
      </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
