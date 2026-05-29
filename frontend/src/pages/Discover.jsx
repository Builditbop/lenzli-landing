import React, { useState, useEffect } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { filterBlockedUsers } from '../utils/safety';
import { applyFilters, hasActiveFilters, countActiveFilters, clearFilters } from '../utils/search';
import FilterModal from '../components/FilterModal';
import { SlidersHorizontal, MapPin, Camera, X, Heart, Star, Info, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Discover() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [allCreators, setAllCreators] = useState([]);
  const [creators, setCreators] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all',
    location: '',
    minExperience: 0,
    specialties: []
  });

  // State to handle swipe animations
  const [exitX, setExitX] = useState(0);

  useEffect(() => {
    fetchCreators();
  }, [currentUser]);

  useEffect(() => {
    let result = allCreators;
    if (hasActiveFilters(filters)) {
      result = applyFilters(result, filters);
    }
    setCreators(result);
    setCurrentIndex(0);
  }, [filters, allCreators]);

  const fetchCreators = async () => {
    if (!currentUser?.uid) return;
    try {
      const q = query(collection(db, 'users'), limit(50));
      const querySnapshot = await getDocs(q);
      const creatorsData = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentUser.uid) {
          creatorsData.push({ id: doc.id, ...doc.data() });
        }
      });
      const filteredCreators = await filterBlockedUsers(currentUser.uid, creatorsData);
      setAllCreators(filteredCreators);
      setCreators(filteredCreators);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePass = () => {
    setExitX(-200);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitX(0);
    }, 200);
  };

  const handleConnect = () => {
    setExitX(200);
    setTimeout(() => {
      // In a real app, logic for connecting/liking goes here
      setCurrentIndex(prev => prev + 1);
      setExitX(0);
    }, 200);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (creators.length === 0 || currentIndex >= creators.length) return;
      
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key.toLowerCase() === 'a') {
        handlePass();
      } else if (e.key.toLowerCase() === 'd') {
        handleConnect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, creators.length]);

  const currentCreator = creators[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)]">
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
          <div className="w-full max-w-md mx-auto">
            <div className="aspect-[3/4] rounded-2xl border border-[var(--border-color)] bg-[var(--text-primary)]/5 relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="space-y-3">
                  <div className="h-8 w-48 bg-[var(--text-primary)]/10 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-[var(--text-primary)]/10 rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-[var(--text-primary)]/10 rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-[var(--text-primary)]/10 rounded-full animate-pulse" />
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
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300 overflow-hidden">
      {/* Match Notification */}
      {showMatch && matchedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center max-w-md mx-6 shadow-elevated animate-slide-up text-[var(--text-primary)]">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
              <Heart className="w-10 h-10 text-[var(--accent-text)] fill-current" />
            </div>
            <h2 className="text-3xl font-bold mb-2">It's a Connection!</h2>
            <p className="text-[var(--text-secondary)] mb-8">
              You and {matchedUser.displayName} have connected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowMatch(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-[var(--border-color)] font-semibold hover:bg-[var(--text-primary)]/5 transition-all"
              >
                Keep Exploring
              </button>
              <button
                onClick={() => navigate(`/messages?userId=${matchedUser.id}`)}
                className="flex-1 px-6 py-3 rounded-xl bg-[var(--accent-color)] text-[var(--accent-text)] font-semibold hover:opacity-90 transition-all shadow-subtle"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-64px)] flex flex-col">
        {/* Filters Header */}
        <div className="flex justify-end mb-8 shrink-0">
          <button
            onClick={() => setShowFilterModal(true)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--card-bg)] ring-1 ring-[var(--border-color)] shadow-sm font-bold transition-all hover:bg-[var(--text-primary)]/5 ${
              hasActiveFilters(filters) ? 'text-[var(--accent-color)] ring-[var(--accent-color)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {hasActiveFilters(filters) && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent-color)] text-[var(--accent-text)] text-[10px]">
                {countActiveFilters(filters)}
              </span>
            )}
          </button>
        </div>

        {creators.length > 0 && currentIndex < creators.length ? (
          <div className="flex flex-col items-center justify-center flex-1 relative">
            
            {/* Clickable Pass Button (Left) */}
            <button 
              onClick={handlePass}
              className="absolute left-4 xl:left-[15%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-[var(--text-secondary)] hover:text-black transition-colors z-10 group"
              aria-label="Pass (A)"
            >
              <div className="w-14 h-14 rounded-full border-2 border-current flex items-center justify-center font-black text-xl group-hover:scale-110 group-active:scale-95 transition-transform bg-[var(--bg-color)]/50 backdrop-blur-sm">A</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Pass</span>
            </button>

            {/* Clickable Connect Button (Right) */}
            <button 
              onClick={handleConnect}
              className="absolute right-4 xl:right-[15%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 text-[var(--accent-color)] hover:opacity-80 transition-opacity z-10 group"
              aria-label="Connect (D)"
            >
              <div className="w-14 h-14 rounded-full border-2 border-current flex items-center justify-center font-black text-xl group-hover:scale-110 group-active:scale-95 transition-transform bg-[var(--bg-color)]/50 backdrop-blur-sm">D</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Connect</span>
            </button>

            {/* Creator Card */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={creators[currentIndex].id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ x: exitX, scale: 1, opacity: 1, rotate: exitX * 0.05 }}
                exit={{ x: exitX, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full max-w-md relative group z-0"
              >
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-[var(--card-bg)] border border-[var(--border-color)] shadow-elevated relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: creators[currentIndex].portfolioImages?.[0]
                        ? `url(${creators[currentIndex].portfolioImages[0]})`
                        : 'linear-gradient(to bottom right, #e5e7eb, #f3f4f6)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h2 className="text-3xl font-black mb-1">{creators[currentIndex].displayName}</h2>
                    <p className="text-white/80 font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-xs">
                      <Camera className="w-3.5 h-3.5" />
                      {creators[currentIndex].role}
                    </p>
                    
                    {creators[currentIndex].location && (
                      <p className="text-white/60 text-sm flex items-center gap-2 mb-6">
                        <MapPin className="w-4 h-4" />
                        {creators[currentIndex].location}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-8">
                      {creators[currentIndex].specialties?.slice(0, 3).map((s) => (
                        <span key={s} className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-black font-black text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                        onClick={() => navigate(`/profile/${creators[currentIndex].id}`)}
                      >
                        <Info className="w-4 h-4" />
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <p className="absolute bottom-4 text-[var(--text-secondary)]/40 text-xs font-black uppercase tracking-widest shrink-0">
              Creator {currentIndex + 1} of {creators.length}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--border-color)] text-center shadow-sm flex-1">
            <div className="w-20 h-20 bg-[var(--text-primary)]/5 rounded-full flex items-center justify-center mb-6">
              <SlidersHorizontal className="w-8 h-8 text-[var(--text-secondary)]/30" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No creators found</h3>
            <p className="text-[var(--text-secondary)] max-w-xs mx-auto mb-8">
              Try adjusting your filters to find more creative people.
            </p>
            <button
              onClick={() => {
                setFilters({ role: 'all', location: '', minExperience: 0, specialties: [] });
              }}
              className="text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
