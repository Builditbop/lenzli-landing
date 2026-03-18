import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, getFirebaseConfigError } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    if (!isFirebaseConfigured()) {
      const errorMsg = getFirebaseConfigError() || 'Firebase is not configured. Please check your .env file and restart the development server.';
      throw new Error(errorMsg);
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      displayName,
      createdAt: new Date().toISOString(),
      profileComplete: false
    });
    
    return userCredential;
  };

  // Sign in with email and password
  const login = (email, password) => {
    if (!isFirebaseConfigured()) {
      const errorMsg = getFirebaseConfigError() || 'Firebase is not configured. Please check your .env file and restart the development server.';
      return Promise.reject(new Error(errorMsg));
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      const errorMsg = getFirebaseConfigError() || 'Firebase is not configured. Please check your .env file and restart the development server.';
      throw new Error(errorMsg);
    }
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
          profileComplete: false
        });
      }
      
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      // Re-throw with more helpful message
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains');
      }
      throw error;
    }
  };

  // Logout
  const logout = () => {
    if (!isFirebaseConfigured()) {
      const errorMsg = getFirebaseConfigError() || 'Firebase is not configured. Please check your .env file and restart the development server.';
      return Promise.reject(new Error(errorMsg));
    }
    return signOut(auth);
  };

  // Send password reset email
  const resetPassword = (email) => {
    if (!isFirebaseConfigured()) {
      const errorMsg = getFirebaseConfigError() || 'Firebase is not configured. Please check your .env file and restart the development server.';
      return Promise.reject(new Error(errorMsg));
    }
    return sendPasswordResetEmail(auth, email);
  };

  // Confirm password reset (used when user clicks link in email)
  const confirmResetPassword = (oobCode, newPassword) => {
    if (!isFirebaseConfigured()) {
      const errorMsg = getFirebaseConfigError() || 'Firebase is not configured. Please check your .env file and restart the development server.';
      return Promise.reject(new Error(errorMsg));
    }
    return confirmPasswordReset(auth, oobCode, newPassword);
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    if (!uid) return null;
    if (!isFirebaseConfigured()) {
      console.warn('Firebase is not configured. Cannot fetch user profile.');
      return null;
    }
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  };

  // Listen to auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      // If Firebase is not configured, set loading to false and don't set up listener
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    signInWithGoogle,
    fetchUserProfile,
    resetPassword,
    confirmResetPassword,
    loading,
    isFirebaseConfigured: isFirebaseConfigured()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
