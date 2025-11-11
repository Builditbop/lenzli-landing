import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import posthog from '../config/posthog';

export default function Connections() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
    // Track connections page view
    posthog.capture('connections_page_viewed');
  }, [currentUser]);

  useEffect(() => {
    if (!loading) {
      // Track connections count
      posthog.capture('connections_loaded', {
        connections_count: connections.length
      });
    }
  }, [loading, connections.length]);

  const fetchConnections = async () => {
    try {
      const connectionsRef = collection(db, 'connections');
      const q = query(connectionsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);

      const connectionsData = [];
      for (const connectionDoc of querySnapshot.docs) {
        const connection = connectionDoc.data();
        const creatorRef = doc(db, 'users', connection.creatorId);
        const creatorSnap = await getDoc(creatorRef);

        if (creatorSnap.exists()) {
          connectionsData.push({
            id: connectionDoc.id,
            ...connection,
            creator: { id: creatorSnap.id, ...creatorSnap.data() }
          });
        }
      }

      setConnections(connectionsData);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading connections...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link to="/discover" className="text-xl font-semibold hover:opacity-80">
              Lenzli
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/discover" className="hover:text-white/80">Discover</Link>
            <Link to="/connections" className="hover:text-white/80">Connections</Link>
            <Link to="/messages" className="hover:text-white/80">Messages</Link>
            <Link to="/profile" className="hover:text-white/80">Profile</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Connections</h1>
          <p className="text-white/70">
            {connections.length} {connections.length === 1 ? 'creator' : 'creators'} you've connected with
          </p>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-white/10 bg-white/5">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">No connections yet</h2>
            <p className="text-white/70 mb-6">
              Start discovering to connect with creators
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover Creators
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {connections.map((connection) => (
              <Link
                key={connection.id}
                to={`/profile/${connection.creator.id}`}
                onClick={() => posthog.capture('connection_viewed', {
                  connection_id: connection.id,
                  creator_id: connection.creator.id,
                  creator_role: connection.creator.role,
                  location: 'connections_page'
                })}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition group"
              >
                <div className="flex items-start gap-4">
                  {/* Profile Image */}
                  <div
                    className="w-20 h-20 rounded-2xl bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: connection.creator.portfolioImages?.[0]
                        ? `url(${connection.creator.portfolioImages[0]})`
                        : 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition">
                      {connection.creator.displayName}
                    </h3>
                    <p className="text-sm text-white/70">{connection.creator.role}</p>

                    {connection.creator.location && (
                      <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {connection.creator.location}
                      </p>
                    )}

                    {connection.creator.specialties && connection.creator.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {connection.creator.specialties.slice(0, 2).map((specialty) => (
                          <span
                            key={specialty}
                            className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-white/50">
                      Connected {new Date(connection.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-white/40 group-hover:text-white transition">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

