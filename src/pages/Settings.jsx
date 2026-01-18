import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Settings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [privacySettings, setPrivacySettings] = useState({
    hideFromDiscovery: false,
    messagePrivacy: 'everyone' // 'everyone' | 'connections' | 'none'
  });

  useEffect(() => {
    fetchSettings();
  }, [currentUser]);

  const fetchSettings = async () => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        setPrivacySettings({
          hideFromDiscovery: data.hideFromDiscovery || false,
          messagePrivacy: data.messagePrivacy || 'everyone'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser?.uid) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        hideFromDiscovery: privacySettings.hideFromDiscovery,
        messagePrivacy: privacySettings.messagePrivacy,
        updatedAt: new Date().toISOString()
      });

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-vibrant text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="relative z-10">
          <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-cyan-900/80 border-b-2 border-purple-400/30">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 w-16 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </nav>
          </header>
          <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/10 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-vibrant text-white relative overflow-hidden">
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
              <Link to="/settings" className="hover:text-gradient-primary transition font-medium text-gradient-primary">Settings</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-6 py-8 relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Settings</h1>
            <p className="text-white/80 font-medium">Manage your privacy and account preferences</p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-2xl border-2 border-rose-400/50 bg-rose-500/20 text-rose-200 backdrop-blur-sm glow-pink">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-2xl border-2 border-emerald-400/50 bg-emerald-500/20 text-emerald-200 backdrop-blur-sm glow-emerald">
              {success}
            </div>
          )}

          {/* Privacy Controls */}
          <div className="rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-md p-8 mb-6 shadow-xl glow-purple">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy Controls
            </h2>

            {/* Hide from Discovery */}
            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Hide Profile from Discovery</h3>
                  <p className="text-sm text-white/60">
                    When enabled, your profile won't appear in the discovery feed for other users
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivacySettings({ ...privacySettings, hideFromDiscovery: !privacySettings.hideFromDiscovery })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    privacySettings.hideFromDiscovery ? 'bg-emerald-400' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      privacySettings.hideFromDiscovery ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Message Privacy */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="font-semibold text-lg mb-2">Who Can Message You</h3>
              <p className="text-sm text-white/60 mb-4">
                Control who can send you messages
              </p>
              <div className="space-y-2">
                {[
                  { value: 'everyone', label: 'Everyone', desc: 'Anyone can message you' },
                  { value: 'connections', label: 'Connections Only', desc: 'Only users you\'ve connected with can message you' },
                  { value: 'none', label: 'No One', desc: 'Disable messaging completely' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      privacySettings.messagePrivacy === option.value
                        ? 'border-emerald-400/50 bg-emerald-400/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="messagePrivacy"
                      value={option.value}
                      checked={privacySettings.messagePrivacy === option.value}
                      onChange={(e) => setPrivacySettings({ ...privacySettings, messagePrivacy: e.target.value })}
                      className="mt-1 w-4 h-4 text-emerald-400 focus:ring-emerald-400 focus:ring-2"
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-white/60">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Blocked Users Section */}
          <div className="rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-md p-8 mb-6 shadow-xl glow-purple">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Blocked Users
            </h2>
            <p className="text-white/70 mb-4">
              Manage users you've blocked. Blocked users won't be able to see your profile or send you messages.
            </p>
            <Link
              to="/blocked-users"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Manage Blocked Users
            </Link>
          </div>

          {/* Account Section */}
          <div className="rounded-3xl border-2 border-purple-400/30 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-md p-8 shadow-xl glow-purple">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </h2>
            <div className="space-y-4">
              <Link
                to="/edit-profile"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="font-medium">Edit Profile</span>
                </div>
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 rounded-2xl border-2 border-purple-300/90 bg-purple-400/50 px-6 py-3 text-sm font-medium hover:bg-purple-400/60 hover:border-purple-300 transition-all glow-purple text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-2xl bg-gradient-primary text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all shadow-lg glow-purple disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

