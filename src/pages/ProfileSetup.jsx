import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { uploadMultipleImages } from '../utils/cloudinary';

export default function ProfileSetup() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customGear, setCustomGear] = useState('');

  const [profileData, setProfileData] = useState({
    role: '', bio: '', location: '', gear: [], specialties: [],
    photographyStyles: [], skillLevel: '', lookingFor: [],
    portfolioImages: [], availability: true
  });

  const roles = ['Photographer', 'Videographer', 'Cinematographer', 'Gaffer', 'Editor', 'Colorist', 'Producer', 'Director', 'Sound Designer', 'Art Director'];
  const gearOptions = [
    'Sony A7SIII', 'Sony A7IV', 'Sony A7RV', 'Sony FX3', 'Canon R5', 'Canon R6', 'Canon C70', 'Canon C300',
    'RED Komodo', 'RED Raptor', 'ARRI Alexa', 'Fuji X-T5', 'Fuji X-H2S', 'Nikon Z9', 'Nikon Z8',
    'Blackmagic Pocket 6K', 'Panasonic GH6', 'DJI Ronin', 'DJI RS3', 'DJI Mavic 3',
    '24-70mm f/2.8', '70-200mm f/2.8', '85mm f/1.4', '50mm f/1.4'
  ];
  const specialtyOptions = ['Wedding', 'Portrait', 'Commercial', 'Street', 'Landscape', 'Fashion', 'Events', 'Documentary', 'Music Video', 'Corporate', 'Real Estate', 'Product'];
  const skillLevelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Expert'];

  const handleArrayToggle = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setLoading(true); setError('');
    try {
      const filesToUpload = files.slice(0, 6 - profileData.portfolioImages.length);
      const urls = await uploadMultipleImages(filesToUpload);
      setProfileData(prev => ({ ...prev, portfolioImages: [...prev.portfolioImages, ...urls].slice(0, 6) }));
    } catch (err) { setError('Failed to upload images'); console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { ...profileData, profileComplete: true, updatedAt: new Date().toISOString() });
      navigate('/discover');
    } catch (err) { setError('Failed to save profile'); console.error(err); }
    finally { setLoading(false); }
  };

  const nextStep = () => {
    if (step === 1 && !profileData.role) { setError('Please select a role'); return; }
    if (step === 2 && (!profileData.bio || !profileData.location)) { setError('Please fill in all fields'); return; }
    setError(''); setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-black">Complete Your Profile</h1>
            <p className="text-gray-500 font-medium">Step {step} of 4</p>
            <div className="mt-4 flex gap-2 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1.5 w-16 rounded-full transition-colors ${i <= step ? 'bg-black' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">{error}</div>
          )}

          {/* Step 1: Role */}
          {step === 1 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-2xl font-semibold mb-4 text-black">What's your role?</h2>
              <p className="text-gray-500 mb-6">Choose your primary role</p>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setProfileData({ ...profileData, role })}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${profileData.role === role
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 text-gray-700'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <button onClick={nextStep} className="w-full mt-6 rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle">
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Bio & Location */}
          {step === 2 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-2xl font-semibold mb-4 text-black">Tell us about yourself</h2>
              <p className="text-gray-500 mb-6">Share your story and location</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all resize-none text-gray-900"
                    rows="4"
                    placeholder="Tell other creators about your experience and style..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                    placeholder="City, State or Country"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700">
                  Back
                </button>
                <button onClick={nextStep} className="flex-1 rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Gear & Specialties */}
          {step === 3 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-2xl font-semibold mb-4 text-black">Your gear & style</h2>
              <p className="text-gray-500 mb-6">Select all that apply (you can add more later!)</p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-black">Camera Gear</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {gearOptions.map((gear) => (
                      <button key={gear} type="button" onClick={() => handleArrayToggle('gear', gear)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${profileData.gear.includes(gear) ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 text-gray-700'
                          }`}
                      >{gear}</button>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input type="text" value={customGear} onChange={(e) => setCustomGear(e.target.value)}
                        placeholder="Add custom gear (e.g., Leica M10)"
                        className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-xs outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (customGear.trim() && !profileData.gear.includes(customGear.trim())) {
                              setProfileData(prev => ({ ...prev, gear: [...prev.gear, customGear.trim()] }));
                              setCustomGear('');
                            }
                          }
                        }}
                      />
                      <button type="button" onClick={() => {
                        if (customGear.trim() && !profileData.gear.includes(customGear.trim())) {
                          setProfileData(prev => ({ ...prev, gear: [...prev.gear, customGear.trim()] }));
                          setCustomGear('');
                        }
                      }} disabled={!customGear.trim()} className="rounded-xl bg-gray-100 border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-200 transition disabled:opacity-50">
                        Add
                      </button>
                    </div>
                  </div>
                  {profileData.gear.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {profileData.gear.map((gear) => (
                        <span key={gear} className="text-xs px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700">{gear}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3 text-black">Specialties</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {specialtyOptions.map((specialty) => (
                      <button key={specialty} type="button" onClick={() => handleArrayToggle('specialties', specialty)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${profileData.specialties.includes(specialty) ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 text-gray-700'
                          }`}
                      >{specialty}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="flex-1 rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Portfolio Images */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-2xl font-semibold mb-4 text-black">Upload your work</h2>
              <p className="text-gray-500 mb-6">Add up to 6 images that showcase your style</p>
              <div>
                <label className="block w-full rounded-xl border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-gray-400 transition">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={loading || profileData.portfolioImages.length >= 6} />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{loading ? 'Uploading...' : 'Click to upload images'}</div>
                  <div className="text-xs text-gray-400 mt-1">{profileData.portfolioImages.length}/6 images • Optional</div>
                </label>
                {profileData.portfolioImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {profileData.portfolioImages.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <img src={url} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setProfileData(prev => ({ ...prev, portfolioImages: prev.portfolioImages.filter((_, i) => i !== idx) }))}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80"
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(3)} className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700">
                  Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle disabled:opacity-50">
                  {loading ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
              <div className="mt-4 text-center">
                <button type="submit" disabled={loading} className="text-sm text-gray-500 hover:text-black transition font-medium">
                  Skip for now →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
