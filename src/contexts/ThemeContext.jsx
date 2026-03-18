import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const themes = [
  { id: 'light', name: 'Light', class: 'theme-light', bg: '#ffffff', text: '#000000' },
  { id: 'dark', name: 'Dark', class: 'theme-dark', bg: '#0a0a0a', text: '#f9fafb' },
  { id: 'sepia', name: 'Sepia', class: 'theme-sepia', bg: '#f4ecd8', text: '#433422' },
  { id: 'blue', name: 'Modern Blue', class: 'theme-blue', bg: '#f0f4f8', text: '#102a43' },
];

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentTheme, setCurrentTheme] = useState('light');

  // Load theme from Firestore or LocalStorage
  useEffect(() => {
    const loadTheme = async () => {
      if (currentUser?.uid) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().theme) {
            setCurrentTheme(userSnap.data().theme);
            return;
          }
        } catch (error) {
          console.error('Error loading theme from Firestore:', error);
        }
      }
      
      const localTheme = localStorage.getItem('lenzli-theme');
      if (localTheme) {
        setCurrentTheme(localTheme);
      }
    };

    loadTheme();
  }, [currentUser]);

  // Apply theme class to body
  useEffect(() => {
    // Remove all theme classes
    themes.forEach(t => document.body.classList.remove(t.class));
    // Add current theme class
    const themeObj = themes.find(t => t.id === currentTheme) || themes[0];
    document.body.classList.add(themeObj.class);
    localStorage.setItem('lenzli-theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = async (themeId) => {
    setCurrentTheme(themeId);
    if (currentUser?.uid) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          theme: themeId,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error saving theme to Firestore:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
