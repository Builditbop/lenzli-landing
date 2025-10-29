import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { demoProfiles, generateMoreDemoProfiles } from '../utils/seedData';
import { Link } from 'react-router-dom';

export default function SeedDatabase() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [seededCount, setSeededCount] = useState(0);

  const seedDemoProfiles = async () => {
    setLoading(true);
    setError('');
    setStatus('Starting to seed demo profiles...');
    let count = 0;

    try {
      // Seed the curated demo profiles
      for (const profile of demoProfiles) {
        const userId = `demo_${profile.displayName.replace(/\s+/g, '_').toLowerCase()}`;
        const userRef = doc(db, 'users', userId);
        
        await setDoc(userRef, {
          uid: userId,
          ...profile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        count++;
        setStatus(`Seeded ${count} profiles...`);
        setSeededCount(count);
      }

      // Generate and seed additional profiles
      const additionalProfiles = generateMoreDemoProfiles(10);
      for (const profile of additionalProfiles) {
        const userId = `demo_${profile.email.split('@')[0]}`;
        const userRef = doc(db, 'users', userId);
        
        await setDoc(userRef, {
          uid: userId,
          ...profile,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        count++;
        setStatus(`Seeded ${count} profiles...`);
        setSeededCount(count);
      }

      setStatus(`✅ Successfully seeded ${count} demo profiles!`);
    } catch (err) {
      console.error('Error seeding profiles:', err);
      setError(`Failed after ${count} profiles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearDemoProfiles = async () => {
    if (!window.confirm('Are you sure you want to delete all demo profiles? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    setStatus('Clearing demo profiles...');

    try {
      // This would need to query and delete all profiles with isDemo: true
      // For now, just show a message
      setStatus('⚠️ To clear demo profiles, go to Firebase Console → Firestore → Delete manually');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seed Demo Profiles</h1>
          <p className="text-white/70">
            Populate your database with realistic photographer profiles for testing and demos
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">Demo Profile Generator</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-400/10 border border-blue-400/20">
              <h3 className="font-semibold text-blue-300 mb-2">What This Does:</h3>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• Creates <strong>24 realistic photographer profiles</strong></li>
                <li>• Includes names, bios, locations, gear, and portfolio images</li>
                <li>• Each profile is marked as <code className="bg-white/10 px-1 rounded">isDemo: true</code></li>
                <li>• Profiles appear in Discover for all users to swipe</li>
                <li>• Perfect for testing and showing potential users how the app works</li>
              </ul>
            </div>

            {status && (
              <div className={`p-4 rounded-2xl border ${
                status.includes('✅') 
                  ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-white/80'
              }`}>
                {status}
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-300">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={seedDemoProfiles}
                disabled={loading}
                className="flex-1 rounded-2xl bg-emerald-400 text-black px-6 py-4 font-medium hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Seeding...' : '🌱 Seed Demo Profiles'}
              </button>
              
              <button
                onClick={clearDemoProfiles}
                disabled={loading}
                className="rounded-2xl border border-rose-400/30 bg-rose-400/10 text-rose-300 px-6 py-4 font-medium hover:bg-rose-400/20 transition disabled:opacity-50"
              >
                🗑️ Clear Demos
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-6">
          <h2 className="text-xl font-semibold mb-4">Demo Profiles Preview</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {demoProfiles.map((profile, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${profile.portfolioImages[0]})` }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{profile.displayName}</h3>
                    <p className="text-sm text-white/70">{profile.role} • {profile.location}</p>
                    <p className="text-xs text-white/60 mt-1 line-clamp-1">{profile.bio}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.gear.slice(0, 2).map((gear) => (
                        <span key={gear} className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                          {gear}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/50 mt-4">
            + 10 more generated profiles will be created when you seed
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6">
          <h3 className="font-semibold text-yellow-300 mb-2">⚠️ Important Notes:</h3>
          <ul className="text-sm text-white/80 space-y-1">
            <li>• Demo profiles are marked with <code className="bg-white/10 px-1 rounded">isDemo: true</code></li>
            <li>• They won't interfere with real users</li>
            <li>• You can filter them out in queries later if needed</li>
            <li>• Images are from Unsplash (free to use)</li>
            <li>• Run this once - running again will overwrite existing demos</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link to="/discover" className="text-sm text-white/60 hover:text-white">
            ← Back to Discover
          </Link>
        </div>
      </div>
    </div>
  );
}

