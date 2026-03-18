import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { uploadMultipleImages } from '../utils/cloudinary';

export default function EditProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [profileData, setProfileData] = useState({
    role: '', bio: '', location: '', gear: [], specialties: [],
    photographyStyles: [], skillLevel: '', availability: true,
    lookingFor: [], portfolioImages: [], instagram: '', website: '', yearsExperience: '',
    isVerifiedPro: false, verificationStatus: 'none', // none, pending, verified, rejected
    offersTraining: false, trainingType: 'online', // online, in-person, both
    trainingPrice: '', trainingDuration: '', trainingDescription: ''
  });
  const [customGear, setCustomGear] = useState('');

  const roles = ['Photographer', 'Videographer', 'Cinematographer', 'Gaffer', 'Editor', 'Colorist', 'Producer', 'Director', 'Sound Designer', 'Art Director'];
  const gearOptions = [
    'Sony A7SIII', 'Sony A7IV', 'Sony A7RV', 'Sony A7C', 'Sony FX3', 'Sony FX6', 'Sony FX9',
    'Canon R5', 'Canon R6', 'Canon R3', 'Canon C70', 'Canon C300', 'Canon C500', 'Canon 5D Mark IV',
    'RED Komodo', 'RED Raptor', 'RED V-Raptor',
    'ARRI Alexa', 'ARRI Alexa Mini', 'ARRI Alexa 35',
    'Fuji X-T5', 'Fuji X-H2S', 'Fuji X-T4', 'Fuji GFX 100',
    'Nikon Z9', 'Nikon Z8', 'Nikon Z6 III', 'Nikon D850',
    'Blackmagic Pocket 6K', 'Blackmagic Pocket 4K', 'Blackmagic Ursa',
    'Panasonic GH6', 'Panasonic GH5', 'Panasonic S5', 'Panasonic S1H',
    'DJI Ronin', 'DJI RS3', 'DJI RS4', 'DJI Mavic 3', 'DJI Mini 4 Pro', 'DJI Inspire',
    '24-70mm f/2.8', '70-200mm f/2.8', '85mm f/1.4', '50mm f/1.4', '35mm f/1.4', '16-35mm f/2.8',
    'Aputure 600D', 'Aputure 300X', 'Godox VL300', 'Profoto B10',
    'Rode NTG5', 'Sennheiser MKH 416', 'Zoom F6'
  ];
  const specialtyOptions = ['Wedding', 'Portrait', 'Commercial', 'Street', 'Landscape', 'Fashion', 'Events', 'Documentary', 'Music Video', 'Corporate', 'Real Estate', 'Product', 'Food', 'Automotive', 'Sports'];
  const photographyStyleOptions = ['Cinematic', 'Editorial', 'Lifestyle', 'Fine Art', 'Reportage', 'Conceptual', 'Minimalist', 'Dramatic', 'Natural Light', 'Studio', 'Urban', 'Nature', 'Abstract', 'Vintage', 'Modern'];
  const skillLevelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Expert'];
  const lookingForOptions = ['Collaborators', 'Paid Work', 'Creative Projects', 'Learning', 'Networking', 'Crew Members', 'Mentorship', 'Portfolio Building'];

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProfileData(prev => ({ ...prev, ...docSnap.data() }));
    } catch (error) { console.error('Error fetching profile:', error); }
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
    setUploadingImages(true); setError('');
    try {
      const remainingSlots = 6 - (profileData.portfolioImages?.length || 0);
      const filesToUpload = files.slice(0, remainingSlots);
      const result = await uploadMultipleImages(filesToUpload, true);
      if (result.rejected > 0) setError(`${result.rejected} image(s) rejected due to inappropriate content. Only safe images were uploaded.`);
      setProfileData(prev => ({ ...prev, portfolioImages: [...(prev.portfolioImages || []), ...result.urls].slice(0, 6) }));
    } catch (err) { setError('Failed to upload images'); console.error(err); }
    finally { setUploadingImages(false); }
  };

  const removeImage = (index) => {
    setProfileData(prev => ({ ...prev, portfolioImages: prev.portfolioImages.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    if (!profileData.role) { setError('Please select a primary role'); setLoading(false); return; }
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { ...profileData, profileComplete: true, updatedAt: new Date().toISOString() });
      navigate('/profile');
    } catch (err) { setError('Failed to save profile'); console.error(err); }
    finally { setLoading(false); }
  };

  const selectedBtnClass = 'border-black bg-black text-white';
  const unselectedBtnClass = 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 text-gray-700';

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-black">Edit Profile</h1>
            <p className="text-gray-500 font-medium">Keep your creator profile up to date</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-6 shadow-card">
              <h2 className="text-xl font-semibold text-black">Basic Information</h2>
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">Primary Role *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <button key={role} type="button" onClick={() => setProfileData({ ...profileData, role })}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${profileData.role === role ? selectedBtnClass : unselectedBtnClass}`}
                    >{role}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">Bio *</label>
                <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all resize-none text-gray-900"
                  rows="4" placeholder="Tell other creators about your experience and style..." required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Location *</label>
                  <input type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                    placeholder="City, State" required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Years of Experience</label>
                  <input type="number" value={profileData.yearsExperience} onChange={(e) => setProfileData({ ...profileData, yearsExperience: e.target.value })}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                    placeholder="0" min="0" max="50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Instagram Handle</label>
                  <input type="text" value={profileData.instagram} onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">Website</label>
                  <input type="url" value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
            </div>

            {/* Skill Level */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-black">Skill Level</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {skillLevelOptions.map((level) => (
                  <button key={level} type="button" onClick={() => setProfileData({ ...profileData, skillLevel: level })}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${profileData.skillLevel === level ? selectedBtnClass : unselectedBtnClass}`}
                  >{level}</button>
                ))}
              </div>
            </div>

            {/* Camera Gear */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-black">Camera Gear</h2>
              <p className="text-sm text-gray-400 mb-4">Select all that you own or work with (60+ options + custom)</p>
              {profileData.gear && profileData.gear.length > 0 && (
                <div className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="text-xs text-gray-400 mb-2">Selected ({profileData.gear.length}):</div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.gear.map((gear) => (
                      <span key={gear} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 text-xs">
                        {gear}
                        <button type="button" onClick={() => handleArrayToggle('gear', gear)} className="hover:text-red-500 transition">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {gearOptions.map((gear) => (
                  <button key={gear} type="button" onClick={() => handleArrayToggle('gear', gear)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${profileData.gear?.includes(gear) ? selectedBtnClass : unselectedBtnClass}`}
                  >{gear}</button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="block text-sm text-gray-600 mb-2 font-medium">Add Custom Gear</label>
                <div className="flex gap-2">
                  <input type="text" value={customGear} onChange={(e) => setCustomGear(e.target.value)}
                    placeholder="e.g., Leica M10, Sigma 24-70mm, etc."
                    className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-2 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customGear.trim() && !profileData.gear?.includes(customGear.trim())) {
                          setProfileData(prev => ({ ...prev, gear: [...(prev.gear || []), customGear.trim()] }));
                          setCustomGear('');
                        }
                      }
                    }}
                  />
                  <button type="button" onClick={() => {
                    if (customGear.trim() && !profileData.gear?.includes(customGear.trim())) {
                      setProfileData(prev => ({ ...prev, gear: [...(prev.gear || []), customGear.trim()] }));
                      setCustomGear('');
                    }
                  }} disabled={!customGear.trim()}
                    className="rounded-xl bg-gray-100 border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                  >Add</button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Press Enter or click Add to include custom gear</p>
              </div>
            </div>

            {/* Specialties */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-black">Specialties</h2>
              <p className="text-sm text-gray-400 mb-4">What types of work do you do?</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specialtyOptions.map((specialty) => (
                  <button key={specialty} type="button" onClick={() => handleArrayToggle('specialties', specialty)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${profileData.specialties?.includes(specialty) ? selectedBtnClass : unselectedBtnClass}`}
                  >{specialty}</button>
                ))}
              </div>
            </div>

            {/* Photography Styles */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-black">Photography Styles</h2>
              <p className="text-sm text-gray-400 mb-4">What styles do you prefer or specialize in?</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {photographyStyleOptions.map((style) => (
                  <button key={style} type="button" onClick={() => handleArrayToggle('photographyStyles', style)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${profileData.photographyStyles?.includes(style) ? selectedBtnClass : unselectedBtnClass}`}
                  >{style}</button>
                ))}
              </div>
            </div>

            {/* Looking For */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-black">What Are You Looking For?</h2>
              <p className="text-sm text-gray-400 mb-4">Select all that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {lookingForOptions.map((option) => (
                  <button key={option} type="button" onClick={() => handleArrayToggle('lookingFor', option)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${profileData.lookingFor?.includes(option) ? selectedBtnClass : unselectedBtnClass}`}
                  >{option}</button>
                ))}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-black">Availability</h2>
                  <p className="text-sm text-gray-400 mt-1">Show that you're available for work</p>
                </div>
                <button type="button" onClick={() => setProfileData({ ...profileData, availability: !profileData.availability })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${profileData.availability ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition shadow ${profileData.availability ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Portfolio Images */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <h2 className="text-xl font-semibold mb-4 text-black">Portfolio (up to 6 images)</h2>
              {profileData.portfolioImages && profileData.portfolioImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {profileData.portfolioImages.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                      <img src={url} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80 backdrop-blur flex items-center justify-center text-white hover:bg-red-500 transition opacity-0 group-hover:opacity-100"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
              {(!profileData.portfolioImages || profileData.portfolioImages.length < 6) && (
                <label className="block w-full rounded-xl border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-gray-400 transition">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImages} />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{uploadingImages ? 'Uploading...' : 'Click to upload images'}</div>
                  <div className="text-xs text-gray-400 mt-1">{profileData.portfolioImages?.length || 0}/6 images • Max 10MB each</div>
                </label>
              )}
            </div>

            {/* Verified Professional Status */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-black">Verified Professional</h2>
                  <p className="text-sm text-gray-400 mt-1">Get a verified badge on your profile</p>
                </div>
                {profileData.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    Verified
                  </span>
                ) : profileData.verificationStatus === 'pending' ? (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold">
                    Pending Review
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setProfileData({ ...profileData, verificationStatus: 'pending' })}
                    className="rounded-xl border border-blue-600 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition"
                  >
                    Apply for Verification
                  </button>
                )}
              </div>
              {profileData.verificationStatus === 'none' && (
                <p className="text-xs text-gray-500 leading-relaxed">
                  Verification requires a complete profile, portfolio, and website/Instagram. Our team manually reviews applications to distinguish industry professionals from enthusiasts.
                </p>
              )}
            </div>

            {/* Mentorship & Courses */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-black">Mentorship & Courses</h2>
                  <p className="text-sm text-gray-400 mt-1">Teach basics or advanced techniques to other creators</p>
                </div>
                <button type="button" onClick={() => setProfileData({ ...profileData, offersTraining: !profileData.offersTraining })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${profileData.offersTraining ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition shadow ${profileData.offersTraining ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {profileData.offersTraining && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">Training Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['online', 'in-person', 'both'].map((type) => (
                        <button key={type} type="button" onClick={() => setProfileData({ ...profileData, trainingType: type })}
                          className={`rounded-xl border px-3 py-2 text-xs font-medium capitalize transition ${profileData.trainingType === type ? selectedBtnClass : unselectedBtnClass}`}
                        >{type.replace('-', ' ')}</button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2 font-medium">Price (e.g., $100/session)</label>
                      <input type="text" value={profileData.trainingPrice} onChange={(e) => setProfileData({ ...profileData, trainingPrice: e.target.value })}
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                        placeholder="Set your rate"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2 font-medium">Duration (e.g., 2 hours, 4 weeks)</label>
                      <input type="text" value={profileData.trainingDuration} onChange={(e) => setProfileData({ ...profileData, trainingDuration: e.target.value })}
                        className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all text-gray-900"
                        placeholder="Session or course length"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-medium">Course/Mentorship Description</label>
                    <textarea value={profileData.trainingDescription} onChange={(e) => setProfileData({ ...profileData, trainingDescription: e.target.value })}
                      className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all resize-none text-gray-900"
                      rows="3" placeholder="Describe what you teach, your methodology, or what beginners will learn..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/profile')}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700"
              >Cancel</button>
              <button type="submit" disabled={loading || uploadingImages}
                className="flex-1 rounded-xl bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle disabled:opacity-50"
              >{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
