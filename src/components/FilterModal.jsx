import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    roles: [], gear: [], specialties: [], skillLevel: [], availability: null
  });

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters || { 
        roles: [], gear: [], specialties: [], skillLevel: [], availability: null,
        verifiedOnly: false, offersTraining: false, trainingType: 'all'
      });
    }
  }, [isOpen, filters]);

  const handleToggle = (category, value) => {
    setLocalFilters(prev => {
      const currentArray = prev[category] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [category]: newArray };
    });
  };

  const handleBooleanToggle = (field) => {
    setLocalFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleValueChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleAvailabilityToggle = (value) => {
    setLocalFilters(prev => ({ ...prev, availability: prev.availability === value ? null : value }));
  };

  const handleClear = () => {
    const cleared = clearFilters();
    setLocalFilters(cleared);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    if (onApply) onApply(localFilters);
    onClose();
  };

  const activeCount = countActiveFilters(localFilters);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-900 border border-white/10 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden rounded-[32px] pointer-events-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-8 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Filters
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Refine your creator search</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-10 custom-scrollbar">
                {/* Role Filter */}
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-gray-500">Professional Role</h3>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleToggle('roles', role)}
                        className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${localFilters.roles?.includes(role)
                            ? 'border-white bg-white text-black shadow-lg shadow-white/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                          }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Gear Filter */}
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-gray-500">Camera & Gear</h3>
                  <div className="flex flex-wrap gap-2">
                    {gearOptions.map((gear) => (
                      <button
                        key={gear}
                        type="button"
                        onClick={() => handleToggle('gear', gear)}
                        className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${localFilters.gear?.includes(gear)
                            ? 'border-white bg-white text-black shadow-lg shadow-white/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                          }`}
                      >
                        {gear}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Specialties Filter */}
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-gray-500">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map((specialty) => (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => handleToggle('specialties', specialty)}
                        className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${localFilters.specialties?.includes(specialty)
                            ? 'border-white bg-white text-black shadow-lg shadow-white/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                          }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Skill Level Filter */}
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-gray-500">Skill Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillLevelOptions.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleToggle('skillLevel', level)}
                        className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${localFilters.skillLevel?.includes(level)
                            ? 'border-white bg-white text-black shadow-lg shadow-white/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Verified Status */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Verified Status</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-blue-400">Pro Only</span>
                      <button
                        type="button"
                        onClick={() => handleBooleanToggle('verifiedOnly')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${localFilters.verifiedOnly ? 'bg-blue-500' : 'bg-white/10'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${localFilters.verifiedOnly ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">Show only creators verified by Lenzli as industry professionals.</p>
                </section>

                {/* Mentorship & Learning */}
                <section className="p-6 rounded-[24px] bg-emerald-500/5 border border-emerald-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Mentorship & Learning</h3>
                    <button
                      type="button"
                      onClick={() => handleBooleanToggle('offersTraining')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${localFilters.offersTraining ? 'bg-emerald-500' : 'bg-white/10'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${localFilters.offersTraining ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  {localFilters.offersTraining && (
                    <div className="space-y-4 animate-fade-in">
                      <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-wider">Training Format</p>
                      <div className="flex gap-2">
                        {['all', 'online', 'in-person'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleValueChange('trainingType', type)}
                            className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold capitalize transition-all duration-300 ${localFilters.trainingType === type
                                ? 'border-emerald-500 bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                : 'border-white/10 bg-white/5 text-gray-400'
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {!localFilters.offersTraining && (
                    <p className="text-[10px] text-gray-500 font-medium">Find professionals offering basic photography courses or advanced mentorship.</p>
                  )}
                </section>

                {/* Availability Filter */}
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-gray-500">Availability</h3>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAvailabilityToggle(true)}
                      className={`flex-1 rounded-2xl border px-6 py-4 font-bold transition-all duration-300 ${localFilters.availability === true
                          ? 'border-white bg-white text-black shadow-lg shadow-white/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                        }`}
                    >
                      Available Now
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAvailabilityToggle(false)}
                      className={`flex-1 rounded-2xl border px-6 py-4 font-bold transition-all duration-300 ${localFilters.availability === false
                          ? 'border-white bg-white text-black shadow-lg shadow-white/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                        }`}
                    >
                      Busy / On Set
                    </button>
                  </div>
                </section>
              </div>

              {/* Footer Actions */}
              <div className="p-8 pt-4 bg-gray-900/50 backdrop-blur-md border-t border-white/5 flex gap-4">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={activeCount === 0}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-black hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white uppercase tracking-wider"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 rounded-2xl bg-white text-black px-8 py-4 text-sm font-black hover:bg-gray-200 transition-all shadow-xl uppercase tracking-wider"
                >
                  Apply {activeCount > 0 && `(${activeCount})`}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
