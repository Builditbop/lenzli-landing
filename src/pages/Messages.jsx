import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, addDoc, orderBy, doc, getDoc, getDocs, writeBatch, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { uploadMessageImage } from '../utils/nsfwDetection';
import { blockUser, isUserBlocked, filterBlockedUsers } from '../utils/safety';
import ReportModal from '../components/ReportModal';

export default function Messages() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [canMessage, setCanMessage] = useState(true);
  const [messagePrivacyError, setMessagePrivacyError] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingDocRef = useRef(null);

  useEffect(() => {
    fetchConnections();
  }, [currentUser]);

  useEffect(() => {
    if (selectedChat && currentUser?.uid) {
      checkIfBlocked();
      checkMessagePrivacy();
    }
  }, [selectedChat, currentUser]);

  const checkMessagePrivacy = async () => {
    if (!selectedChat || !currentUser?.uid) return;
    
    try {
      const recipientRef = doc(db, 'users', selectedChat.creatorId);
      const recipientSnap = await getDoc(recipientRef);
      
      if (recipientSnap.exists()) {
        const recipientData = recipientSnap.data();
        const messagePrivacy = recipientData.messagePrivacy || 'everyone';
        
        if (messagePrivacy === 'none') {
          setCanMessage(false);
          setMessagePrivacyError('This user has disabled messaging');
          return;
        }
        
        if (messagePrivacy === 'connections') {
          // Check if current user is a connection
          const connectionsRef = collection(db, 'connections');
          const connectionQuery = query(
            connectionsRef,
            where('userId', '==', selectedChat.creatorId),
            where('creatorId', '==', currentUser.uid)
          );
          const connectionSnap = await getDocs(connectionQuery);
          
          if (connectionSnap.empty) {
            // Also check reverse connection
            const reverseQuery = query(
              connectionsRef,
              where('userId', '==', currentUser.uid),
              where('creatorId', '==', selectedChat.creatorId)
            );
            const reverseSnap = await getDocs(reverseQuery);
            
            if (reverseSnap.empty) {
              setCanMessage(false);
              setMessagePrivacyError('This user only accepts messages from connections');
              return;
            }
          }
        }
        
        setCanMessage(true);
        setMessagePrivacyError('');
      }
    } catch (error) {
      console.error('Error checking message privacy:', error);
      // Default to allowing messages if check fails
      setCanMessage(true);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.relative')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const checkIfBlocked = async () => {
    if (!selectedChat || !currentUser?.uid) return;
    try {
      const blocked = await isUserBlocked(currentUser.uid, selectedChat.creatorId);
      setIsBlocked(blocked);
    } catch (error) {
      console.error('Error checking if user is blocked:', error);
    }
  };

  const handleBlock = async () => {
    if (!selectedChat) return;
    
    if (!window.confirm(`Are you sure you want to block ${selectedChat.creator.displayName}? You won't be able to see their profile or receive messages from them.`)) {
      return;
    }

    setBlocking(true);
    try {
      await blockUser(currentUser.uid, selectedChat.creatorId);
      setIsBlocked(true);
      setShowMenu(false);
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user. Please try again.');
    } finally {
      setBlocking(false);
    }
  };

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      setOtherUserTyping(false);
      return undefined;
    }

    const unsubscribe = subscribeToMessages(selectedChat.chatId);
    const unsubscribeTyping = subscribeToTyping(selectedChat.chatId);
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      if (typeof unsubscribeTyping === 'function') {
        unsubscribeTyping();
      }
      // Clear typing status when leaving chat
      if (typingDocRef.current) {
        deleteDoc(typingDocRef.current);
      }
    };
  }, [selectedChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when viewing chat
  useEffect(() => {
    if (!selectedChat || !currentUser?.uid || messages.length === 0) return;

    // Find unread messages sent by the other person
    const unreadMessages = messages.filter(
      (msg) => msg.senderId !== currentUser.uid && !msg.readBy?.includes(currentUser.uid)
    );

    if (unreadMessages.length === 0) return;

    // Mark them as read
    const markAsRead = async () => {
      try {
        const batch = writeBatch(db);
        unreadMessages.forEach((msg) => {
          const messageRef = doc(db, 'chats', selectedChat.chatId, 'messages', msg.id);
          const readBy = msg.readBy || [];
          if (!readBy.includes(currentUser.uid)) {
            batch.update(messageRef, {
              readBy: [...readBy, currentUser.uid],
              readAt: {
                ...(msg.readAt || {}),
                [currentUser.uid]: new Date().toISOString()
              }
            });
          }
        });
        await batch.commit();
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markAsRead();
  }, [messages, selectedChat, currentUser]);

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

      // Filter out blocked users
      const filteredConnections = await filterBlockedUsers(currentUser.uid, connectionsData);
      setConnections(filteredConnections);
      if (filteredConnections.length > 0) {
        setSelectedChat(filteredConnections[0]);
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

  const subscribeToTyping = (chatId) => {
    if (!currentUser?.uid) return;
    
    // Get the other user's ID
    const chatUserIds = chatId.split('_');
    const otherUserId = chatUserIds.find(id => id !== currentUser.uid);
    
    if (!otherUserId) return;

    // Listen to the other user's typing status
    const typingRef = doc(db, 'chats', chatId, 'typing', otherUserId);
    
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const typingData = snapshot.data();
        // Check if typing status is recent (within last 3 seconds)
        const timestamp = typingData.timestamp;
        if (timestamp) {
          const typingTime = timestamp.toMillis ? timestamp.toMillis() : timestamp;
          const now = Date.now();
          if (now - typingTime < 3000) {
            setOtherUserTyping(true);
            // Auto-hide after 3 seconds if no update
            setTimeout(() => {
              setOtherUserTyping(false);
            }, 3000);
          } else {
            setOtherUserTyping(false);
          }
        } else {
          setOtherUserTyping(true);
        }
      } else {
        setOtherUserTyping(false);
      }
    });

    return unsubscribe;
  };

  const updateTypingStatus = async (isUserTyping) => {
    if (!selectedChat || !currentUser?.uid) return;

    const chatId = selectedChat.chatId;
    const typingRef = doc(db, 'chats', chatId, 'typing', currentUser.uid);
    typingDocRef.current = typingRef;

    if (isUserTyping) {
      await setDoc(typingRef, {
        userId: currentUser.uid,
        timestamp: serverTimestamp()
      }, { merge: true });
    } else {
      await deleteDoc(typingRef);
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Update typing status if user is typing
    if (value.trim().length > 0) {
      if (!isTyping) {
        setIsTyping(true);
        updateTypingStatus(true);
      }
      
      // Clear typing status after 2 seconds of no typing
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        updateTypingStatus(false);
      }, 2000);
    } else {
      // Clear typing status immediately if input is empty
      if (isTyping) {
        setIsTyping(false);
        updateTypingStatus(false);
      }
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imagePreview) || !selectedChat) return;
    
    if (!canMessage) {
      setError(messagePrivacyError || 'You cannot send messages to this user');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      let imageUrl = null;

      // Upload image if preview exists
      if (imagePreview && fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const result = await uploadMessageImage(file);
        
        if (result.isNSFW) {
          setError('Image was rejected due to inappropriate content');
          setUploadingImage(false);
          removeImagePreview();
          return;
        }
        
        imageUrl = result.url;
      }

      // Send message with text and/or image
      const messagesRef = collection(db, 'chats', selectedChat.chatId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage.trim() || '',
        imageUrl: imageUrl || null,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        timestamp: new Date().toISOString(),
        readBy: [], // Array of user IDs who have read this message
        readAt: {} // Object mapping userId to read timestamp
      });

      // Reset form
      setNewMessage('');
      removeImagePreview();
      
      // Clear typing status
      setIsTyping(false);
      updateTypingStatus(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-vibrant text-white flex flex-col relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="relative z-10 flex flex-col h-full">
          {/* Header Skeleton */}
          <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-cyan-900/80 border-b-2 border-purple-400/30 flex-shrink-0">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-16 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </nav>
          </header>

          {/* Main Content Skeleton */}
          <div className="flex-1 flex overflow-hidden relative z-10">
            {/* Conversations List Skeleton */}
            <div className="w-80 border-r-2 border-purple-400/30 bg-gradient-to-b from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-md">
              <div className="p-4 border-b-2 border-purple-400/30">
                <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-2" />
                      <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area Skeleton */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b-2 border-purple-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-2" />
                    <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`h-16 w-48 bg-white/10 rounded-2xl animate-pulse`} style={{ animationDelay: `${i * 150}ms` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-vibrant text-white flex flex-col relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      <div className="relative z-10 flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-cyan-900/80 border-b-2 border-purple-400/30 flex-shrink-0">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link to="/discover" className="text-xl font-bold text-gradient-primary">Lenzli</Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/90">
            <Link to="/discover" className="hover:text-gradient-primary transition font-medium">Discover</Link>
            <Link to="/connections" className="hover:text-gradient-primary transition font-medium">Connections</Link>
            <Link to="/messages" className="hover:text-gradient-primary transition font-medium text-gradient-primary">Messages</Link>
            <Link to="/profile" className="hover:text-gradient-primary transition font-medium">Profile</Link>
            <Link to="/settings" className="hover:text-gradient-primary transition font-medium">Settings</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Conversations List */}
        <div className="w-80 border-r-2 border-purple-400/30 bg-gradient-to-b from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-md overflow-y-auto">
          <div className="p-4 border-b-2 border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Messages
            </h2>
            <p className="text-xs text-white/60 mt-1">{connections.length} {connections.length === 1 ? 'conversation' : 'conversations'}</p>
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
                  onClick={() => {
                    setSelectedChat(connection);
                  }}
                  className={`w-full p-4 text-left hover:bg-white/10 transition-all duration-200 ${
                    selectedChat?.id === connection.id ? 'bg-gradient-to-r from-emerald-400/20 via-purple-400/10 to-emerald-500/10 border-l-4 border-emerald-400 shadow-lg shadow-emerald-400/10' : ''
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
            <div className="p-4 border-b-2 border-purple-400/30 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center ring-2 ring-emerald-400/20"
                  style={{
                    backgroundImage: selectedChat.creator.portfolioImages?.[0]
                      ? `url(${selectedChat.creator.portfolioImages[0]})`
                      : 'linear-gradient(to bottom right, rgba(16,185,129,0.3), rgba(139,92,246,0.3))'
                  }}
                />
                <div className="flex-1">
                  <div className="font-semibold text-lg">{selectedChat.creator.displayName}</div>
                  <div className="text-xs text-emerald-400/80">{selectedChat.creator.role}</div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-12 w-48 rounded-xl border border-white/10 bg-gradient-to-br from-gray-900 to-black shadow-2xl overflow-hidden z-50">
                      <Link
                        to={`/profile/${selectedChat.creatorId}`}
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-3 hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                      </Link>
                      {!isBlocked ? (
                        <>
                          <button
                            onClick={handleBlock}
                            disabled={blocking}
                            className="w-full text-left px-4 py-3 hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            {blocking ? 'Blocking...' : 'Block User'}
                          </button>
                          <button
                            onClick={() => {
                              setShowReportModal(true);
                              setShowMenu(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/10 transition-all flex items-center gap-2 text-rose-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Report User
                          </button>
                        </>
                      ) : (
                        <div className="px-4 py-3 text-rose-300/70 text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          User Blocked
                        </div>
                      )}
                    </div>
                  )}
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
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                          message.senderId === currentUser.uid
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-black shadow-lg shadow-emerald-400/20'
                            : 'bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/10'
                        }`}
                      >
                      {message.imageUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-white/10">
                          <img
                            src={message.imageUrl}
                            alt="Shared"
                            className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-all duration-200"
                            onClick={() => {
                              // Open in lightbox/modal
                              const newWindow = window.open(message.imageUrl, '_blank');
                              if (!newWindow) {
                                // Fallback: download image
                                const link = document.createElement('a');
                                link.href = message.imageUrl;
                                link.download = 'image';
                                link.click();
                              }
                            }}
                          />
                        </div>
                      )}
                      {message.text && (
                        <p className="text-sm">{message.text}</p>
                      )}
                      <div className={`flex items-center gap-1 mt-1 ${message.imageUrl && !message.text ? 'mt-0' : ''}`}>
                        <p className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {/* Read receipt indicators (only for sent messages) */}
                        {message.senderId === currentUser.uid && selectedChat && (() => {
                          // Get the recipient's ID (the other user in the chat)
                          const chatUserIds = selectedChat.chatId.split('_');
                          const recipientId = chatUserIds.find(id => id !== currentUser.uid);
                          const isRead = recipientId && message.readBy?.includes(recipientId);
                          
                          return (
                            <div className="flex items-center">
                              {isRead ? (
                                // Double checkmark for read
                                <span className="text-xs opacity-70" title="Read">
                                  ✓✓
                                </span>
                              ) : (
                                // Single checkmark for sent
                                <span className="text-xs opacity-50" title="Sent">
                                  ✓
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      </div>
                    </div>
                  ))}
                  {/* Typing Indicator */}
                  {otherUserTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-xs md:max-w-md px-4 py-2 rounded-2xl bg-white/10 text-white/80 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></span>
                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}></span>
                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}></span>
                          </div>
                          <span className="text-xs text-white/70 italic">{selectedChat?.creator?.displayName || 'Someone'} is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            {isBlocked ? (
              <div className="p-4 border-t-2 border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
                <div className="p-4 bg-rose-400/10 border border-rose-400/30 rounded-xl text-sm text-rose-300 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>This user is blocked. You cannot send messages.</span>
                </div>
              </div>
            ) : !canMessage ? (
              <div className="p-4 border-t-2 border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
                <div className="p-4 bg-rose-400/10 border border-rose-400/30 rounded-xl text-sm text-rose-300 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>{messagePrivacyError || 'You cannot send messages to this user'}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={sendMessage} className="p-4 border-t-2 border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
              {error && (
                <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-sm text-red-300 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              
              {imagePreview && (
                <div className="mb-3 relative inline-block">
                  <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-emerald-400/50 shadow-lg">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImagePreview}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm cursor-pointer hover:bg-white/10 hover:border-white/25 transition-all duration-200 flex items-center justify-center group"
                  title="Upload image"
                >
                  <svg className="w-5 h-5 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleMessageChange}
                  placeholder="Type a message..."
                  className="flex-1 rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/30 transition-all"
                />
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !imagePreview) || uploadingImage}
                  className="rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-black px-6 py-3 text-sm font-semibold hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-emerald-400/20"
                >
                  {uploadingImage ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send
                    </>
                  )}
                </button>
              </div>
            </form>
            )}
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

      {/* Report Modal */}
      {selectedChat && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportedUserId={selectedChat.creatorId}
          reportedUserName={selectedChat.creator.displayName || 'User'}
        />
      )}
      </div>
    </div>
  );
}
