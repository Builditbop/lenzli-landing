import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, addDoc, orderBy, doc, getDoc, getDocs, writeBatch, setDoc, deleteDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadMessageImage } from '../utils/nsfwDetection';
import { blockUser, isUserBlocked, filterBlockedUsers } from '../utils/safety';
import ReportModal from '../components/ReportModal';

export default function Messages() {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [conversations, setConversations] = useState([]);
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

  // 1. Listen to all conversations the user is part of
  useEffect(() => {
    if (!currentUser?.uid) return;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid), orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const convosData = [];
      
      for (const chatDoc of snapshot.docs) {
        const chatData = chatDoc.data();
        const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
        
        if (otherUserId) {
          // Check if already blocked
          const blocked = await isUserBlocked(currentUser.uid, otherUserId);
          if (blocked) continue;

          const userRef = doc(db, 'users', otherUserId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            convosData.push({
              id: chatDoc.id,
              chatId: chatDoc.id,
              ...chatData,
              creatorId: otherUserId,
              creator: { id: userSnap.id, ...userSnap.data() }
            });
          }
        }
      }
      
      setConversations(convosData);
      setLoading(false);

      // If we have a targetUserId from searchParams, select that chat
      if (targetUserId && !selectedChat) {
        const existingConvo = convosData.find(c => c.creatorId === targetUserId);
        if (existingConvo) {
          setSelectedChat(existingConvo);
        } else {
          // If no existing chat document, check if they are a connection to start one
          fetchAndStartNewChat(targetUserId);
        }
      } else if (!selectedChat && convosData.length > 0 && !targetUserId) {
        setSelectedChat(convosData[0]);
      }
    }, (err) => {
      console.error("Chats listener error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, targetUserId]);

  const fetchAndStartNewChat = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const chatId = [currentUser.uid, uid].sort().join('_');
        const newChat = {
          id: chatId,
          chatId,
          creatorId: uid,
          creator: { id: uid, ...userData },
          participants: [currentUser.uid, uid],
          updatedAt: new Date().toISOString()
        };
        setSelectedChat(newChat);
      }
    } catch (err) {
      console.error('Error starting new chat:', err);
    }
  };

  // 2. Chat Selection Logic
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
        const privacy = recipientData.messagePrivacy || 'everyone';
        if (privacy === 'none') {
          setCanMessage(false);
          setMessagePrivacyError('This user has disabled messaging');
          return;
        }
        if (privacy === 'connections') {
          const connectionsRef = collection(db, 'connections');
          const q1 = query(connectionsRef, where('userId', '==', selectedChat.creatorId), where('creatorId', '==', currentUser.uid));
          const q2 = query(connectionsRef, where('userId', '==', currentUser.uid), where('creatorId', '==', selectedChat.creatorId));
          const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)]);
          if (s1.empty && s2.empty) {
            setCanMessage(false);
            setMessagePrivacyError('This user only accepts messages from connections');
            return;
          }
        }
        setCanMessage(true);
        setMessagePrivacyError('');
      }
    } catch (error) {
      setCanMessage(true);
    }
  };

  const checkIfBlocked = async () => {
    if (!selectedChat || !currentUser?.uid) return;
    const blocked = await isUserBlocked(currentUser.uid, selectedChat.creatorId);
    setIsBlocked(blocked);
  };

  const handleBlock = async () => {
    if (!selectedChat) return;
    if (!window.confirm(`Block ${selectedChat.creator.displayName}?`)) return;
    setBlocking(true);
    try {
      await blockUser(currentUser.uid, selectedChat.creatorId);
      setIsBlocked(true);
      setShowMenu(false);
      setSelectedChat(null);
    } catch (error) {
      console.error(error);
    } finally { setBlocking(false); }
  };

  // 3. Messages Listener
  useEffect(() => {
    if (!selectedChat || !selectedChat.chatId) return;
    const messagesRef = collection(db, 'chats', selectedChat.chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubscribeTyping = subscribeToTyping(selectedChat.chatId);
    
    return () => {
      unsubscribe();
      unsubscribeTyping();
      if (typingDocRef.current) deleteDoc(typingDocRef.current);
    };
  }, [selectedChat?.chatId]);

  const subscribeToTyping = (chatId) => {
    const otherUserId = chatId.split('_').find(id => id !== currentUser.uid);
    if (!otherUserId) return () => {};
    return onSnapshot(doc(db, 'chats', chatId, 'typing', otherUserId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const timestamp = data.timestamp?.toMillis ? data.timestamp.toMillis() : Date.now();
        setOtherUserTyping(Date.now() - timestamp < 3000);
      } else {
        setOtherUserTyping(false);
      }
    });
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, otherUserTyping]);

  // Mark as read
  useEffect(() => {
    if (!selectedChat || !currentUser?.uid || messages.length === 0) return;
    const unread = messages.filter(m => m.senderId !== currentUser.uid && !m.readBy?.includes(currentUser.uid));
    if (unread.length === 0) return;

    const markRead = async () => {
      const batch = writeBatch(db);
      unread.forEach(m => {
        const ref = doc(db, 'chats', selectedChat.chatId, 'messages', m.id);
        batch.update(ref, { 
          readBy: [...(m.readBy || []), currentUser.uid],
          readAt: { ...(m.readAt || {}), [currentUser.uid]: new Date().toISOString() }
        });
      });
      // Also update chat metadata unread count for current user
      const chatRef = doc(db, 'chats', selectedChat.chatId);
      // Check if chat doc exists first
      const chatSnap = await getDoc(chatRef);
      if (chatSnap.exists()) {
        batch.update(chatRef, { [`unreadCount.${currentUser.uid}`]: 0 });
      }
      await batch.commit();
    };
    markRead();
  }, [messages, selectedChat, currentUser]);

  const updateTypingStatus = async (typing) => {
    if (!selectedChat || !currentUser?.uid) return;
    const ref = doc(db, 'chats', selectedChat.chatId, 'typing', currentUser.uid);
    typingDocRef.current = ref;
    if (typing) await setDoc(ref, { userId: currentUser.uid, timestamp: serverTimestamp() });
    else await deleteDoc(ref);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imagePreview) || !selectedChat) return;
    if (!canMessage) return;
    
    setUploadingImage(true);
    try {
      let imageUrl = null;
      if (imagePreview && fileInputRef.current?.files?.[0]) {
        const res = await uploadMessageImage(fileInputRef.current.files[0]);
        if (res.isNSFW) { setError('Inappropriate content rejected'); setUploadingImage(false); return; }
        imageUrl = res.url;
      }

      const msgData = {
        text: newMessage.trim(),
        imageUrl,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        timestamp: new Date().toISOString(),
        readBy: [currentUser.uid],
        readAt: { [currentUser.uid]: new Date().toISOString() }
      };

      await addDoc(collection(db, 'chats', selectedChat.chatId, 'messages'), msgData);
      
      // Update parent chat doc
      const chatRef = doc(db, 'chats', selectedChat.chatId);
      const chatSnap = await getDoc(chatRef);
      const currentUnread = chatSnap.exists() ? (chatSnap.data().unreadCount || {}) : {};
      const otherUserId = selectedChat.creatorId;
      
      await setDoc(chatRef, {
        lastMessage: newMessage.trim() || (imageUrl ? '📷 Image' : ''),
        lastSenderId: currentUser.uid,
        lastTimestamp: new Date().toISOString(),
        updatedAt: serverTimestamp(),
        participants: [currentUser.uid, otherUserId],
        unreadCount: {
          ...currentUnread,
          [otherUserId]: (currentUnread[otherUserId] || 0) + 1
        }
      }, { merge: true });

      setNewMessage('');
      setImagePreview(null);
      updateTypingStatus(false);
    } catch (err) {
      setError('Failed to send message');
    } finally { setUploadingImage(false); }
  };

  return (
    <div className="h-screen bg-[#F8F9FA] flex flex-col font-sans overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-80 lg:w-96 border-r border-gray-200 bg-white flex-col">
          <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter text-black flex items-center gap-2">
              Messages
              <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 && !loading ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">No conversations yet</p>
                <Link to="/discover" className="mt-4 inline-block text-xs font-black uppercase tracking-widest text-black hover:opacity-70">Start Discovering</Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {conversations.map((convo) => {
                  const unread = convo.unreadCount?.[currentUser.uid] || 0;
                  const isActive = selectedChat?.chatId === convo.chatId;
                  return (
                    <motion.button
                      key={convo.id}
                      onClick={() => {
                        setSelectedChat(convo);
                        setSearchParams({});
                      }}
                      className={`w-full p-5 text-left transition-all relative group ${
                        isActive ? 'bg-black shadow-lg z-10' : 'hover:bg-gray-50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className="w-14 h-14 rounded-2xl bg-cover bg-center border-2 border-white shadow-sm transition-transform group-hover:scale-105"
                            style={{ backgroundImage: `url(${convo.creator.portfolioImages?.[0] || 'https://ui-avatars.com/api/?name=' + convo.creator.displayName + '&background=000&color=fff'})` }}
                          />
                          {convo.creator.availability && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className={`font-bold truncate text-sm ${isActive ? 'text-white' : 'text-black'}`}>
                              {convo.creator.displayName}
                            </h3>
                            {convo.lastTimestamp && (
                              <span className={`text-[10px] ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>
                                {new Date(convo.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs truncate ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>
                            {convo.lastMessage || convo.creator.role}
                          </p>
                        </div>
                        {unread > 0 && !isActive && (
                          <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                            {unread}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Chat Main */}
        <main className="flex-1 flex flex-col bg-white">
          <AnimatePresence mode="wait">
            {selectedChat ? (
              <motion.div 
                key={selectedChat.chatId}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col h-full overflow-hidden"
              >
                <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                    <Link to={`/profile/${selectedChat.creatorId}`} className="relative group">
                      <div
                        className="w-10 h-10 rounded-xl bg-cover bg-center border border-gray-100 transition-transform group-hover:scale-105"
                        style={{ backgroundImage: `url(${selectedChat.creator.portfolioImages?.[0] || 'https://ui-avatars.com/api/?name=' + selectedChat.creator.displayName + '&background=000&color=fff'})` }}
                      />
                    </Link>
                    <div>
                      <h3 className="font-bold text-black text-base leading-tight">{selectedChat.creator.displayName}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${otherUserTyping ? 'bg-black animate-bounce' : 'bg-gray-200'}`}></div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {otherUserTyping ? 'Typing...' : selectedChat.creator.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-6 top-16 w-56 rounded-2xl bg-white border border-gray-100 shadow-elevated overflow-hidden z-20"
                      >
                        <Link to={`/profile/${selectedChat.creatorId}`} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          View Profile
                        </Link>
                        <button onClick={handleBlock} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          Block User
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#FDFDFD]">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mb-4 rotate-12">
                        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      </div>
                      <p className="text-sm font-bold uppercase tracking-widest">Start the collaboration</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isMe = msg.senderId === currentUser.uid;
                      const showAvatar = idx === 0 || messages[idx-1].senderId !== msg.senderId;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            {msg.imageUrl && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="mb-2 rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                              >
                                <img src={msg.imageUrl} alt="Shared" className="max-h-80 object-cover" />
                              </motion.div>
                            )}
                            {msg.text && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${
                                  isMe ? 'bg-black text-white rounded-br-none' : 'bg-white text-black border border-gray-100 rounded-bl-none'
                                }`}
                              >
                                {msg.text}
                              </motion.div>
                            )}
                            <div className="mt-1.5 flex items-center gap-2 px-1">
                              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && (
                                <span className={`text-[10px] font-black ${msg.readBy?.length > 1 ? 'text-black' : 'text-gray-300'}`}>
                                  {msg.readBy?.length > 1 ? 'READ' : 'SENT'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {otherUserTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="px-4 py-2 rounded-2xl bg-gray-50 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <footer className="p-6 bg-white border-t border-gray-50">
                  <form onSubmit={sendMessage} className="flex flex-col gap-3">
                    <AnimatePresence>
                      {imagePreview && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="relative inline-block self-start"
                        >
                          <img src={imagePreview} className="w-32 h-32 rounded-2xl object-cover border-2 border-black" />
                          <button 
                            type="button" onClick={() => setImagePreview(null)} 
                            className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs shadow-lg"
                          >×</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex gap-3">
                      <button 
                        type="button" onClick={() => fileInputRef.current.click()} 
                        className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 v12a2 2 0 002 2z" /></svg>
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const f = e.target.files[0];
                        if (f) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setImagePreview(ev.target.result);
                          reader.readAsDataURL(f);
                        }
                      }} />
                      <input 
                        type="text" value={newMessage} 
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          if (!isTyping) { setIsTyping(true); updateTypingStatus(true); }
                          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                          typingTimeoutRef.current = setTimeout(() => { setIsTyping(false); updateTypingStatus(false); }, 2000);
                        }}
                        placeholder="Collaborate..." 
                        className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-black text-sm font-medium placeholder-gray-300 transition-all"
                      />
                      <button 
                        type="submit" disabled={(!newMessage.trim() && !imagePreview) || uploadingImage}
                        className="px-8 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 disabled:opacity-20 transition-all shadow-subtle"
                      >
                        {uploadingImage ? '...' : 'Send'}
                      </button>
                    </div>
                  </form>
                </footer>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white"
              >
                <div className="w-24 h-24 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 className="text-2xl font-black tracking-tighter text-black mb-2">Select a creator</h3>
                <p className="text-gray-400 text-sm font-medium max-w-xs leading-relaxed">Connect with photographers and filmmakers to start building your crew.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} reportedUserId={selectedChat?.creatorId} reportedUserName={selectedChat?.creator.displayName} />
    </div>
  );
}
