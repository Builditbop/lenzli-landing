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
    .filter(([key, value]) => !value || value.includes('your-'))
    .map(([key]) => `VITE_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, '_$1').slice(1)}`);

  if (missingVars.length > 0) {
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
    
    if (import.meta.env.DEV) {
      console.error(errorMessage);
      throw new Error('Firebase configuration is missing. Check console for details.');
    } else {
      // In production, throw error to prevent silent failures
      throw new Error('Firebase configuration is missing. Please check environment variables.');
    }
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

// Initialize Firebase
let app;
let auth;
let db;

try {
  const firebaseConfig = getFirebaseConfig();
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

// Note: Using Cloudinary for image storage instead of Firebase Storage (no billing required)

export { auth, db };
export default app;