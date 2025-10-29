# ✅ Complete Setup Checklist

Follow these steps in order to get your Lenzli MVP running!

## 📋 Before You Start

Make sure you have:
- [ ] Node.js installed
- [ ] A code editor open
- [ ] Internet connection

---

## Step 1: Create Firebase Project (15 min)

### 1.1 Create Project
1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name: `lenzli` (or whatever you want)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 1.2 Enable Authentication
1. In Firebase console → **Authentication**
2. Click **"Get started"**
3. Enable **"Email/Password"** provider
4. Enable **"Google"** provider
   - Add your email as support email
5. Click **"Save"**

### 1.3 Create Firestore Database
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose location (closest to your users)
5. Click **"Enable"**

### 1.4 Set Firestore Security Rules
1. In Firestore → **Rules** tab
2. Replace everything with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /connections/{connectionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### 1.5 Get Your Firebase Config
1. Click gear icon ⚙️ → **Project Settings**
2. Scroll down to **"Your apps"**
3. Click web icon **`</>`**
4. Register app: `lenzli-web`
5. **COPY** the firebaseConfig values (you'll need these!)

---

## Step 2: Create Cloudinary Account (5 min)

### 2.1 Sign Up
1. Go to https://cloudinary.com/users/register_free
2. Sign up with email (no credit card needed!)
3. Verify your email

### 2.2 Get Your Cloud Name
1. After login, look at your dashboard
2. At the top, you'll see: **"Cloud name: xxxxxxx"**
3. **COPY** that value (e.g., `dq6jxyz12`)

**That's all you need from Cloudinary!** No upload preset required.

---

## Step 3: Configure Your Project (2 min)

### 3.1 Create .env File

In your project folder, create a file called `.env` (exactly that name, no extension):

```bash
# In terminal:
touch .env
```

### 3.2 Add Your Credentials

Open `.env` and paste this, replacing with YOUR values:

```env
# Firebase Config (from Step 1.5)
VITE_FIREBASE_API_KEY=AIzaSyBY0Lu6IPM5B8x-Kv108dRbBygIQ19jS9g
VITE_FIREBASE_AUTH_DOMAIN=lenzli.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lenzli
VITE_FIREBASE_STORAGE_BUCKET=lenzli.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=300724261801
VITE_FIREBASE_APP_ID=1:300724261801:web:3cc481cd50201f03e4aab8

# Cloudinary Config (from Step 2.2)
VITE_CLOUDINARY_CLOUD_NAME=dow1ho8si
```

**IMPORTANT:** 
- Remove the word "your-" and replace with actual values!
- No quotes around values
- No spaces around the `=` sign
- Save the file!

---

## Step 4: Install & Run (1 min)

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.4.20  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 4.3 Open in Browser

Go to: **http://localhost:5173**

---

## Step 5: Test Everything! 🧪

### Test 1: Landing Page
- [ ] Page loads without errors
- [ ] You see the Lenzli landing page
- [ ] Navigation works
- [ ] Click "Sign Up" button

### Test 2: Sign Up
- [ ] Enter email, password, name
- [ ] Click "Sign up"
- [ ] Should redirect to profile setup

### Test 3: Profile Setup
- [ ] Step 1: Select a role (e.g., "Photographer")
- [ ] Step 2: Add bio and location
- [ ] Step 3: Select gear and specialties
- [ ] Step 4: Upload 1-2 test images
- [ ] Complete profile

### Test 4: Discover Feature
- [ ] Should see empty state (no other users yet)
- [ ] Create another test account to see the swipe feature

### Test 5: Profile View
- [ ] Click "Profile" in navigation
- [ ] Should see your profile
- [ ] Should see uploaded images

---

## ✅ Success Checklist

Everything works if you can:
- [x] Sign up with email
- [x] Complete profile setup
- [x] Upload portfolio images
- [x] View your profile
- [x] Log out and log back in

---

## 🚨 Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"
**Solution:** Check your `.env` file has correct Firebase values

### Error: "Module not found" or build errors
**Solution:** 
```bash
rm -rf node_modules
npm install
```

### Images not uploading
**Solution:** 
1. Check Cloudinary cloud name in `.env` is correct
2. Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### Can't sign up
**Solution:** Check Firebase Authentication is enabled

### "Missing permissions" error
**Solution:** Check Firestore security rules are set correctly

### Dev server shows old errors
**Solution:**
1. Stop the server (Ctrl+C)
2. Run: `npm run dev` again
3. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

---

## 📝 Quick Reference

### Your .env File Should Look Like:

```env
VITE_FIREBASE_API_KEY=AIzaSyC_1234567890abcdefgh
VITE_FIREBASE_AUTH_DOMAIN=lenzli-abc123.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lenzli-abc123
VITE_FIREBASE_STORAGE_BUCKET=lenzli-abc123.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
VITE_CLOUDINARY_CLOUD_NAME=dq6abc123
```

### Commands Cheat Sheet:

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Stop dev server
Ctrl+C (or Cmd+C on Mac)

# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run dev
```

---

## 🎯 What You're Testing

Your MVP includes:

1. **Landing Page** - Beautiful homepage
2. **Authentication** - Sign up, login, Google OAuth
3. **Profile Setup** - 4-step onboarding with image uploads
4. **Discover** - Tinder-style swipe feature
5. **Connections** - View saved connections
6. **Profiles** - View and edit profiles

---

## 🎉 Ready to Deploy?

Once everything works locally, see:
- **`DEPLOYMENT.md`** - Deploy to Vercel
- **`MVP-SETUP.md`** - Full documentation

---

## 💡 Next Steps After Testing

1. **Add more test users** to see the discover feature work
2. **Customize** the gear/specialty options
3. **Deploy** to production
4. **Share** with photographers!

---

**Need help?** Check the error message and look in the Troubleshooting section above!

Good luck! 🚀

