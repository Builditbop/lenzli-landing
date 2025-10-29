# 🤖 Demo Profiles - Quick Setup Guide

## 🎯 **Why Demo Profiles?**

When you first launch Lenzli, you won't have real users yet. Demo profiles solve this by:

- ✅ **Show how the app works** - New users can swipe and explore
- ✅ **Test the full experience** - See matching, connections, messaging
- ✅ **Create social proof** - App feels active and populated
- ✅ **Get feedback** - Show investors/beta testers a working product
- ✅ **Onboard users smoothly** - They understand the interface immediately

---

## 🚀 **Quick Setup (2 Minutes)**

### **Step 1: Log In**
1. Go to your site: http://localhost:5174 (or your Vercel URL)
2. Log in with your account

### **Step 2: Go to Seed Page**
Type this URL in your browser:
```
http://localhost:5174/seed-database
```

Or on production:
```
https://your-vercel-url.vercel.app/seed-database
```

### **Step 3: Click "Seed Demo Profiles"**
1. Click the green **"🌱 Seed Demo Profiles"** button
2. Wait 10-20 seconds
3. See confirmation: "✅ Successfully seeded 24 demo profiles!"

### **Step 4: Test Discover**
1. Go to **Discover** page
2. Start swiping!
3. You'll see realistic photographer profiles

---

## 👥 **What Gets Created**

### **24 Realistic Profiles Including:**

**1. Alex Martinez** - Wedding Photographer (LA)
- Sony A7SIII, 85mm f/1.4
- Specializes in weddings, portraits, events
- 10 years experience

**2. Jordan Chen** - Cinematographer (NYC)
- Canon C70, Canon R5, DJI RS3
- Commercial and music videos
- 12 years experience, expert level

**3. Maya Patel** - Street Photographer (SF)
- Fuji X-T5, 35mm f/1.4
- Street, documentary, portrait
- Fine art and reportage style

**4. Sam Taylor** - Adventure Filmmaker (Denver)
- Sony FX3, DJI Mavic 3
- Sports, automotive, documentary
- Drone operator

**5. Riley Kim** - Fashion Photographer (Miami)
- Canon R5, Profoto B10
- Fashion, portrait, commercial
- Published in Vogue, Elle

**6. Chris Anderson** - Music Video Director (Atlanta)
- RED Komodo, Canon C300
- Music videos, documentaries
- 9 years experience

**7. Emma Rodriguez** - Real Estate Photographer (Austin)
- Nikon Z9, 14-24mm f/2.8
- Real estate, product, commercial

**8. Marcus Johnson** - Gaffer (LA)
- Aputure 600D, ARRI Skypanel
- Lighting specialist, 12+ years

**9. Zoe Williams** - Food Photographer (Portland)
- Sony A7RV, 50mm f/1.4
- Food, product, commercial

**10. Dev Singh** - Documentary Cinematographer (Brooklyn)
- Blackmagic Pocket 6K, DJI Ronin
- Indie films and documentaries

**...plus 14 more generated profiles!**

---

## ✨ **Profile Features**

Each demo profile includes:
- ✅ Realistic name and photo
- ✅ Professional bio
- ✅ Real city location
- ✅ Camera gear (2-5 items)
- ✅ Specialties and styles
- ✅ Skill level and experience
- ✅ Portfolio images (from Unsplash)
- ✅ Instagram handles
- ✅ Some have websites
- ✅ Availability status

---

## 🎨 **Diverse Profiles**

Profiles represent different:
- **Roles**: Photographers, Videographers, Cinematographers, Gaffers, Directors, Editors
- **Cities**: LA, NYC, SF, Denver, Miami, Atlanta, Austin, Chicago, Seattle, Portland
- **Specialties**: Wedding, Fashion, Street, Real Estate, Food, Automotive, Music Video
- **Skill Levels**: Intermediate to Expert
- **Gear**: Sony, Canon, RED, ARRI, Fuji, Nikon, Blackmagic, DJI

**Looks like a real, thriving community!**

---

## 🔍 **Identifying Demo Profiles**

All demo profiles have:
```javascript
{
  isDemo: true,
  email: "demo_*@lenzli.app"
}
```

This lets you:
- Filter them out in queries if needed
- Show a "Demo Profile" badge (optional)
- Exclude from analytics
- Delete them all at once later

---

## 🧪 **Testing with Demo Profiles**

### Test Discovery:
1. Go to Discover
2. Swipe through 24 different creators
3. See variety of roles, gear, locations
4. Test match notifications

### Test Connections:
1. Swipe right on several demo profiles
2. Go to Connections
3. See your saved connections
4. View their full profiles

### Test Messaging:
1. Connect with demo profiles
2. Try sending messages
3. (Demo profiles won't message back - they're not real accounts)

### Show to Others:
1. Create a test account for a friend
2. They can browse demo profiles
3. Shows them how swiping works
4. Demonstrates the full experience

---

## 🎯 **Use Cases**

### **For Testing:**
- Test swipe mechanics
- Test matching algorithm
- Test connection system
- Test profile viewing
- Test filters (when you add them)

### **For Demos:**
- Show investors
- Onboard beta testers
- Screenshots for marketing
- User testing sessions
- Product demos

### **For Launch:**
- Day 1 users have profiles to browse
- New users understand the interface
- App feels active from the start
- Social proof

---

## 🗑️ **Removing Demo Profiles Later**

### **Option 1: Firebase Console**
1. Go to Firestore Database
2. Query: `isDemo == true`
3. Select all
4. Delete

### **Option 2: Keep Them**
- Demo profiles are harmless
- Mark them as "Lenzli Team" or "Featured Creator"
- They help fill out the experience
- Real users can still swipe past them

### **Option 3: Filter in Queries**
Update Discover query to exclude demos:
```javascript
where('profileComplete', '==', true),
where('isDemo', '==', false)  // Add this line
```

---

## ⚙️ **Customization**

Want to modify demo profiles?

**File:** `src/utils/seedData.js`

You can:
- Change names, bios, locations
- Add more profiles to the array
- Modify gear and specialties
- Use different images
- Adjust the `generateMoreDemoProfiles()` function

---

## 📸 **Images Used**

All images are from **Unsplash** (free to use):
- High quality
- Professional photography
- Royalty-free
- Appropriate content
- Various styles and subjects

---

## 🎨 **Profile Diversity**

The 24 profiles include:
- **8 Photographers** (various specialties)
- **5 Videographers/Cinematographers**
- **2 Directors**
- **1 Gaffer**
- **1 Editor**
- **7 General creators**

**Locations span 10+ cities across the US**

---

## 🚨 **Important Notes**

1. **Run once** - Re-running will overwrite existing demos
2. **Not real accounts** - They can't log in or message
3. **Safe for production** - Marked clearly as demos
4. **Easy to remove** - Query by `isDemo: true`
5. **No additional cost** - Just Firestore storage

---

## ✅ **Quick Commands**

### **Seed Profiles:**
1. Log in to your app
2. Go to: `/seed-database`
3. Click "Seed Demo Profiles"
4. Wait for confirmation
5. Go to Discover → See profiles!

### **Access URL:**
```
http://localhost:5174/seed-database    (local)
https://lenzli.com/seed-database        (production)
```

---

## 🎊 **After Seeding**

You'll have:
- ✅ 24 diverse photographer profiles
- ✅ Realistic bios and credentials
- ✅ Professional portfolio images
- ✅ Variety of gear and specialties
- ✅ Different skill levels
- ✅ Multiple cities represented

**Your app will feel alive and active!**

---

## 📊 **What Happens**

When you seed:
1. ✅ 24 profiles added to `users` collection
2. ✅ Each has unique ID (`demo_firstname_lastname`)
3. ✅ All marked with `isDemo: true`
4. ✅ All have `profileComplete: true`
5. ✅ Instantly appear in Discover
6. ✅ Can be swiped, matched, connected

---

## 💡 **Pro Tips**

1. **Seed early** - Before showing anyone the app
2. **Show variety** - Demonstrates all features
3. **Update regularly** - Add new demo profiles as you add features
4. **Use for screenshots** - Great for marketing materials
5. **Test with friends** - Let them swipe on real-looking profiles

---

## 🚀 **Next Steps**

1. **Seed demo profiles** → Go to `/seed-database`
2. **Test Discover** → Swipe through profiles
3. **Show to users** → They'll understand immediately
4. **Launch publicly** → App feels populated from day 1

---

## 🎯 **You're All Set!**

With demo profiles, you can:
- ✅ Demo the app to anyone
- ✅ Test all features thoroughly
- ✅ Get user feedback
- ✅ Launch with an active-feeling platform

**Go to `/seed-database` and click the button!** 🌱

---

Need help? All demo profile data is in `src/utils/seedData.js`

