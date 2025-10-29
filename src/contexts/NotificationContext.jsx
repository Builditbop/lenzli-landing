import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to new connections
    const connectionsRef = collection(db, 'connections');
    const qConnections = query(
      connectionsRef,
      where('creatorId', '==', currentUser.uid)
    );

    const unsubscribeConnections = onSnapshot(qConnections, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          addNotification({
            type: 'connection',
            title: 'New Connection!',
            message: `Someone wants to connect with you`,
            timestamp: new Date().toISOString(),
            read: false,
            data: { connectionId: change.doc.id, userId: data.userId }
          });
        }
      });
    });

    // Subscribe to messages
    const chatsRef = collection(db, 'chats');
    // Note: This is a simplified version. In production, you'd query specific chats
    
    return () => {
      unsubscribeConnections();
    };
  }, [currentUser]);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);

    // Show browser notification if permitted (guard against unsupported environments)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markAsRead = (index) => {
    setNotifications(prev =>
      prev.map((notification, idx) =>
        idx === index ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
