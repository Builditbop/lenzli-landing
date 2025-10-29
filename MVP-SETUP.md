# 🚀 Lenzli MVP Setup Guide

Your Lenzli MVP is ready! This guide will help you set up Firebase and deploy the full application.

## ✨ What's Built

Your MVP includes:

✅ **Authentication System**
- Email/password signup and login
- Google OAuth integration
- Protected routes

✅ **User Profiles**
- Complete profile setup flow
- Portfolio image uploads
- Gear and specialty tags
- Location and bio

✅ **Discover Feature (Tinder-style)**
- Swipe left to pass, right to connect
- Card stack with smooth animations
- Auto-matching when both users connect

✅ **Connections System**
- View all your connections
- Profile viewing
- Connection history

✅ **Profile Management**
- View and edit your own profile
- View other creators' profiles
- Portfolio gallery

## 🔥 Firebase Setup (Required)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name: **lenzli** (or your choice)
4. Disable Google Analytics (optional for MVP)
5. Click **"Create Project"**

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get Started"**
3. Enable **Email/Password** provider
4. Enable **Google** provider
   - Add your support email
   - Save

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select a location (choose closest to your users)
5. Click **"Enable"**

### Step 4: Set Up Firestore Rules

In Firestore Database → Rules tab, paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all profiles but only write their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Connections - users can only create/read their own connections
    match /connections/{connectionId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.creatorId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

Click **"Publish"**

### Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click the web icon **"</>"** to add a web app
4. Register app name: **lenzli-web**
5. Copy the `firebaseConfig` object

## 📸 Image Storage Setup (Cloudinary - Free!)

**Important:** We're using Cloudinary instead of Firebase Storage because it's **100% free** and doesn't require billing upgrade.

Follow the guide: **`CLOUDINARY-SETUP.md`** (5 minutes)

Quick steps:
1. Create free account at https://cloudinary.com/users/register_free
2. Get your Cloud Name from dashboard
3. Create upload preset (name: `lenzli_uploads`, mode: Unsigned)
4. Add to `.env` file

### Step 6: Add All Config to Your Project

1. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

2. Open `.env` and add your Firebase config values:

```env
# Firebase (Auth & Database)
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# Cloudinary (Image Storage - No billing required!)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=lenzli_uploads
```

## 🏃 Running Locally

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173

## 🧪 Testing the MVP

### 1. Test Authentication
- Sign up with a new account
- Log in with existing account
- Try Google sign-in

### 2. Test Profile Creation
- Complete the 4-step profile setup
- Upload portfolio images
- Add gear and specialties

### 3. Test Discover Feature
- Swipe through creators
- Connect with some creators
- View the connections page

### 4. Test Profiles
- View your own profile
- View other creators' profiles from connections
- Edit your profile

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)

```bash
# Deploy to Vercel
npx vercel --prod

# Add environment variables in Vercel Dashboard:
# Settings → Environment Variables
# Add all your VITE_FIREBASE_* variables
```

### Option 2: Netlify

```bash
# Build the project
npm run build

# Deploy
npx netlify deploy --prod --dir=dist

# Add environment variables in Netlify Dashboard:
# Site settings → Build & deploy → Environment
```

### Option 3: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## 🔐 Environment Variables for Production

In your hosting platform (Vercel/Netlify), add these environment variables:

```
# Firebase
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=xxx
VITE_CLOUDINARY_UPLOAD_PRESET=lenzli_uploads
```

## 📊 Data Structure

### Users Collection (`users/{userId}`)
```javascript
{
  uid: "string",
  email: "string",
  displayName: "string",
  photoURL: "string" (optional),
  role: "Photographer" | "Videographer" | etc.,
  bio: "string",
  location: "string",
  gear: ["Sony A7SIII", ...],
  specialties: ["Wedding", "Portrait", ...],
  portfolioImages: ["url1", "url2", ...],
  availability: boolean,
  profileComplete: boolean,
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

### Connections Collection (`connections/{connectionId}`)
```javascript
{
  userId: "user1_uid",
  creatorId: "user2_uid",
  status: "pending" | "matched",
  createdAt: "ISO date"
}
```

## 🎯 Next Features to Add

Want to expand your MVP? Here are suggested features:

### Phase 2 - Messaging
- [ ] Real-time chat between connections
- [ ] Message notifications
- [ ] Image sharing in messages

### Phase 3 - Help Pings
- [ ] Post real-time crew needs
- [ ] Location-based filtering
- [ ] Role-specific pings

### Phase 4 - Enhanced Discovery
- [ ] Advanced filtering (gear, location, style)
- [ ] Search functionality
- [ ] Recommendations based on preferences

### Phase 5 - Collaboration Tools
- [ ] Project boards
- [ ] File sharing
- [ ] Calendar integration

## 🐛 Troubleshooting

### Firebase Errors

**"Firebase: Error (auth/api-key-not-valid)"**
- Check your `.env` file has correct Firebase config
- Make sure you're using `VITE_` prefix for all variables
- Restart dev server after changing `.env`

**"Missing or insufficient permissions"**
- Check Firestore rules are properly set
- Make sure user is authenticated

**"Image upload failed"**
- Check Cloudinary credentials in `.env`
- Make sure upload preset is set to "Unsigned"
- Verify file type is image/*
- Restart dev server after changing `.env`

### Development Issues

**"Module not found"**
```bash
rm -rf node_modules
npm install
```

**Changes not reflecting**
```bash
# Clear cache and restart
rm -rf dist .vite
npm run dev
```

## 📧 Support

Need help? Issues with:
- Firebase setup → Check [Firebase Docs](https://firebase.google.com/docs)
- React/Vite → Check [Vite Docs](https://vitejs.dev)
- Deployment → See `DEPLOYMENT.md`

## 🎉 You're All Set!

Your Lenzli MVP is ready to launch! The core features are built:
- ✅ User authentication
- ✅ Profile creation
- ✅ Swipe to discover
- ✅ Connections management
- ✅ Profile viewing

**Time to get your first users!** 🚀

---

Made with ❤️ for visual creators everywhere

