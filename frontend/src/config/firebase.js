import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Get Firebase config from environment variables
// Get these from: https://console.firebase.google.com/
const getFirebaseConfig = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;

  // Validate required environment variables
  const requiredVars = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value || value.trim() === '' || value.includes('your-'))
    .map(([key]) => `VITE_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, '_$1').slice(1)}`);

  if (missingVars.length > 0) {
    return null; // Return null instead of throwing
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId
  };
};

// Initialize Firebase (non-blocking)
let app = null;
let auth = null;
let db = null;
let initializationError = null;

const initializeFirebase = () => {
  // If already initialized, return
  if (app && auth && db) {
    return true;
  }

  // If initialization failed before, return false
  if (initializationError) {
    return false;
  }

  try {
    const firebaseConfig = getFirebaseConfig();
    
    if (!firebaseConfig) {
      const missingVars = [];
      if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY.includes('your-')) missingVars.push('VITE_FIREBASE_API_KEY');
      if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN.includes('your-')) missingVars.push('VITE_FIREBASE_AUTH_DOMAIN');
      if (!import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID.includes('your-')) missingVars.push('VITE_FIREBASE_PROJECT_ID');
      if (!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET.includes('your-')) missingVars.push('VITE_FIREBASE_STORAGE_BUCKET');
      if (!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID.includes('your-')) missingVars.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
      if (!import.meta.env.VITE_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID.includes('your-')) missingVars.push('VITE_FIREBASE_APP_ID');

      const errorMessage = `
⚠️  Firebase Configuration Error

Missing or invalid environment variables:
${missingVars.map(v => `  - ${v}`).join('\n')}

Please:
1. Create a .env file in the project root (copy from env-example.txt)
2. Add your Firebase config values from Firebase Console
3. Restart your development server

Get your Firebase config from: https://console.firebase.google.com/
      `.trim();
      
      console.warn(errorMessage);
      initializationError = new Error('Firebase configuration is missing. Check console for details.');
      return false;
    }

    console.log('Initializing Firebase with config:', {
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId
    });
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      env: {
        hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
        hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID
      }
    });
    initializationError = error;
    return false;
  }
};

// Try to initialize Firebase on module load
initializeFirebase();

// Helper function to check if Firebase is configured
export const isFirebaseConfigured = () => {
  return app !== null && auth !== null && db !== null;
};

// Helper function to get Firebase configuration error message
export const getFirebaseConfigError = () => {
  if (isFirebaseConfigured()) {
    return null;
  }
  
  if (initializationError) {
    return initializationError.message;
  }
  
  return 'Firebase is not configured. Please check your .env file and restart the development server.';
};

// Note: Using Cloudinary for image storage instead of Firebase Storage (no billing required)

export { auth, db, initializeFirebase };
export default app;