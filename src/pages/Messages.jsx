import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, orderBy, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Messages() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return undefined;
    }

    const unsubscribe = subscribeToMessages(selectedChat.chatId);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedChat]);

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
          const chatId = [currentUser.uid, connection.creatorId].sort().join('_');
          connectionsData.push({
            id: connectionDoc.id,
            ...connection,
            creator: { id: creatorSnap.id, ...creatorSnap.data() },
            chatId
          });
        }
      }

      setConnections(connectionsData);
      if (connectionsData.length > 0) {
        setSelectedChat(connectionsData[0]);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = (chatId) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });

    return unsubscribe;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messagesRef = collection(db, 'chats', selectedChat.chatId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        timestamp: new Date().toISOString(),
        read: false
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur flex-shrink-0">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link to="/discover" className="text-xl font-semibold hover:opacity-80">
              Lenzli
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/discover" className="hover:text-white/80">Discover</Link>
            <Link to="/connections" className="hover:text-white/80">Connections</Link>
            <Link to="/profile" className="hover:text-white/80">Profile</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-white/10 bg-white/5 overflow-y-auto">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold">Messages</h2>
            <p className="text-xs text-white/60 mt-1">{connections.length} conversations</p>
          </div>

          {connections.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm text-white/70 mb-2">No messages yet</p>
              <Link to="/discover" className="text-xs text-emerald-400 hover:underline inline-block">
                Start connecting
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {connections.map((connection) => (
                <button
                  key={connection.id}
                  onClick={() => setSelectedChat(connection)}
                  className={`w-full p-4 text-left hover:bg-white/5 transition ${
                    selectedChat?.id === connection.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage: connection.creator.portfolioImages?.[0]
                          ? `url(${connection.creator.portfolioImages[0]})`
                          : 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{connection.creator.displayName}</div>
                      <div className="text-xs text-white/60 truncate">{connection.creator.role}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: selectedChat.creator.portfolioImages?.[0]
                      ? `url(${selectedChat.creator.portfolioImages[0]})`
                      : 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))'
                  }}
                />
                <div>
                  <div className="font-semibold">{selectedChat.creator.displayName}</div>
                  <div className="text-xs text-white/60">{selectedChat.creator.role}</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-white/70">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === currentUser.uid
                          ? 'bg-emerald-400 text-black'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="rounded-2xl bg-emerald-400 text-black px-6 py-3 text-sm font-medium hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/60">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
