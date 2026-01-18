import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { filterBlockedUsers } from '../utils/safety';
import { searchUsers, applyFilters, hasActiveFilters, countActiveFilters, clearFilters } from '../utils/search';
import FilterModal from '../components/FilterModal';

export default function Discover() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [allCreators, setAllCreators] = useState([]);
  const [creators, setCreators] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    roles: [],
    gear: [],
    specialties: [],
    skillLevel: [],
    availability: null
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  useEffect(() => {
    fetchCreators();
    fetchSavedSearches();
  }, [currentUser]);

  useEffect(() => {
    applySearchAndFilters();
  }, [allCreators, searchQuery, filters]);

  // Close saved searches dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSavedSearches && !event.target.closest('.relative')) {
        setShowSavedSearches(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSavedSearches]);

  const fetchSavedSearches = async () => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const savedSearchesData = userSnap.data().savedSearches || [];
        setSavedSearches(savedSearchesData);
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    }
  };

  const applySearchAndFilters = () => {
    let filtered = [...allCreators];
    
    // Apply search
    if (searchQuery.trim()) {
      filtered = searchUsers(filtered, searchQuery);
    }
    
    // Apply filters
    if (hasActiveFilters(filters)) {
      filtered = applyFilters(filtered, filters);
    }
    
    setCreators(filtered);
    setCurrentIndex(0); // Reset to first card when filters change
  };

  const handleSaveSearch = async () => {
    if (!hasActiveFilters(filters) && !searchQuery.trim()) {
      alert('Please add filters or a search query before saving');
      return;
    }

    if (!currentUser?.uid) return;

    try {
      const searchName = prompt('Enter a name for this search:');
      if (!searchName) return;

      const newSearch = {
        id: Date.now().toString(),
        name: searchName,
        searchQuery: searchQuery.trim(),
        filters: { ...filters },
        createdAt: new Date().toISOString()
      };

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const currentSearches = userSnap.exists() ? (userSnap.data().savedSearches || []) : [];
      
      await updateDoc(userRef, {
        savedSearches: [...currentSearches, newSearch],
        updatedAt: new Date().toISOString()
      });

      setSavedSearches([...currentSearches, newSearch]);
      alert('Search saved successfully!');
    } catch (error) {
      console.error('Error saving search:', error);
      alert('Failed to save search');
    }
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.searchQuery || '');
    setFilters(savedSearch.filters || clearFilters());
    setShowSavedSearches(false);
  };

  const handleDeleteSavedSearch = async (searchId) => {
    if (!currentUser?.uid) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updatedSearches = savedSearches.filter(s => s.id !== searchId);
      
      await updateDoc(userRef, {
        savedSearches: updatedSearches,
        updatedAt: new Date().toISOString()
      });

      setSavedSearches(updatedSearches);
    } catch (error) {
      console.error('Error deleting saved search:', error);
      alert('Failed to delete search');
    }
  };

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
          const userData = doc.data();
          // Filter out users who have hidden their profile from discovery
          if (!userData.hideFromDiscovery) {
            creatorsData.push({ id: doc.id, ...userData });
          }
        }
      });
      
      // Filter out blocked users
      const filteredCreators = await filterBlockedUsers(currentUser.uid, creatorsData);
      setAllCreators(filteredCreators);
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
            <Link to="/settings" className="hover:text-gradient-primary transition font-medium">Settings</Link>
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
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, location, gear..."
                className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all text-white placeholder-white/40"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                hasActiveFilters(filters)
                  ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                  : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {hasActiveFilters(filters) && (
                  <span className="bg-emerald-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {countActiveFilters(filters)}
                  </span>
                )}
              </div>
            </button>
            {savedSearches.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowSavedSearches(!showSavedSearches)}
                  className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                {showSavedSearches && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black shadow-2xl overflow-hidden z-50">
                    <div className="p-3 border-b border-white/10 bg-white/5">
                      <div className="text-xs font-semibold text-white/60">Saved Searches</div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {savedSearches.map((search) => (
                        <div key={search.id} className="p-3 border-b border-white/5 hover:bg-white/5 transition">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{search.name}</div>
                              {(search.searchQuery || hasActiveFilters(search.filters)) && (
                                <div className="text-xs text-white/50 mt-1">
                                  {search.searchQuery && `"${search.searchQuery}"`}
                                  {search.searchQuery && hasActiveFilters(search.filters) && ' • '}
                                  {hasActiveFilters(search.filters) && `${countActiveFilters(search.filters)} filters`}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleLoadSavedSearch(search)}
                                className="p-1 rounded hover:bg-white/10 transition"
                                title="Load search"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteSavedSearch(search.id)}
                                className="p-1 rounded hover:bg-red-500/20 transition text-red-400"
                                title="Delete search"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {(hasActiveFilters(filters) || searchQuery.trim()) && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters(clearFilters());
                }}
                className="text-xs text-white/60 hover:text-white transition flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all
              </button>
              {hasActiveFilters(filters) && (
                <button
                  onClick={handleSaveSearch}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 ml-auto"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save search
                </button>
              )}
            </div>
          )}
        </div>

        {currentIndex < creators.length ? (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold mb-2">Discover Creators</h2>
              <p className="text-white/60 text-sm">
                {creators.length - currentIndex} {creators.length - currentIndex === 1 ? 'creator' : 'creators'} remaining
                {creators.length !== allCreators.length && ` (${creators.length} of ${allCreators.length} shown)`}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

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
