import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { Palette, Check, Shield, User, Lock, Plus } from 'lucide-react';

export default function Settings() {
  const { currentUser } = useAuth();
  const { currentTheme, changeTheme, themes } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [privacySettings, setPrivacySettings] = useState({
    hideFromDiscovery: false,
    messagePrivacy: 'everyone'
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
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)]">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="h-8 w-48 bg-[var(--text-primary)]/10 rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-[var(--text-primary)]/5 border border-[var(--border-color)] rounded-2xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-[var(--text-secondary)]">Manage your privacy, appearance, and account preferences</p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Appearance Section */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 mb-6 shadow-card">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[var(--text-secondary)]" />
            Appearance
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className={`relative group flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  currentTheme === theme.id 
                    ? 'border-[var(--text-primary)] bg-[var(--text-primary)]/5 scale-[1.02]' 
                    : 'border-transparent bg-[var(--text-primary)]/5 hover:border-[var(--border-color)] hover:scale-[1.01]'
                }`}
              >
                <div 
                  className="w-full aspect-square rounded-xl shadow-inner border border-[var(--border-color)] overflow-hidden flex flex-col"
                  style={{ backgroundColor: theme.bg }}
                >
                  <div className="h-1/3 w-full opacity-20" style={{ backgroundColor: theme.text }} />
                  <div className="flex-1 flex flex-col p-2 gap-1">
                    <div className="h-1 w-2/3 rounded-full" style={{ backgroundColor: theme.text, opacity: 0.4 }} />
                    <div className="h-1 w-1/2 rounded-full" style={{ backgroundColor: theme.text, opacity: 0.2 }} />
                  </div>
                </div>
                
                <span className={`text-sm font-bold ${currentTheme === theme.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {theme.name}
                </span>

                {currentTheme === theme.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent-color)] rounded-full flex items-center justify-center shadow-lg border-2 border-[var(--card-bg)]">
                    <Check className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 mb-6 shadow-card">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[var(--text-secondary)]" />
            Privacy Controls
          </h2>

          {/* Hide from Discovery */}
          <div className="mb-6 p-4 rounded-xl bg-[var(--text-primary)]/5 border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg mb-1">Hide Profile from Discovery</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  When enabled, your profile won't appear in the discovery feed for other users
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPrivacySettings({ ...privacySettings, hideFromDiscovery: !privacySettings.hideFromDiscovery })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${privacySettings.hideFromDiscovery ? 'bg-[var(--accent-color)]' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition shadow-sm ${privacySettings.hideFromDiscovery ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Message Privacy */}
          <div className="p-4 rounded-xl bg-[var(--text-primary)]/5 border border-[var(--border-color)]">
            <h3 className="font-semibold text-lg mb-2">Who Can Message You</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
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
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${privacySettings.messagePrivacy === option.value
                      ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5'
                      : 'border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--text-primary)]/5'
                    }`}
                >
                  <input
                    type="radio"
                    name="messagePrivacy"
                    value={option.value}
                    checked={privacySettings.messagePrivacy === option.value}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, messagePrivacy: e.target.value })}
                    className="mt-1 w-4 h-4 text-[var(--accent-color)] focus:ring-[var(--accent-color)] focus:ring-2"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Blocked Users Section */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 mb-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--text-secondary)]" />
            Blocked Users
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Manage users you've blocked. Blocked users won't be able to see your profile or send you messages.
          </p>
          <Link
            to="/blocked-users"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--text-primary)]/5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Manage Blocked Users
          </Link>
        </div>

        {/* Account Section */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-8 shadow-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--text-secondary)]" />
            Account
          </h2>
          <div className="space-y-3">
            <Link
              to="/edit-profile"
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--text-primary)]/5 border border-[var(--border-color)] hover:bg-[var(--text-primary)]/10 transition"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="font-medium">Edit Profile</span>
              </div>
              <Check className="w-5 h-5 text-[var(--text-secondary)]/30" />
            </Link>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-6 py-3 text-sm font-medium hover:bg-[var(--text-primary)]/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-[var(--accent-color)] text-[var(--accent-text)] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-all shadow-subtle disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
