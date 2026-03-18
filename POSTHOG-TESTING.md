# 🧪 PostHog Testing Guide

Step-by-step guide to test and verify PostHog analytics integration.

---

## ✅ Pre-Testing Checklist

Before testing, make sure:

- [ ] PostHog account created
- [ ] API key added to `.env` file
- [ ] Dev server restarted after adding API key
- [ ] Browser console shows "PostHog initialized successfully"
- [ ] PostHog dashboard is open in another tab

---

## 🧪 Test 1: Basic Initialization

### Steps:
1. Open your app: `http://localhost:5173`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for: `PostHog initialized successfully`

### Expected Result:
✅ Console shows PostHog initialization message

### If Failed:
- Check `.env` file has `VITE_POSTHOG_KEY`
- Restart dev server
- Check API key is correct

---

## 🧪 Test 2: Landing Page Events

### Steps:
1. Visit landing page: `http://localhost:5173/`
2. Check PostHog dashboard → **Activity** tab
3. Look for: `landing_page_viewed`

### Expected Result:
✅ Event appears in PostHog Activity feed within 10-30 seconds

### Additional Tests:
- Click "Sign Up" button → Check for `cta_clicked` with `cta_type: "signup"`
- Click "Log In" button → Check for `cta_clicked` with `cta_type: "login"`
- Submit waitlist email → Check for `waitlist_signup`

---

## 🧪 Test 3: Authentication Events

### Steps:
1. Go to Sign Up page
2. Create a test account
3. Check PostHog dashboard

### Expected Events:
- ✅ `signup_completed` with `method: "email"`
- ✅ User identified in PostHog (check user properties)

### Additional Tests:
- Try Google signup → Check for `signup_completed` with `method: "google"`
- Try invalid signup → Check for `signup_failed`
- Log in → Check for `login_successful`
- Log out → Check for `logout_clicked`

---

## 🧪 Test 4: Profile Setup Events

### Steps:
1. Complete profile setup (all 4 steps)
2. Upload at least 1 image
3. Complete profile
4. Check PostHog dashboard

### Expected Events:
- ✅ `image_uploaded` (when uploading images)
- ✅ `profile_completed` (when completing profile)
- ✅ Event includes metadata: `role`, `gear_count`, `portfolio_images_count`, etc.

### Additional Tests:
- Edit profile → Check for `profile_updated`
- Upload more images → Check for `image_uploaded` with `context: "edit_profile"`

---

## 🧪 Test 5: Discovery Events

### Steps:
1. Go to Discover page
2. Swipe left on a card
3. Swipe right on another card
4. Check PostHog dashboard

### Expected Events:
- ✅ `discover_page_viewed` (on page load)
- ✅ `swipe_left` (when swiping left)
- ✅ `swipe_right` (when swiping right)
- ✅ `match_created` (if mutual connection)

### Additional Tests:
- Click "Profile" button → Check for `profile_viewed` with `context: "discover"`
- View multiple profiles → Multiple `profile_viewed` events

---

## 🧪 Test 6: Messaging Events

### Steps:
1. Go to Messages page
2. Open a chat
3. Send a message
4. Check PostHog dashboard

### Expected Events:
- ✅ `messages_page_viewed` (on page load)
- ✅ `chat_opened` (when opening chat)
- ✅ `message_sent` (when sending message)
- ✅ Event includes: `has_text`, `has_image`, `message_length`

### Additional Tests:
- Send image message → Check `has_image: true`
- Open multiple chats → Multiple `chat_opened` events

---

## 🧪 Test 7: Connections Events

### Steps:
1. Go to Connections page
2. Click on a connection
3. Check PostHog dashboard

### Expected Events:
- ✅ `connections_page_viewed` (on page load)
- ✅ `connections_loaded` (with `connections_count`)
- ✅ `connection_viewed` (when clicking connection)

---

## 🔍 Verifying Events in PostHog

### Method 1: Activity Feed

1. Go to PostHog dashboard
2. Click **"Activity"** in left sidebar
3. Events appear in real-time (may take 10-30 seconds)
4. Click on any event to see properties

### Method 2: Events Explorer

1. Go to **"Events"** → **"Events Explorer"**
2. Filter by event name (e.g., `signup_completed`)
3. See all instances of that event
4. View properties for each event

### Method 3: Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by "posthog"
4. See API requests being sent
5. Check request payload for event data

---

## 🐛 Debugging Tips

### Events Not Appearing?

1. **Check Console**
   ```
   Should see: "PostHog initialized successfully"
   Should NOT see: "PostHog key not found"
   ```

2. **Check Network Requests**
   - Open DevTools → Network tab
   - Filter by "posthog"
   - Should see POST requests to PostHog API
   - Status should be 200 (success)

3. **Check Environment Variables**
   ```bash
   # In terminal, check if env vars are loaded:
   echo $VITE_POSTHOG_KEY
   # Should show your key (or empty if not set)
   ```

4. **Verify API Key**
   - Make sure key starts with `phc_`
   - No extra spaces or quotes
   - Key is in `.env` file (not `.env.example`)

5. **Check PostHog Dashboard**
   - Make sure you're looking at the right project
   - Check Activity tab (not Insights)
   - Events may take 10-30 seconds to appear

---

## ✅ Complete Test Checklist

Run through all these tests to verify everything works:

### Landing Page
- [ ] `landing_page_viewed` appears
- [ ] `cta_clicked` appears when clicking buttons
- [ ] `waitlist_signup` appears when submitting email

### Authentication
- [ ] `signup_completed` appears after signup
- [ ] `login_successful` appears after login
- [ ] `logout_clicked` appears after logout
- [ ] User is identified in PostHog

### Profile
- [ ] `profile_completed` appears after setup
- [ ] `image_uploaded` appears when uploading
- [ ] `profile_updated` appears when editing
- [ ] `profile_page_viewed` appears when viewing

### Discovery
- [ ] `discover_page_viewed` appears
- [ ] `swipe_left` appears when swiping left
- [ ] `swipe_right` appears when swiping right
- [ ] `match_created` appears on match
- [ ] `profile_viewed` appears when viewing profile

### Messaging
- [ ] `messages_page_viewed` appears
- [ ] `chat_opened` appears when opening chat
- [ ] `message_sent` appears when sending message

### Connections
- [ ] `connections_page_viewed` appears
- [ ] `connections_loaded` appears with count
- [ ] `connection_viewed` appears when clicking

---

## 🎯 Quick Test Script

Run this quick test to verify basic functionality:

```javascript
// Open browser console and run:
// 1. Check if PostHog is loaded
console.log('PostHog loaded:', typeof posthog !== 'undefined');

// 2. Manually capture a test event
posthog.capture('test_event', { test: true });

// 3. Check PostHog dashboard for 'test_event'
```

---

## 📊 Expected Event Counts

After a full test session, you should see approximately:

- **Landing Page:** 1-3 events
- **Signup:** 1-2 events
- **Profile Setup:** 2-5 events (depending on images)
- **Discovery:** 3-10 events (depending on swipes)
- **Messaging:** 2-5 events
- **Connections:** 1-3 events

**Total:** ~15-30 events for a complete test session

---

## 🎉 Success Criteria

Your PostHog integration is working if:

✅ Console shows "PostHog initialized successfully"
✅ Events appear in PostHog Activity feed
✅ Events include correct properties
✅ User identification works (user properties set)
✅ No errors in console
✅ Network requests succeed (200 status)

---

## 📝 Test Results Template

Use this template to document your test results:

```
Date: ___________
PostHog Project: ___________
API Key: phc_... (first 10 chars)

Test Results:
- Landing Page: ✅ / ❌
- Authentication: ✅ / ❌
- Profile Setup: ✅ / ❌
- Discovery: ✅ / ❌
- Messaging: ✅ / ❌
- Connections: ✅ / ❌

Issues Found:
- [List any issues]

Notes:
- [Any additional notes]
```

---

## 🚀 Next Steps After Testing

Once testing is complete:

1. ✅ Create dashboards (see POSTHOG-DASHBOARDS.md)
2. ✅ Set up alerts for important metrics
3. ✅ Monitor events regularly
4. ✅ Use insights to improve features

---

**Need Help?** Check [POSTHOG-SETUP.md](./POSTHOG-SETUP.md) for setup instructions.

