import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Navigation, X, Globe2, Map as MapIcon, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobeComponent from 'react-globe.gl';

export default function Globe() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [globeStyle, setGlobeStyle] = useState('satellite'); // 'satellite' or 'cartoon'
  const [countries, setCountries] = useState({ features: [] });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  
  const globeRef = useRef();

  // Fetch countries geojson for the cartoon style
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Generate realistic-looking scatter for the demo
          const lng = data.location?.lng || (Math.random() * 360 - 180);
          const lat = data.location?.lat || (Math.random() * 140 - 70); 
          
          usersData.push({
            id: doc.id,
            ...data,
            lng,
            lat,
          });
        });
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Error fetching users for globe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // AI Smart Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      setIsSearchingAI(false);
      return;
    }

    setIsSearchingAI(true);
    
    // Simulate an AI thinking delay and semantic fuzzy search
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => {
        const nameMatch = (user.displayName || '').toLowerCase().includes(query);
        const roleMatch = (user.role || '').toLowerCase().includes(query);
        const bioMatch = (user.bio || '').toLowerCase().includes(query);
        // Combine text matching to simulate AI semantic search
        return nameMatch || roleMatch || bioMatch;
      });
      
      setFilteredUsers(filtered);
      setIsSearchingAI(false);

      // Auto-zoom to the first result if we found any to make the AI feel "smart"
      if (filtered.length > 0 && globeRef.current) {
        globeRef.current.pointOfView({ lat: filtered[0].lat, lng: filtered[0].lng, altitude: 1.5 }, 1200);
      }
    }, 800); // 800ms "AI thinking" delay

    return () => clearTimeout(timer);
  }, [searchQuery, users]);

  useEffect(() => {
    // Check if the ref exists and has the method before trying to call it
    if (globeRef.current && typeof globeRef.current.globeMaterial === 'function') {
      if (globeStyle === 'cartoon') {
         const globeMaterial = globeRef.current.globeMaterial();
         if (globeMaterial) {
           globeMaterial.color.set('#e0f2fe'); // Tailwind sky-100
           globeMaterial.roughness = 1;
         }
      } else if (globeStyle === 'satellite') {
         const globeMaterial = globeRef.current.globeMaterial();
         if (globeMaterial) {
           globeMaterial.color.set('#ffffff');
           globeMaterial.roughness = 0.5;
         }
      }
    }
  }, [globeStyle, loading]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.controls().enableZoom = true;
    }
  }, [loading]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      globeRef.current.pointOfView({ lat: user.lat, lng: user.lng, altitude: 0.8 }, 1000);
    }
  };

  const handleReset = () => {
    setSelectedUser(null);
    setSearchQuery('');
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.pointOfView({ altitude: 2.5 }, 1000);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-50 flex flex-col font-sans overflow-hidden relative">
      
      {/* Header Overlay */}
      <div className="absolute top-20 left-6 z-10 pointer-events-none hidden md:block">
        <h1 className="text-4xl font-bold text-black tracking-tight drop-shadow-sm flex items-center gap-3">
          <MapPin className="text-black w-8 h-8" />
          Global Discover
        </h1>
        <p className="text-gray-600 mt-2 text-lg drop-shadow-sm font-medium">Spin the globe. Find creators.</p>
      </div>

      {/* AI Search Bar Overlay */}
      <div className="absolute top-20 right-6 left-6 md:left-auto md:w-96 z-10">
        <div className="relative w-full bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl transition-all overflow-hidden flex items-center h-[52px] group focus-within:border-black focus-within:ring-2 focus-within:ring-black/5 cursor-text">
          <div className="pl-4 pr-3 flex items-center justify-center pointer-events-none">
            {isSearchingAI ? (
              <Sparkles className="text-blue-500 animate-pulse" size={20} />
            ) : (
              <Search className="text-gray-400 group-focus-within:text-black transition-colors" size={20} />
            )}
          </div>
          
          <div className="relative flex-1 h-full flex items-center overflow-hidden">
            {/* Hidden native input to capture events on mobile/desktop naturally */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text"
              aria-label="AI Search"
            />
            
            {/* Placeholder */}
            {!searchQuery && (
              <div className="absolute left-0 text-gray-400 pointer-events-none whitespace-nowrap">
                AI Search: 'Wedding photographers'
              </div>
            )}

            {/* Fluid Text Render */}
            <div className="flex items-center whitespace-pre pointer-events-none text-black font-medium z-0 h-full">
              <AnimatePresence mode="popLayout">
                {searchQuery.split('').map((char, i) => (
                  <motion.span
                    key={`${i}-${char}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </AnimatePresence>
              
              {/* Smooth Caret inside focus-within */}
              <motion.div
                layout
                transition={{
                  layout: { type: "spring", stiffness: 700, damping: 30 },
                  opacity: { repeat: Infinity, duration: 0.8, ease: "easeInOut" }
                }}
                className="w-[2px] h-5 bg-blue-500 ml-[1px] rounded-full hidden group-focus-within:block"
                animate={{ opacity: [1, 0, 1] }}
              />
            </div>
          </div>

          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="pr-4 pl-2 text-gray-400 hover:text-black transition-colors z-20"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Results summary indicator */}
        <AnimatePresence>
          {searchQuery && !isSearchingAI && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-3 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-0"
            >
              <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                <Sparkles size={16} className="text-blue-500" />
                {filteredUsers.length === 0 
                  ? "I couldn't find anyone matching that description."
                  : `Found ${filteredUsers.length} creator${filteredUsers.length === 1 ? '' : 's'} matching your criteria.`
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-3">
        <div className="flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
          <button 
            onClick={() => setGlobeStyle('satellite')}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              globeStyle === 'satellite' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Satellite View"
          >
            <Globe2 size={20} />
          </button>
          <button 
            onClick={() => setGlobeStyle('cartoon')}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              globeStyle === 'cartoon' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Cartoon View"
          >
            <MapIcon size={20} />
          </button>
        </div>

        <button 
          onClick={handleReset}
          className="bg-white hover:bg-gray-100 border border-gray-200 p-3 rounded-full text-black shadow-lg transition-all flex items-center justify-center"
          title="Reset Map"
        >
          <Navigation size={24} />
        </button>
      </div>

      <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        )}
        
        {!loading && (
          <div className="absolute inset-0 z-0 bg-gray-50">
            <GlobeComponent
              ref={globeRef}
              // Toggle base textures based on style
              globeImageUrl={globeStyle === 'satellite' ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" : null}
              bumpImageUrl={globeStyle === 'satellite' ? "//unpkg.com/three-globe/example/img/earth-topology.png" : null}
              showAtmosphere={true}
              atmosphereColor={globeStyle === 'satellite' ? "lightskyblue" : "#ffffff"}
              atmosphereAltitude={0.15}
              backgroundColor="rgba(0,0,0,0)" // Transparent to see bg-gray-50
              
              // Vector Polygons for Cartoon style
              polygonsData={globeStyle === 'cartoon' ? countries.features : []}
              polygonAltitude={0.01}
              polygonCapColor={() => '#ffffff'} // White countries
              polygonSideColor={() => '#f3f4f6'}
              polygonStrokeColor={() => '#d1d5db'} // Gray borders
              
              // 3D Pins using HTML elements (Filtering active)
              htmlElementsData={filteredUsers}
              htmlElement={d => {
                const el = document.createElement('div');
                const photo = d.photoURL || `https://ui-avatars.com/api/?name=${d.displayName || 'U'}&background=000&color=fff`;
                el.innerHTML = `
                  <div style="
                    width: 32px; 
                    height: 32px; 
                    border-radius: 50%; 
                    border: 2px solid white; 
                    overflow: hidden; 
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    transition: transform 0.2s;
                    pointer-events: auto;
                    cursor: pointer;
                    background-color: #fff;
                  ">
                    <img src="${photo}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                `;
                el.onclick = () => handleUserClick(d);
                el.onmouseenter = () => { el.firstElementChild.style.transform = 'scale(1.2)'; };
                el.onmouseleave = () => { el.firstElementChild.style.transform = 'scale(1)'; };
                return el;
              }}
            />
          </div>
        )}

        {/* Interactive User Card Overlay */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-8 left-8 z-20 w-80 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-3 right-3 z-30 p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
              >
                <X size={16} />
              </button>
              
              <div className="h-40 relative">
                {selectedUser.portfolio && selectedUser.portfolio.length > 0 ? (
                  <img src={selectedUser.portfolio[0]} alt="Latest shot" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Camera size={40} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3">
                  <img 
                    src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${selectedUser.displayName || 'U'}&background=random`} 
                    alt={selectedUser.displayName}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-md bg-white"
                  />
                  <div className="flex-1 pb-1">
                    <h3 className="font-bold text-white text-lg leading-tight truncate">{selectedUser.displayName || 'Unknown'}</h3>
                    <p className="text-sm text-gray-200 font-medium truncate">{selectedUser.role || 'Photographer'}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {selectedUser.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{selectedUser.bio}</p>
                )}
                
                <div className="flex gap-3">
                  <Link 
                    to={`/profile/${selectedUser.id}`}
                    className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-black text-center text-sm font-semibold rounded-xl transition-all"
                  >
                    View Profile
                  </Link>
                  <Link 
                    to={`/messages?userId=${selectedUser.id}`}
                    className="flex-1 py-2.5 px-4 bg-black hover:bg-gray-800 text-white text-center text-sm font-semibold rounded-xl shadow-md transition-all"
                  >
                    Message
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}