import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { blockUser, isUserBlocked } from '../utils/safety';
import ReportModal from '../components/ReportModal';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const isOwnProfile = !userId || userId === currentUser.uid;

  useEffect(() => {
    fetchProfile();
  }, [userId, currentUser]);

  useEffect(() => {
    if (!isOwnProfile && profile && currentUser?.uid) {
      checkIfBlocked();
    }
  }, [profile, currentUser, isOwnProfile]);

  const checkIfBlocked = async () => {
    try {
      const blocked = await isUserBlocked(currentUser.uid, profile?.id);
      setIsBlocked(blocked);
    } catch (error) {
      console.error('Error checking if user is blocked:', error);
    }
  };

  const handleBlock = async () => {
    if (!window.confirm(`Are you sure you want to block ${profile?.displayName}? You won't be able to see their profile or receive messages from them.`)) {
      return;
    }

    setBlocking(true);
    try {
      await blockUser(currentUser.uid, profile.id);
      setIsBlocked(true);
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user. Please try again.');
    } finally {
      setBlocking(false);
    }
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft' && profile?.portfolioImages?.length > 1) {
        e.preventDefault();
        const prevIndex = selectedImage.index > 0 ? selectedImage.index - 1 : profile.portfolioImages.length - 1;
        setSelectedImage({ url: profile.portfolioImages[prevIndex], index: prevIndex });
      } else if (e.key === 'ArrowRight' && profile?.portfolioImages?.length > 1) {
        e.preventDefault();
        const nextIndex = selectedImage.index < profile.portfolioImages.length - 1 ? selectedImage.index + 1 : 0;
        setSelectedImage({ url: profile.portfolioImages[nextIndex], index: nextIndex });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, profile?.portfolioImages]);

  const fetchProfile = async () => {
    try {
      const profileId = userId || currentUser.uid;
      const docRef = doc(db, 'users', profileId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

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

          {/* Profile Content Skeleton */}
          <div className="mx-auto max-w-4xl px-6 py-8 relative z-10">
            <div className="text-center mb-8">
              <div className="w-32 h-32 rounded-full bg-white/10 mx-auto mb-4 animate-pulse" />
              <div className="h-8 w-48 bg-white/10 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-32 bg-white/10 rounded mx-auto mb-4 animate-pulse" />
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-20 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 p-6">
                  <div className="aspect-video bg-white/10 rounded-xl animate-pulse mb-4" style={{ animationDelay: `${i * 100}ms` }} />
                  <div className="h-4 w-full bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
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

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8 relative z-10">
        {/* Profile Header */}
        <div className="rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-md p-8 mb-6 shadow-2xl glow-purple">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div className="flex items-start gap-6 w-full md:w-auto">
              {/* Avatar */}
              <div
                className="w-32 h-32 rounded-full bg-cover bg-center flex-shrink-0 ring-4 ring-emerald-400/20 shadow-lg hover:ring-emerald-400/40 transition-all duration-300"
                style={{
                  backgroundImage: profile?.portfolioImages?.[0]
                    ? `url(${profile.portfolioImages[0]})`
                    : 'linear-gradient(to bottom right, rgba(139,92,246,0.3), rgba(16,185,129,0.3))'
                }}
              />

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {profile?.displayName || 'Creator'}
                </h1>
                <p className="text-emerald-400 text-xl font-medium mb-2">{profile?.role || 'Photographer'}</p>
                {profile?.location && (
                  <p className="text-white/70 text-sm mt-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnProfile ? (
              <div className="flex gap-3 flex-shrink-0">
                <Link
                  to="/edit-profile"
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-6 py-3 text-sm font-medium text-rose-300 hover:bg-rose-400/20 hover:border-rose-400/50 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                {!isBlocked ? (
                  <>
                    <Link
                      to="/messages"
                      className="rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-black px-8 py-3 text-sm font-semibold hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-400/20 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Send Message
                    </Link>
                    <button
                      onClick={handleBlock}
                      disabled={blocking}
                      className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      {blocking ? 'Blocking...' : 'Block'}
                    </button>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-6 py-3 text-sm font-medium text-rose-300 hover:bg-rose-400/20 hover:border-rose-400/50 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Report
                    </button>
                  </>
                ) : (
                  <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-8 py-3 text-sm font-medium text-rose-300 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    User Blocked
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bio */}
          {profile?.bio && (
            <p className="text-white/80 leading-relaxed mb-6 text-lg">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-purple-400/20 bg-purple-400/10 p-4 hover:bg-purple-400/15 hover:border-purple-400/30 transition-all duration-200 cursor-default">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-400/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-300">{profile?.portfolioImages?.length || 0}</div>
                  <div className="text-purple-300/70 text-sm">Works</div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 hover:bg-blue-400/15 hover:border-blue-400/30 transition-all duration-200 cursor-default">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-300">{profile?.specialties?.length || 0}</div>
                  <div className="text-blue-300/70 text-sm">Specialties</div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 hover:bg-emerald-400/15 hover:border-emerald-400/30 transition-all duration-200 cursor-default">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${profile?.availability ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                    <span className="text-emerald-300 font-semibold">{profile?.availability ? 'Available' : 'Unavailable'}</span>
                  </div>
                  <div className="text-emerald-300/70 text-sm mt-1">Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Experience & Social */}
        {(profile?.skillLevel || profile?.yearsExperience || profile?.instagram || profile?.website) && (
          <div className="rounded-3xl border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md p-8 mb-6 shadow-xl glow-cyan">
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Experience & Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profile.skillLevel && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-purple-400/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Skill Level</div>
                    <div className="font-semibold text-lg">{profile.skillLevel}</div>
                  </div>
                </div>
              )}
              {profile.yearsExperience && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-blue-400/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Experience</div>
                    <div className="font-semibold text-lg">{profile.yearsExperience} {profile.yearsExperience === '1' ? 'year' : 'years'}</div>
                  </div>
                </div>
              )}
              {profile.instagram && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-pink-400/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Instagram</div>
                    <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg text-pink-300 hover:text-pink-400 transition-colors">
                      {profile.instagram}
                    </a>
                  </div>
                </div>
              )}
              {profile.website && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Website</div>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-lg text-emerald-300 hover:text-emerald-400 transition-colors truncate block">
                      {profile.website.replace('https://', '').replace('http://', '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gear & Specialties */}
        {(profile?.gear?.length > 0 || profile?.specialties?.length > 0 || profile?.photographyStyles?.length > 0 || profile?.lookingFor?.length > 0) && (
          <div className="rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-emerald-500/20 backdrop-blur-md p-8 mb-6 shadow-xl glow-purple space-y-8">
            {profile?.gear?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Camera Gear
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.gear.map((gear) => (
                    <span
                      key={gear}
                      className="px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-sm hover:bg-white/10 hover:border-white/30 transition-all duration-200 hover:scale-105"
                    >
                      {gear}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.specialties?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-4 py-2 rounded-xl border border-emerald-400/30 bg-emerald-400/15 text-emerald-300 text-sm font-medium hover:bg-emerald-400/25 hover:border-emerald-400/50 transition-all duration-200 hover:scale-105"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.photographyStyles?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Photography Styles
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.photographyStyles.map((style) => (
                    <span
                      key={style}
                      className="px-4 py-2 rounded-xl border border-purple-400/30 bg-purple-400/15 text-purple-300 text-sm font-medium hover:bg-purple-400/25 hover:border-purple-400/50 transition-all duration-200 hover:scale-105"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.lookingFor?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Looking For
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.lookingFor.map((item) => (
                    <span
                      key={item}
                      className="px-4 py-2 rounded-xl border border-blue-400/30 bg-blue-400/15 text-blue-300 text-sm font-medium hover:bg-blue-400/25 hover:border-blue-400/50 transition-all duration-200 hover:scale-105"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Portfolio */}
        {profile?.portfolioImages?.length > 0 && (
          <div className="rounded-3xl border-2 border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-md p-8 shadow-xl glow-emerald">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-xl flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Portfolio
              </h3>
              <span className="text-white/60 text-sm">{profile.portfolioImages.length} {profile.portfolioImages.length === 1 ? 'image' : 'images'}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.portfolioImages.map((image, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage({ url: image, index: idx })}
                  className="aspect-square rounded-2xl bg-cover bg-center cursor-pointer hover:scale-105 transition-transform duration-300 group relative overflow-hidden"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/0 group-hover:text-white/80 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-7xl max-h-full">
              <img
                src={selectedImage.url}
                alt={`Portfolio image ${selectedImage.index + 1}`}
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {profile?.portfolioImages?.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const prevIndex = selectedImage.index > 0 ? selectedImage.index - 1 : profile.portfolioImages.length - 1;
                      setSelectedImage({ url: profile.portfolioImages[prevIndex], index: prevIndex });
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextIndex = selectedImage.index < profile.portfolioImages.length - 1 ? selectedImage.index + 1 : 0;
                      setSelectedImage({ url: profile.portfolioImages[nextIndex], index: nextIndex });
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
                    {selectedImage.index + 1} / {profile.portfolioImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!profile?.profileComplete && isOwnProfile && (
          <div className="text-center py-16 rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-md shadow-lg glow-purple">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400/20 to-emerald-400/20 border border-white/10 flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Complete Your Profile</h2>
            <p className="text-white/70 mb-8 text-lg max-w-md mx-auto">
              Add your work, gear, and specialties to get discovered by other creators
            </p>
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-black px-8 py-4 text-sm font-semibold hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-400/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Complete Profile
            </Link>
          </div>
        )}
      </div>
      </div>

      {/* Report Modal */}
      {profile && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportedUserId={profile.id}
          reportedUserName={profile.displayName || 'User'}
        />
      )}
    </div>
  );
}

