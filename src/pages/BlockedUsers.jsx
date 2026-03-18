import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getBlockedUsers, unblockUser } from '../utils/safety';

export default function BlockedUsers() {
  const { currentUser } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblocking, setUnblocking] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlockedUsers();
  }, [currentUser]);

  const fetchBlockedUsers = async () => {
    if (!currentUser?.uid) return;
    try {
      const blockedUserIds = await getBlockedUsers(currentUser.uid);
      if (blockedUserIds.length === 0) { setBlockedUsers([]); setLoading(false); return; }
      const userProfiles = [];
      for (const userId of blockedUserIds) {
        try {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) userProfiles.push({ id: userSnap.id, ...userSnap.data() });
        } catch (error) { console.error(`Error fetching user ${userId}:`, error); }
      }
      setBlockedUsers(userProfiles);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      setError('Failed to load blocked users');
    } finally { setLoading(false); }
  };

  const handleUnblock = async (userId, displayName) => {
    if (!window.confirm(`Are you sure you want to unblock ${displayName || 'this user'}? They will be able to see your profile and message you again.`)) return;
    setUnblocking({ ...unblocking, [userId]: true });
    setError('');
    try {
      await unblockUser(currentUser.uid, userId);
      setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
      setUnblocking({ ...unblocking, [userId]: false });
    } catch (error) {
      console.error('Error unblocking user:', error);
      setError('Failed to unblock user. Please try again.');
      setUnblocking({ ...unblocking, [userId]: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <Link to="/settings" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-black">Blocked Users</h1>
          <p className="text-gray-500">
            {blockedUsers.length} {blockedUsers.length === 1 ? 'user' : 'users'} blocked
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600">{error}</div>
        )}

        {blockedUsers.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-black">No blocked users</h2>
            <p className="text-gray-500 mb-6">You haven't blocked any users yet</p>
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 rounded-xl bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle"
            >
              Back to Settings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {blockedUsers.map((user) => (
              <div key={user.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card hover:border-gray-300 transition-all">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl bg-cover bg-center flex-shrink-0 border border-gray-200"
                    style={{
                      backgroundImage: user.portfolioImages?.[0]
                        ? `url(${user.portfolioImages[0]})`
                        : 'linear-gradient(to bottom right, #e5e7eb, #f3f4f6)'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 text-black">{user.displayName || 'Unknown User'}</h3>
                    {user.role && <p className="text-sm text-gray-500 mb-2">{user.role}</p>}
                    {user.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {user.location}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnblock(user.id, user.displayName)}
                    disabled={unblocking[user.id]}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {unblocking[user.id] ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Unblocking...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Unblock
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
