# 🗺️ Lenzli Development Roadmap

Current status and prioritized next steps for Lenzli development.

---

## ✅ **Completed Features**

### Core Platform
- ✅ Landing page with email waitlist
- ✅ Authentication (Email + Google OAuth)
- ✅ Profile system (15+ fields, comprehensive)
- ✅ Discovery/swipe feature (Tinder-style)
- ✅ Connections management
- ✅ Real-time messaging
- ✅ NSFW detection (Cloudinary)
- ✅ Notification system
- ✅ Firebase configuration fixes
- ✅ Deployment to Vercel

### Technical Infrastructure
- ✅ Firebase setup (Auth + Firestore)
- ✅ Cloudinary image storage
- ✅ Environment variable validation
- ✅ Error handling
- ✅ Mobile responsive design

---

## 🎯 **Current Priority: Critical Next Steps**

### 🔴 **Priority 1: User Safety Features** (HIGH PRIORITY)

**Status:** ❌ Not implemented
**Estimated Time:** 4-6 hours

**Features Needed:**
- [ ] **User Blocking**
  - Block users from messaging/viewing profile
  - Hide blocked users from discovery
  - Show blocked users list in settings
  
- [ ] **User Reporting**
  - Report inappropriate behavior
  - Report spam/fake profiles
  - Report NSFW content
  - Admin notification system
  
- [ ] **Privacy Controls**
  - Hide profile from discovery
  - Control who can message you
  - Block specific users

**Why Critical:** Essential for platform safety and user trust. Prevents abuse and maintains community standards.

**Implementation Plan:**
1. Add `blockedUsers` array to user profile
2. Add `reports` collection in Firestore
3. Create blocking UI in profile/messages
4. Create reporting modal/form
5. Update discovery to filter blocked users
6. Update messaging to prevent blocked users

---

### 🟡 **Priority 2: Search & Filtering** (HIGH PRIORITY)

**Status:** ❌ Basic only
**Estimated Time:** 6-8 hours

**Features Needed:**
- [ ] **Advanced Search**
  - Search by name, role, location
  - Search by gear/specialties
  - Search by photography style
  
- [ ] **Discovery Filters**
  - Filter by role
  - Filter by location (radius)
  - Filter by gear
  - Filter by specialties
  - Filter by skill level
  - Filter by availability
  
- [ ] **Saved Searches**
  - Save filter combinations
  - Quick access to saved searches

**Why Important:** Improves user experience and helps users find relevant connections faster.

**Implementation Plan:**
1. Add search bar to Discover page
2. Create filter sidebar/modal
3. Update Firestore queries with filters
4. Add saved searches to user profile
5. Create saved searches UI

---

### 🟡 **Priority 3: Messaging Enhancements** (MEDIUM PRIORITY)

**Status:** ⚠️ Basic implementation
**Estimated Time:** 4-6 hours

**Features Needed:**
- [ ] **Read Receipts**
  - Show when message is read
  - Timestamp of read time
  - Visual indicators
  
- [ ] **Message Status**
  - Sent ✓
  - Delivered ✓✓
  - Read ✓✓ (blue)
  
- [ ] **Image Sharing in Messages**
  - Upload images in chat
  - Image preview
  - NSFW detection for message images

**Why Important:** Improves messaging UX and user engagement.

**Implementation Plan:**
1. Add `readBy` tracking (already in schema)
  - Update on message view
  - Show read status in UI
2. Add image upload to message input
3. Use existing NSFW detection
4. Update message UI with status indicators

---

### 🟢 **Priority 4: Profile Enhancements** (MEDIUM PRIORITY)

**Status:** ⚠️ Good but can improve
**Estimated Time:** 3-4 hours

**Features Needed:**
- [ ] **Profile Views**
  - Track who viewed your profile
  - Show view count
  - Recent viewers (optional)
  
- [ ] **Profile Analytics**
  - Views count
  - Swipe right rate
  - Match rate
  - Message response rate

**Why Important:** Helps users understand their profile performance.

---

### 🟢 **Priority 5: Discovery Improvements** (MEDIUM PRIORITY)

**Status:** ⚠️ Basic implementation
**Estimated Time:** 4-5 hours

**Features Needed:**
- [ ] **Undo Swipe**
  - Undo last swipe action
  - Limited to last action only
  
- [ ] **Super Like**
  - Highlight your interest
  - Notify user of super like
  
- [ ] **Profile Preview**
  - Quick view without full swipe
  - See more images
  - View full profile

**Why Important:** Improves discovery UX and user engagement.

---

## 📋 **Recommended Development Order**

### Week 1: Critical Infrastructure
1. 🔴 User blocking & reporting (4-6 hours)
2. 🔴 Basic search functionality (3-4 hours)

### Week 2: Core Features
3. 🟡 Advanced filtering (3-4 hours)
4. 🟡 Read receipts (2-3 hours)
5. 🟡 Image sharing in messages (2-3 hours)

### Week 3: Enhancements
6. 🟢 Profile analytics (2-3 hours)
7. 🟢 Discovery improvements (3-4 hours)
8. 🟢 Saved searches (2-3 hours)

---

## 🚀 **Quick Wins** (Can be done anytime)

These are small improvements that can be done quickly:

- [ ] **Typing Indicators** (Already partially implemented)
  - Show when user is typing
  - Visual indicator in chat
  
- [ ] **Message Reactions**
  - Emoji reactions to messages
  - Quick feedback
  
- [ ] **Connection Notes**
  - Add notes to connections
  - Remember context
  
- [ ] **Profile Verification**
  - Verified badge for professionals
  - Instagram verification link
  
- [ ] **Share Profile**
  - Share profile link
  - Social media sharing

---

## 🎯 **First Priority Recommendation**

### **Start with: User Safety Features (Priority 1)**

**Why this should be first:**

1. **Legal/Compliance:** Essential for platform safety
2. **User Trust:** Users need to feel safe
3. **Prevents Issues:** Better to have before problems arise
4. **Foundation:** Other features depend on blocking/reporting

**After that:**
- Search & filtering (improves core discovery feature)

---

## 📊 **Feature Impact Matrix**

| Feature | User Impact | Development Time | Priority |
|---------|-------------|------------------|----------|
| User Blocking/Reporting | 🔴 Critical | 4-6 hours | P1 |
| Search & Filtering | 🟡 High | 6-8 hours | P2 |
| Read Receipts | 🟢 Medium | 2-3 hours | P3 |
| Image Sharing | 🟢 Medium | 2-3 hours | P3 |
| Profile Analytics | 🟢 Low | 2-3 hours | P4 |

---

## 🧪 **Testing Priorities**

After implementing each feature:

1. **User Safety:**
   - Test blocking functionality
   - Test reporting flow
   - Verify blocked users are hidden
   - Test admin notifications

2. **Search:**
   - Test all filter combinations
   - Test search accuracy
   - Test performance with many users
   - Test saved searches

3. **Messaging:**
   - Test read receipts accuracy
   - Test image uploads
   - Test NSFW detection in messages
   - Test message status indicators

---

## 📝 **Notes**

- All features should maintain mobile responsiveness
- All features should follow existing code patterns
- Security should be considered for all new features

---

## 🎉 **Current Status Summary**

**Completed:** 90% of MVP features
**Next Up:** User safety features

**You have a production-ready platform!** Focus on safety features first, then enhancements.

---

**Questions?** Review this roadmap and prioritize based on your specific needs!

