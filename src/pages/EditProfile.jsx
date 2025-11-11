import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { uploadMultipleImages } from '../utils/cloudinary';
import posthog from '../config/posthog';

export default function EditProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  const [profileData, setProfileData] = useState({
    role: '',
    bio: '',
    location: '',
    gear: [],
    specialties: [],
    photographyStyles: [],
    skillLevel: '',
    availability: true,
    lookingFor: [],
    portfolioImages: [],
    instagram: '',
    website: '',
    yearsExperience: ''
  });

  const [customGear, setCustomGear] = useState('');

  const roles = ['Photographer', 'Videographer', 'Cinematographer', 'Gaffer', 'Editor', 'Colorist', 'Producer', 'Director', 'Sound Designer', 'Art Director'];
  
  const gearOptions = [
    // Sony Cameras
    'Sony A7SIII', 'Sony A7IV', 'Sony A7RV', 'Sony A7C', 'Sony FX3', 'Sony FX6', 'Sony FX9',
    // Canon Cameras
    'Canon R5', 'Canon R6', 'Canon R3', 'Canon C70', 'Canon C300', 'Canon C500', 'Canon 5D Mark IV',
    // RED Cameras
    'RED Komodo', 'RED Raptor', 'RED V-Raptor',
    // ARRI Cameras
    'ARRI Alexa', 'ARRI Alexa Mini', 'ARRI Alexa 35',
    // Fujifilm
    'Fuji X-T5', 'Fuji X-H2S', 'Fuji X-T4', 'Fuji GFX 100',
    // Nikon
    'Nikon Z9', 'Nikon Z8', 'Nikon Z6 III', 'Nikon D850',
    // Blackmagic
    'Blackmagic Pocket 6K', 'Blackmagic Pocket 4K', 'Blackmagic Ursa',
    // Panasonic
    'Panasonic GH6', 'Panasonic GH5', 'Panasonic S5', 'Panasonic S1H',
    // DJI (Drones & Gimbals)
    'DJI Ronin', 'DJI RS3', 'DJI RS4', 'DJI Mavic 3', 'DJI Mini 4 Pro', 'DJI Inspire',
    // Lenses
    '24-70mm f/2.8', '70-200mm f/2.8', '85mm f/1.4', '50mm f/1.4', '35mm f/1.4', '16-35mm f/2.8',
    // Lighting
    'Aputure 600D', 'Aputure 300X', 'Godox VL300', 'Profoto B10',
    // Audio
    'Rode NTG5', 'Sennheiser MKH 416', 'Zoom F6'
  ];
  
  const specialtyOptions = ['Wedding', 'Portrait', 'Commercial', 'Street', 'Landscape', 'Fashion', 'Events', 'Documentary', 'Music Video', 'Corporate', 'Real Estate', 'Product', 'Food', 'Automotive', 'Sports'];
  
  const photographyStyleOptions = ['Cinematic', 'Editorial', 'Lifestyle', 'Fine Art', 'Reportage', 'Conceptual', 'Minimalist', 'Dramatic', 'Natural Light', 'Studio', 'Urban', 'Nature', 'Abstract', 'Vintage', 'Modern'];
  
  const skillLevelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Expert'];
  
  const lookingForOptions = ['Collaborators', 'Paid Work', 'Creative Projects', 'Learning', 'Networking', 'Crew Members', 'Mentorship', 'Portfolio Building'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileData(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleArrayToggle = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field].filter(item => item !== value)
        : [...(prev[field] || []), value]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    setError('');

    try {
      const remainingSlots = 6 - (profileData.portfolioImages?.length || 0);
      const filesToUpload = files.slice(0, remainingSlots);
      
      // Upload with NSFW detection
      const result = await uploadMultipleImages(filesToUpload, true);
      
      if (result.rejected > 0) {
        setError(`${result.rejected} image(s) rejected due to inappropriate content. Only safe images were uploaded.`);
      }
      
      setProfileData(prev => ({
        ...prev,
        portfolioImages: [...(prev.portfolioImages || []), ...result.urls].slice(0, 6)
      }));
      
      // Track image upload event
      posthog.capture('image_uploaded', {
        image_count: result.urls.length,
        total_images: (profileData.portfolioImages?.length || 0) + result.urls.length,
        rejected_count: result.rejected || 0,
        context: 'edit_profile'
      });
    } catch (err) {
      setError('Failed to upload images');
      console.error(err);
      // Track upload error
      posthog.capture('image_upload_failed', {
        context: 'edit_profile',
        error: err.message
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setProfileData(prev => ({
      ...prev,
      portfolioImages: prev.portfolioImages.filter((_, i) => i !== index)
    }));
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

      // Track profile update event
      posthog.capture('profile_updated', {
        role: profileData.role,
        gear_count: profileData.gear?.length || 0,
        specialties_count: profileData.specialties?.length || 0,
        photography_styles_count: profileData.photographyStyles?.length || 0,
        portfolio_images_count: profileData.portfolioImages?.length || 0,
        skill_level: profileData.skillLevel,
        looking_for_count: profileData.lookingFor?.length || 0,
        has_bio: !!profileData.bio,
        has_location: !!profileData.location,
        has_instagram: !!profileData.instagram,
        has_website: !!profileData.website,
        years_experience: profileData.yearsExperience
      });

      navigate('/profile');
    } catch (err) {
      setError('Failed to save profile');
      console.error(err);
      // Track profile update error
      posthog.capture('profile_update_failed', {
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-white/70">Keep your creator profile up to date</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Primary Role *</label>
              <select
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Bio *</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20 resize-none"
                rows="4"
                placeholder="Tell other creators about your experience and style..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Location *</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="City, State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={profileData.yearsExperience}
                  onChange={(e) => setProfileData({ ...profileData, yearsExperience: e.target.value })}
                  className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="0"
                  min="0"
                  max="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Instagram Handle</label>
                <input
                  type="text"
                  value={profileData.instagram}
                  onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                  className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Website</label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  className="w-full rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="https://yoursite.com"
                />
              </div>
            </div>
          </div>

          {/* Skill Level */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-4">Skill Level</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {skillLevelOptions.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setProfileData({ ...profileData, skillLevel: level })}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    profileData.skillLevel === level
                      ? 'border-white bg-white text-black'
                      : 'border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Gear */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-4">Camera Gear</h2>
            <p className="text-sm text-white/60 mb-4">Select all that you own or work with (60+ options + custom)</p>
            
            {/* Selected Gear Display */}
            {profileData.gear && profileData.gear.length > 0 && (
              <div className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs text-white/60 mb-2">Selected ({profileData.gear.length}):</div>
                <div className="flex flex-wrap gap-2">
                  {profileData.gear.map((gear) => (
                    <span
                      key={gear}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 text-xs"
                    >
                      {gear}
                      <button
                        type="button"
                        onClick={() => handleArrayToggle('gear', gear)}
                        className="hover:text-red-400 transition"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Gear Options Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {gearOptions.map((gear) => (
                <button
                  key={gear}
                  type="button"
                  onClick={() => handleArrayToggle('gear', gear)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    profileData.gear?.includes(gear)
                      ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-400'
                      : 'border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {gear}
                </button>
              ))}
            </div>

            {/* Custom Gear Input */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <label className="block text-sm text-white/70 mb-2">Add Custom Gear</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customGear}
                  onChange={(e) => setCustomGear(e.target.value)}
                  placeholder="e.g., Leica M10, Sigma 24-70mm, etc."
                  className="flex-1 rounded-2xl bg-white/5 border border-white/15 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customGear.trim() && !profileData.gear?.includes(customGear.trim())) {
                        setProfileData(prev => ({
                          ...prev,
                          gear: [...(prev.gear || []), customGear.trim()]
                        }));
                        setCustomGear('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGear.trim() && !profileData.gear?.includes(customGear.trim())) {
                      setProfileData(prev => ({
                        ...prev,
                        gear: [...(prev.gear || []), customGear.trim()]
                      }));
                      setCustomGear('');
                    }
                  }}
                  disabled={!customGear.trim()}
                  className="rounded-2xl bg-white/10 border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-white/50 mt-1">Press Enter or click Add to include custom gear</p>
            </div>
          </div>

          {/* Specialties */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-4">Specialties</h2>
            <p className="text-sm text-white/60 mb-4">What types of work do you do?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {specialtyOptions.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => handleArrayToggle('specialties', specialty)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    profileData.specialties?.includes(specialty)
                      ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-400'
                      : 'border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Photography Styles */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-4">Photography Styles</h2>
            <p className="text-sm text-white/60 mb-4">What styles do you prefer or specialize in?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {photographyStyleOptions.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleArrayToggle('photographyStyles', style)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    profileData.photographyStyles?.includes(style)
                      ? 'border-purple-400/50 bg-purple-400/10 text-purple-400'
                      : 'border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-4">What Are You Looking For?</h2>
            <p className="text-sm text-white/60 mb-4">Select all that apply</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {lookingForOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleArrayToggle('lookingFor', option)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    profileData.lookingFor?.includes(option)
                      ? 'border-blue-400/50 bg-blue-400/10 text-blue-400'
                      : 'border-white/15 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Availability</h2>
                <p className="text-sm text-white/60 mt-1">Show that you're available for work</p>
              </div>
              <button
                type="button"
                onClick={() => setProfileData({ ...profileData, availability: !profileData.availability })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                  profileData.availability ? 'bg-emerald-400' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                    profileData.availability ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Portfolio Images */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-xl font-semibold mb-4">Portfolio (up to 6 images)</h2>
            
            {profileData.portfolioImages && profileData.portfolioImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {profileData.portfolioImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={url} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80 backdrop-blur flex items-center justify-center text-white hover:bg-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(!profileData.portfolioImages || profileData.portfolioImages.length < 6) && (
              <label className="block w-full rounded-2xl border-2 border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-white/40 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImages}
                />
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-sm text-white/70 font-medium">
                  {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {profileData.portfolioImages?.length || 0}/6 images • Max 10MB each
                </div>
              </label>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="flex-1 rounded-2xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

