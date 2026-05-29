import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function CreatorCard({ creator, currentUser }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const images = creator.portfolioImages || [];

  useEffect(() => {
    let interval;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      setImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const handleConnect = async (e) => {
    e.stopPropagation();
    try {
      const connectionRef = doc(db, 'connections', `${currentUser.uid}_${creator.id}`);
      await setDoc(connectionRef, {
        userId: currentUser.uid,
        creatorId: creator.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      navigate(`/connections`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => navigate(`/profile/${creator.id}`)}
      className="group relative rounded-3xl overflow-hidden bg-gray-900 aspect-[4/5] cursor-pointer shadow-xl border border-white/10"
    >
      {/* Image Gallery / Preview */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={imageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: images[imageIndex]
                ? `url(${images[imageIndex]})`
                : 'linear-gradient(to bottom, #1f2937, #111827)'
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      {/* Progress Indicators (on hover) */}
      {images.length > 1 && isHovered && (
        <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
          {images.map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/20"
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: idx === imageIndex ? '100%' : idx < imageIndex ? '100%' : '0%' }}
                transition={{ duration: idx === imageIndex ? 1.5 : 0.3, ease: "linear" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Creator Info */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
        <motion.div
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <h3 className="text-xl font-bold text-white mb-0.5">{creator.displayName}</h3>
          <p className="text-sm text-gray-300 mb-3">{creator.role}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {creator.location && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/10">
                {creator.location}
              </span>
            )}
            {creator.specialties?.slice(0, 1).map(s => (
              <span key={s} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white border border-white/10">
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Actions - Slide up on hover */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: isHovered ? 0 : 100 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="grid grid-cols-2 gap-2 mt-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${creator.id}`);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold backdrop-blur-md text-white border border-white/20 transition-colors"
            >
              View Profile
            </button>
            <button
              onClick={handleConnect}
              className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-gray-200 text-xs font-bold shadow-lg transition-colors"
            >
              Connect
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Subtle Border Glow on Hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 border-2 border-white/30 rounded-3xl pointer-events-none"
      />
    </motion.div>
  );
}
