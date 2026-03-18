import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { filterBlockedUsers } from '../utils/safety';

export default function Connections() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, [currentUser]);

  const fetchConnections = async () => {
    if (!currentUser?.uid) return;
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
          connectionsData.push({ id: connectionDoc.id, ...connection, creator: { id: creatorSnap.id, ...creatorSnap.data() } });
        }
      }
      const filteredConnections = await filterBlockedUsers(currentUser.uid, connectionsData);
      setConnections(filteredConnections);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)]">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-[var(--text-primary)]/10 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-[var(--text-primary)]/10 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-[var(--text-primary)]/5 border border-[var(--border-color)] rounded-2xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Connections</h1>
          <p className="text-[var(--text-secondary)]">
            {connections.length} {connections.length === 1 ? 'creator' : 'creators'} you've connected with
          </p>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--text-primary)]/5">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--text-primary)]/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">No connections yet</h2>
            <p className="text-[var(--text-secondary)] mb-8">Start exploring creators to build your network</p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-color)] text-[var(--accent-text)] px-8 py-3 text-sm font-semibold hover:opacity-90 transition-all shadow-subtle"
            >
              Explore Creators
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((connection) => (
              <Link
                key={connection.id}
                to={`/profile/${connection.creatorId}`}
                className="group block rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-card hover:border-[var(--text-primary)] transition-all overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl bg-cover bg-center flex-shrink-0 border border-[var(--border-color)] group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: connection.creator.portfolioImages?.[0]
                        ? `url(${connection.creator.portfolioImages[0]})`
                        : 'linear-gradient(to bottom right, #e5e7eb, #f3f4f6)'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate group-hover:text-[var(--accent-color)] transition-colors">
                      {connection.creator.displayName}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] truncate">{connection.creator.role}</p>
                    <p className="text-xs text-[var(--text-secondary)] opacity-60 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {connection.creator.location}
                    </p>
                  </div>
                  <div className="text-[var(--text-secondary)] opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
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
