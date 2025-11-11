import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { uploadMultipleImages } from '../utils/cloudinary';
import posthog from '../config/posthog';

export default function ProfileSetup() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customGear, setCustomGear] = useState('');

  const [profileData, setProfileData] = useState({
    role: '',
    bio: '',
    location: '',
    gear: [],
    specialties: [],
    photographyStyles: [],
    skillLevel: '',
    lookingFor: [],
    portfolioImages: [],
    availability: true
  });

  const roles = ['Photographer', 'Videographer', 'Cinematographer', 'Gaffer', 'Editor', 'Colorist', 'Producer', 'Director', 'Sound Designer', 'Art Director'];
  
  const gearOptions = [
    'Sony A7SIII', 'Sony A7IV', 'Sony A7RV', 'Sony FX3', 'Canon R5', 'Canon R6', 'Canon C70', 'Canon C300', 
    'RED Komodo', 'RED Raptor', 'ARRI Alexa', 'Fuji X-T5', 'Fuji X-H2S', 'Nikon Z9', 'Nikon Z8', 
    'Blackmagic Pocket 6K', 'Panasonic GH6', 'DJI Ronin', 'DJI RS3', 'DJI Mavic 3',
    '24-70mm f/2.8', '70-200mm f/2.8', '85mm f/1.4', '50mm f/1.4'
  ];
  
  const specialtyOptions = ['Wedding', 'Portrait', 'Commercial', 'Street', 'Landscape', 'Fashion', 'Events', 'Documentary', 'Music Video', 'Corporate', 'Real Estate', 'Product'];
  
  const photographyStyleOptions = ['Cinematic', 'Editorial', 'Lifestyle', 'Fine Art', 'Natural Light', 'Studio', 'Urban', 'Minimalist', 'Dramatic'];
  
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

    setLoading(true);
    setError('');

    try {
      const filesToUpload = files.slice(0, 6 - profileData.portfolioImages.length);
      const urls = await uploadMultipleImages(filesToUpload);
      
      setProfileData(prev => ({
        ...prev,
        portfolioImages: [...prev.portfolioImages, ...urls].slice(0, 6)
      }));
      
      // Track image upload event
      posthog.capture('image_uploaded', {
        image_count: urls.length,
        total_images: profileData.portfolioImages.length + urls.length,
        context: 'profile_setup'
      });
    } catch (err) {
      setError('Failed to upload images');
      console.error(err);
      // Track upload error
      posthog.capture('image_upload_failed', {
        context: 'profile_setup',
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...profileData,
        profileComplete: true,
        updatedAt: new Date().toISOString()
      });

      // Track profile completion event
      posthog.capture('profile_completed', {
        role: profileData.role,
        gear_count: profileData.gear.length,
        specialties_count: profileData.specialties.length,
        photography_styles_count: profileData.photographyStyles.length,
        portfolio_images_count: profileData.portfolioImages.length,
        skill_level: profileData.skillLevel,
        looking_for_count: profileData.lookingFor.length,
        has_bio: !!profileData.bio,
        has_location: !!profileData.location
      });

      navigate('/discover');
    } catch (err) {
      setError('Failed to save profile');
      console.error(err);
      // Track profile completion error
      posthog.capture('profile_completion_failed', {
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !profileData.role) {
      setError('Please select a role');
      return;
    }
    if (step === 2 && (!profileData.bio || !profileData.location)) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-white/70">Step {step} of 4</p>
          <div className="mt-4 flex gap-2 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-16 rounded-full transition-colors ${
                  i <= step ? 'bg-white' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Role */}
        {step === 1 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-4">What's your role?</h2>
            <p className="text-white/70 mb-6">Choose your primary role</p>

            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setProfileData({ ...profileData, role })}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    profileData.role === role
                      ? 'border-white bg-white text-black'
                      : 'border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-6 rounded-2xl bg-white text-black px-4 py-3 text-sm font-medium hover:bg-white/90 transition"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Bio & Location */}
        {step === 2 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-4">Tell us about yourself</h2>
            <p className="text-white/70 mb-6">Share your story and location</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  rows="4"
                  placeholder="Tell other creators about your experience and style..."
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="City, State or Country"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 transition"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex-1 rounded-2xl bg-white text-black px-4 py-3 text-sm font-medium hover:bg-white/90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Gear & Specialties */}
        {step === 3 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-4">Your gear & style</h2>
            <p className="text-white/70 mb-6">Select all that apply (you can add more later!)</p>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Camera Gear</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {gearOptions.map((gear) => (
                    <button
                      key={gear}
                      type="button"
                      onClick={() => handleArrayToggle('gear', gear)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        profileData.gear.includes(gear)
                          ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-400'
                          : 'border-white/15 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {gear}
                    </button>
                  ))}
                </div>
                
                {/* Custom Gear Input */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customGear}
                      onChange={(e) => setCustomGear(e.target.value)}
                      placeholder="Add custom gear (e.g., Leica M10)"
                      className="flex-1 rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-white/20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (customGear.trim() && !profileData.gear.includes(customGear.trim())) {
                            setProfileData(prev => ({
                              ...prev,
                              gear: [...prev.gear, customGear.trim()]
                            }));
                            setCustomGear('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customGear.trim() && !profileData.gear.includes(customGear.trim())) {
                          setProfileData(prev => ({
                            ...prev,
                            gear: [...prev.gear, customGear.trim()]
                          }));
                          setCustomGear('');
                        }
                      }}
                      disabled={!customGear.trim()}
                      className="rounded-xl bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/20 transition disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                {/* Show selected gear */}
                {profileData.gear.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {profileData.gear.map((gear) => (
                      <span key={gear} className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300">
                        {gear}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Specialties</h3>
                <div className="grid grid-cols-2 gap-2">
                  {specialtyOptions.map((specialty) => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => handleArrayToggle('specialties', specialty)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        profileData.specialties.includes(specialty)
                          ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-400'
                          : 'border-white/15 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-2xl bg-white text-black px-4 py-3 text-sm font-medium hover:bg-white/90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Portfolio Images */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold mb-4">Upload your work</h2>
            <p className="text-white/70 mb-6">Add up to 6 images that showcase your style</p>

            <div>
              <label className="block w-full rounded-2xl border-2 border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-white/40 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={loading || profileData.portfolioImages.length >= 6}
                />
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-sm text-white/70 font-medium">
                  {loading ? 'Uploading...' : 'Click to upload images'}
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {profileData.portfolioImages.length}/6 images • Optional
                </div>
              </label>

              {profileData.portfolioImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {profileData.portfolioImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={url} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProfileData(prev => ({
                          ...prev,
                          portfolioImages: prev.portfolioImages.filter((_, i) => i !== idx)
                        }))}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-2xl bg-white text-black px-4 py-3 text-sm font-medium hover:bg-white/90 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="submit"
                disabled={loading}
                className="text-sm text-white/60 hover:text-white"
              >
                Skip for now →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

