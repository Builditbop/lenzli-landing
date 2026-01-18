import React, { useState, useEffect } from 'react';
import { hasActiveFilters, countActiveFilters, clearFilters } from '../utils/search';

const roles = ['Photographer', 'Videographer', 'Cinematographer', 'Gaffer', 'Editor', 'Colorist', 'Producer', 'Director', 'Sound Designer', 'Art Director'];

const gearOptions = [
  'Sony A7SIII', 'Sony A7IV', 'Sony A7RV', 'Sony FX3', 'Canon R5', 'Canon R6', 'Canon C70', 'Canon C300',
  'RED Komodo', 'RED Raptor', 'ARRI Alexa', 'Fuji X-T5', 'Fuji X-H2S', 'Nikon Z9', 'Nikon Z8',
  'Blackmagic Pocket 6K', 'Panasonic GH6', 'DJI Ronin', 'DJI RS3', 'DJI Mavic 3',
  '24-70mm f/2.8', '70-200mm f/2.8', '85mm f/1.4', '50mm f/1.4'
];

const specialtyOptions = ['Wedding', 'Portrait', 'Commercial', 'Street', 'Landscape', 'Fashion', 'Events', 'Documentary', 'Music Video', 'Corporate', 'Real Estate', 'Product'];

const skillLevelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Expert'];

export default function FilterModal({ isOpen, onClose, filters, onFiltersChange, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters || {
    roles: [],
    gear: [],
    specialties: [],
    skillLevel: [],
    availability: null
  });

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters || {
        roles: [],
        gear: [],
        specialties: [],
        skillLevel: [],
        availability: null
      });
    }
  }, [isOpen, filters]);

  const handleToggle = (category, value) => {
    setLocalFilters(prev => {
      const currentArray = prev[category] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [category]: newArray
      };
    });
  };

  const handleAvailabilityToggle = (value) => {
    setLocalFilters(prev => ({
      ...prev,
      availability: prev.availability === value ? null : value
    }));
  };

  const handleClear = () => {
    const cleared = clearFilters();
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    if (onApply) {
      onApply(localFilters);
    }
    onClose();
  };

  if (!isOpen) return null;

  const activeCount = countActiveFilters(localFilters);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl border border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black border-b border-white/10 p-6 flex items-center justify-between backdrop-blur-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Filters {activeCount > 0 && `(${activeCount})`}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Role Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white/90">Role</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleToggle('roles', role)}
                  className={`rounded-xl border-2 px-3 py-2 text-xs font-medium transition ${
                    localFilters.roles?.includes(role)
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Gear Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white/90">Gear</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {gearOptions.map((gear) => (
                <button
                  key={gear}
                  type="button"
                  onClick={() => handleToggle('gear', gear)}
                  className={`rounded-xl border-2 px-3 py-2 text-xs font-medium transition ${
                    localFilters.gear?.includes(gear)
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {gear}
                </button>
              ))}
            </div>
          </div>

          {/* Specialties Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white/90">Specialties</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {specialtyOptions.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => handleToggle('specialties', specialty)}
                  className={`rounded-xl border-2 px-3 py-2 text-xs font-medium transition ${
                    localFilters.specialties?.includes(specialty)
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Level Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white/90">Skill Level</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {skillLevelOptions.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleToggle('skillLevel', level)}
                  className={`rounded-xl border-2 px-3 py-2 text-xs font-medium transition ${
                    localFilters.skillLevel?.includes(level)
                      ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white/90">Availability</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAvailabilityToggle(true)}
                className={`flex-1 rounded-xl border-2 px-4 py-3 font-medium transition ${
                  localFilters.availability === true
                    ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                Available
              </button>
              <button
                type="button"
                onClick={() => handleAvailabilityToggle(false)}
                className={`flex-1 rounded-xl border-2 px-4 py-3 font-medium transition ${
                  localFilters.availability === false
                    ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                Unavailable
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t border-white/10 p-6 flex gap-3 backdrop-blur-sm">
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasActiveFilters(localFilters)}
            className="flex-1 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-black px-6 py-3 text-sm font-semibold hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg hover:shadow-emerald-400/20"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

