# 🔧 Fix Google Login Error

## ❌ **The Error**

If you see an error like:
- "auth/unauthorized-domain"
- "This domain is not authorized"
- Firewall or security error
- Popup blocked

**This means:** Your domain isn't authorized in Firebase for Google OAuth.

---

## ✅ **The Fix (2 Minutes)**

### **Step 1: Go to Firebase Console**

1. Open: https://console.firebase.google.com/
2. Click your **"lenzli"** project

### **Step 2: Add Authorized Domains**

1. Click **"Authentication"** in the left sidebar
2. Click the **"Settings"** tab (at the top, next to "Sign-in method")
3. Scroll down to **"Authorized domains"** section
4. You should see `localhost` already there

### **Step 3: Add Your Domains**

Click **"Add domain"** and add these one by one:

**For Local Development:**
```
localhost
```

**For Vercel Deployment:**
```
lenzli-landing-co6pmjd48-builditbops-projects.vercel.app
```

**For Custom Domain (if you added it):**
```
lenzli.com
www.lenzli.com
```

### **Step 4: Save**

Click **"Add"** for each domain. They'll appear in the list below.

### **Step 5: Test Again**

1. Go back to your site
2. Refresh the page (Cmd+R or Ctrl+R)
3. Try "Sign in with Google" again
4. Should work now! ✅

---

## 🎯 **Alternative: Use Email Login**

While fixing Google login, you can still use:
- ✅ Email/password signup
- ✅ Email/password login

These work without any additional configuration!

---

## 🚨 **Common Issues**

### **Error: "auth/popup-blocked"**
**Solution:** Allow popups in your browser
- Safari: Preferences → Websites → Pop-up Windows → Allow for localhost
- Chrome: Click the popup icon in address bar

### **Error: "auth/cancelled-popup-request"**
**Solution:** User closed the popup
- Try again
- Make sure to select a Google account

### **Error: "auth/unauthorized-domain"**
**Solution:** Add domain to authorized domains (see above)

---

## 📋 **Checklist**

- [ ] Opened Firebase Console
- [ ] Went to Authentication → Settings
- [ ] Found "Authorized domains" section
- [ ] Added `localhost` (if not there)
- [ ] Added your Vercel domain
- [ ] Added lenzli.com (if using custom domain)
- [ ] Saved all domains
- [ ] Refreshed browser
- [ ] Tested Google login

---

## 🔍 **Verify Your Setup**

### **In Firebase Console:**

**Authentication → Sign-in method:**
- ✅ Email/Password: **Enabled**
- ✅ Google: **Enabled** with support email

**Authentication → Settings:**
- ✅ Authorized domains: Lists `localhost` and your deployment URLs

---

## 💡 **Why This Happens**

Firebase requires you to explicitly authorize which domains can use OAuth:
- ✅ Prevents unauthorized sites from using your Firebase project
- ✅ Security feature to protect your app
- ✅ You control which URLs can authenticate users

---

## ✅ **After Fix**

Google login will:
- ✅ Open popup window
- ✅ Let user select Google account
- ✅ Sign in successfully
- ✅ Create profile automatically
- ✅ Redirect to profile setup

---

## 🎯 **Quick Test**

1. Fix authorized domains (above)
2. Go to your site
3. Click "Sign in with Google"
4. Should see Google account picker
5. Select account
6. Should redirect to profile setup

---

**Still not working?** Check the browser console for the exact error message and let me know!

The error message will now show on the page itself with helpful info! 🚀

