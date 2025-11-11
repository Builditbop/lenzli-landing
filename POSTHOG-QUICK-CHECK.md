# ✅ Quick PostHog Verification Guide

Step-by-step guide to check if PostHog is working.

---

## 🚀 Step 1: Verify Setup

### Check Environment Variables

1. **In Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Select your `lenzli-landing` project
   - Go to **Settings** → **Environment Variables**
   - Verify `VITE_POSTHOG_KEY` is set
   - If missing, add it and redeploy

2. **In Your Local `.env` file:**
   ```env
   VITE_POSTHOG_KEY=phc_your_key_here
   ```

---

## 🔍 Step 2: Check Browser Console

1. **Open your deployed site:**
   - Visit: https://lenzli-landing-pt01oyxpy-builditbops-projects.vercel.app
   - Or your local: http://localhost:5173

2. **Open Browser DevTools:**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Go to **Console** tab

3. **Look for:**
   ```
   ✅ PostHog initialized successfully
   ```
   
   **OR if not configured:**
   ```
   ⚠️ PostHog key not found. Analytics will not be tracked.
   ```

---

## 📊 Step 3: Check PostHog Dashboard

### Method 1: Activity Feed (Easiest)

1. **Go to PostHog:**
   - Visit: https://app.posthog.com
   - Log in to your account

2. **Open Activity Feed:**
   - Click **"Activity"** in the left sidebar
   - Or go to: https://app.posthog.com/activity

3. **What to Look For:**
   - Events should appear in real-time (may take 10-30 seconds)
   - You should see events like:
     - `landing_page_viewed`
     - `$pageview` (automatic)
     - `$autocapture` (automatic)

4. **Test It:**
   - Navigate around your site
   - Click buttons, visit pages
   - Events should appear in Activity feed within 10-30 seconds

### Method 2: Events Explorer

1. **Go to Events Explorer:**
   - Click **"Events"** → **"Events Explorer"** in left sidebar
   - Or go to: https://app.posthog.com/events

2. **Filter Events:**
   - Use the search/filter bar
   - Type: `landing_page_viewed`
   - Click on an event to see properties

3. **Check Event Properties:**
   - Click on any event
   - You should see properties like:
     - `$browser`
     - `$os`
     - `$current_url`
     - Custom properties (if any)

### Method 3: Network Tab (Advanced)

1. **Open Browser DevTools:**
   - Press `F12`
   - Go to **Network** tab

2. **Filter Requests:**
   - Type `posthog` in the filter box
   - You should see POST requests to PostHog API

3. **Check Request:**
   - Click on a request
   - Status should be `200` (success)
   - Check the payload to see event data

---

## 🧪 Step 4: Quick Test

### Test Event Capture

1. **Open Browser Console:**
   - Press `F12` → Console tab

2. **Run This Command:**
   ```javascript
   posthog.capture('test_event', { test: true })
   ```

3. **Check PostHog:**
   - Go to Activity feed
   - Look for `test_event` within 10-30 seconds
   - ✅ If you see it → PostHog is working!
   - ❌ If not → Check setup

---

## ✅ Verification Checklist

Use this checklist to verify everything works:

### Setup
- [ ] PostHog account created
- [ ] API key added to Vercel environment variables
- [ ] API key added to local `.env` file
- [ ] Site redeployed after adding env vars

### Browser Console
- [ ] Console shows "PostHog initialized successfully"
- [ ] No PostHog errors in console
- [ ] Network tab shows PostHog requests (status 200)

### PostHog Dashboard
- [ ] Can log in to PostHog dashboard
- [ ] Activity feed shows events
- [ ] Events appear within 10-30 seconds
- [ ] Events have correct properties

### Test Events
- [ ] `landing_page_viewed` appears when visiting landing page
- [ ] `$pageview` events appear automatically
- [ ] Manual test event (`test_event`) appears

---

## 🐛 Troubleshooting

### No Events Appearing?

1. **Check API Key:**
   - Make sure key starts with `phc_`
   - No extra spaces or quotes
   - Key is correct in Vercel env vars

2. **Check Console:**
   - Should see "PostHog initialized successfully"
   - Should NOT see "PostHog key not found"

3. **Check Network:**
   - Open DevTools → Network tab
   - Filter by "posthog"
   - Should see POST requests
   - Status should be 200

4. **Wait Time:**
   - Events may take 10-30 seconds to appear
   - Refresh Activity feed if needed

5. **Check Project:**
   - Make sure you're looking at the correct PostHog project
   - Check project name matches

### Console Shows "Key Not Found"?

1. **Check `.env` file:**
   ```bash
   # Make sure file exists and has:
   VITE_POSTHOG_KEY=phc_your_key_here
   ```

2. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check Vercel:**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Make sure `VITE_POSTHOG_KEY` is set
   - Redeploy after adding

### Events Not Showing in Dashboard?

1. **Check Project:**
   - Make sure you're in the correct PostHog project
   - Check project name in top left

2. **Check Time Range:**
   - Activity feed shows recent events
   - Make sure you're looking at "Last 24 hours" or "All time"

3. **Refresh:**
   - Refresh the Activity feed
   - Events may take 10-30 seconds

4. **Check Filters:**
   - Make sure no filters are applied
   - Clear any search/filter terms

---

## 🎯 Expected Behavior

### When Working Correctly:

1. **Console:**
   ```
   PostHog initialized successfully
   ```

2. **Activity Feed:**
   - Events appear within 10-30 seconds
   - Events include: `$pageview`, `landing_page_viewed`, etc.

3. **Network Tab:**
   - POST requests to `https://app.posthog.com/capture/`
   - Status: 200 (success)

4. **Events Explorer:**
   - Can see all events
   - Events have properties
   - Can filter and search

---

## 📞 Quick Test Script

Run this in browser console to test:

```javascript
// 1. Check if PostHog is loaded
console.log('PostHog loaded:', typeof posthog !== 'undefined');

// 2. Check if initialized
console.log('PostHog initialized:', posthog.__loaded || false);

// 3. Send test event
posthog.capture('manual_test', { 
  timestamp: new Date().toISOString(),
  test: true 
});

console.log('Test event sent! Check PostHog Activity feed.');
```

---

## 🎉 Success Indicators

You'll know PostHog is working when:

✅ Console shows "PostHog initialized successfully"
✅ Activity feed shows events in real-time
✅ Network tab shows successful POST requests
✅ Events have correct properties
✅ Test events appear in dashboard

---

## 📚 Next Steps

Once verified:

1. **Set up Dashboards:**
   - See `POSTHOG-DASHBOARDS.md`
   - Create custom dashboards

2. **Monitor Events:**
   - Check Activity feed regularly
   - Set up alerts for important metrics

3. **Analyze Data:**
   - Use Events Explorer to analyze
   - Create insights and funnels

---

**Need More Help?** Check:
- `POSTHOG-SETUP.md` - Full setup guide
- `POSTHOG-TESTING.md` - Comprehensive testing guide
- `POSTHOG-DASHBOARDS.md` - Dashboard configurations

