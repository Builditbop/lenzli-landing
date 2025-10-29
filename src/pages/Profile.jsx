import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = !userId || userId === currentUser.uid;

  useEffect(() => {
    fetchProfile();
  }, [userId, currentUser]);

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link to="/discover" className="text-xl font-semibold hover:opacity-80">
              Lenzli
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/discover" className="hover:text-white/80">Discover</Link>
            <Link to="/connections" className="hover:text-white/80">Connections</Link>
            <Link to="/messages" className="hover:text-white/80">Messages</Link>
            <Link to="/profile" className="hover:text-white/80">Profile</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Profile Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-2xl bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: profile?.portfolioImages?.[0]
                    ? `url(${profile.portfolioImages[0]})`
                    : 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
                }}
              />

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold mb-1">{profile?.displayName || 'Creator'}</h1>
                <p className="text-white/70 text-lg">{profile?.role || 'Photographer'}</p>
                {profile?.location && (
                  <p className="text-white/60 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="flex gap-2">
                <Link
                  to="/edit-profile"
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-300 hover:bg-rose-400/20 transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/messages"
                className="rounded-2xl bg-emerald-400 text-black px-6 py-2 text-sm font-medium hover:bg-emerald-500 transition"
              >
                Send Message
              </Link>
            )}
          </div>

          {/* Bio */}
          {profile?.bio && (
            <p className="text-white/80 leading-relaxed mb-6">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div>
              <div className="text-2xl font-bold">{profile?.portfolioImages?.length || 0}</div>
              <div className="text-white/60">Works</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{profile?.specialties?.length || 0}</div>
              <div className="text-white/60">Specialties</div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className={`inline-block w-2 h-2 rounded-full ${profile?.availability ? 'bg-emerald-400' : 'bg-white/30'}`} />
                <span className="text-white/70">{profile?.availability ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Experience & Social */}
        {(profile?.skillLevel || profile?.yearsExperience || profile?.instagram || profile?.website) && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-6">
            <h3 className="font-semibold mb-4">Experience & Links</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {profile.skillLevel && (
                <div>
                  <div className="text-white/60">Skill Level</div>
                  <div className="font-medium">{profile.skillLevel}</div>
                </div>
              )}
              {profile.yearsExperience && (
                <div>
                  <div className="text-white/60">Experience</div>
                  <div className="font-medium">{profile.yearsExperience} years</div>
                </div>
              )}
              {profile.instagram && (
                <div>
                  <div className="text-white/60">Instagram</div>
                  <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-400 hover:underline">
                    {profile.instagram}
                  </a>
                </div>
              )}
              {profile.website && (
                <div>
                  <div className="text-white/60">Website</div>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-400 hover:underline truncate block">
                    {profile.website.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gear & Specialties */}
        {(profile?.gear?.length > 0 || profile?.specialties?.length > 0 || profile?.photographyStyles?.length > 0 || profile?.lookingFor?.length > 0) && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-6 space-y-6">
            {profile?.gear?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Camera Gear</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.gear.map((gear) => (
                    <span
                      key={gear}
                      className="px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm"
                    >
                      {gear}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.specialties?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.photographyStyles?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Photography Styles</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.photographyStyles.map((style) => (
                    <span
                      key={style}
                      className="px-3 py-1.5 rounded-full border border-purple-400/20 bg-purple-400/10 text-purple-300 text-sm"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.lookingFor?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Looking For</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.lookingFor.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-full border border-blue-400/20 bg-blue-400/10 text-blue-300 text-sm"
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
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="font-semibold mb-4">Portfolio</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.portfolioImages.map((image, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-2xl bg-cover bg-center hover:scale-105 transition-transform cursor-pointer"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!profile?.profileComplete && isOwnProfile && (
          <div className="text-center py-12 rounded-3xl border border-white/10 bg-white/5">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Complete Your Profile</h2>
            <p className="text-white/70 mb-6">
              Add your work, gear, and specialties to get discovered
            </p>
            <Link
              to="/edit-profile"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Complete Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

