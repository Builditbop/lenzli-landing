# 📊 PostHog Analytics Setup Guide

Complete guide to setting up and using PostHog analytics for Lenzli.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create PostHog Account

1. Go to [https://app.posthog.com/signup](https://app.posthog.com/signup)
2. Sign up with email or GitHub
3. Create a new project (or use the default)
4. Name it: **"Lenzli"**

### Step 2: Get Your API Key

1. In PostHog dashboard, go to **Project Settings** (gear icon)
2. Click on **"Project API Key"** tab
3. Copy your **Project API Key** (starts with `phc_`)

### Step 3: Add to Environment Variables

1. Open your `.env` file in the project root
2. Add your PostHog key:

```env
VITE_POSTHOG_KEY=phc_your_key_here
VITE_POSTHOG_HOST=https://app.posthog.com
```

**Note:** Only change `VITE_POSTHOG_HOST` if you're using self-hosted PostHog.

### Step 4: Restart Development Server

```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

### Step 5: Verify It's Working

1. Open your app in the browser
2. Open browser DevTools (F12)
3. Check Console - you should see: `PostHog initialized successfully`
4. Go to PostHog dashboard → **Activity** tab
5. You should see events coming in!

---

## ✅ Verification Checklist

- [ ] PostHog account created
- [ ] API key added to `.env` file
- [ ] Dev server restarted
- [ ] Console shows "PostHog initialized successfully"
- [ ] Events visible in PostHog dashboard

---

## 📈 All Tracked Events

### Authentication Events
- `signup_completed` - User signs up (email/Google)
- `signup_failed` - Signup error occurred
- `login_successful` - User logs in (email/Google)
- `login_failed` - Login error occurred
- `logout_clicked` - User logs out
- `logout_failed` - Logout error occurred

### Landing Page Events
- `landing_page_viewed` - Landing page visited
- `waitlist_signup` - Email added to waitlist
- `waitlist_signup_failed` - Waitlist signup error
- `cta_clicked` - CTA button clicked (signup/login)

### Profile Events
- `profile_page_viewed` - Profile page visited
- `profile_completed` - Profile setup completed
- `profile_updated` - Profile edited
- `profile_completion_failed` - Profile save error
- `profile_update_failed` - Profile update error
- `edit_profile_clicked` - Edit profile button clicked
- `send_message_clicked` - Send message button clicked

### Discovery Events
- `discover_page_viewed` - Discover page visited
- `swipe_left` - User swipes left (pass)
- `swipe_right` - User swipes right (connect)
- `match_created` - Users match
- `profile_viewed` - Profile viewed from Discover
- `connection_failed` - Connection save error

### Messaging Events
- `messages_page_viewed` - Messages page visited
- `chat_opened` - Chat conversation opened
- `message_sent` - Message sent (text/image)

### Connections Events
- `connections_page_viewed` - Connections page visited
- `connections_loaded` - Connections list loaded
- `connection_viewed` - Connection profile viewed

### Image Upload Events
- `image_uploaded` - Image uploaded successfully
- `image_upload_failed` - Image upload error

---

## 🎯 Event Properties

Each event includes relevant metadata. For example:

**`signup_completed`** includes:
- `method`: "email" or "google"
- `has_display_name`: boolean

**`profile_completed`** includes:
- `role`: User's selected role
- `gear_count`: Number of gear items
- `specialties_count`: Number of specialties
- `portfolio_images_count`: Number of portfolio images
- `skill_level`: Selected skill level
- And more...

**`swipe_right`** includes:
- `creator_id`: ID of swiped user
- `creator_role`: Role of swiped user
- `swipe_index`: Position in swipe queue

---

## 📊 Creating Custom Dashboards

### Dashboard 1: User Acquisition

**Metrics to Track:**
1. **Signups Over Time**
   - Event: `signup_completed`
   - Group by: `method` (email vs Google)

2. **Waitlist Conversions**
   - Event: `waitlist_signup`
   - Conversion to: `signup_completed`

3. **CTA Click-Through Rate**
   - Event: `cta_clicked`
   - Group by: `location` (navbar, hero_section)

### Dashboard 2: User Engagement

**Metrics to Track:**
1. **Profile Completion Rate**
   - Event: `profile_completed`
   - Funnel: `signup_completed` → `profile_completed`

2. **Discovery Activity**
   - Events: `swipe_left`, `swipe_right`
   - Calculate: Swipe ratio (right/left)

3. **Match Rate**
   - Event: `match_created`
   - Conversion from: `swipe_right`

### Dashboard 3: Messaging Activity

**Metrics to Track:**
1. **Messages Sent**
   - Event: `message_sent`
   - Group by: `has_image` (text vs image messages)

2. **Chat Engagement**
   - Event: `chat_opened`
   - Conversion to: `message_sent`

3. **Active Conversations**
   - Unique `chat_id` values from `message_sent`

### Dashboard 4: Profile Performance

**Metrics to Track:**
1. **Profile Views**
   - Event: `profile_page_viewed`
   - Group by: `is_own_profile`

2. **Profile Updates**
   - Event: `profile_updated`
   - Track frequency per user

3. **Image Uploads**
   - Event: `image_uploaded`
   - Average images per user

---

## 🔧 PostHog Dashboard Setup Instructions

### Creating Your First Dashboard

1. **Go to Dashboards**
   - Click "Dashboards" in left sidebar
   - Click "New Dashboard"

2. **Add Insights**
   - Click "New Insight"
   - Select event (e.g., `signup_completed`)
   - Choose visualization type (Line chart, Bar chart, etc.)
   - Add filters if needed
   - Click "Save"

3. **Add to Dashboard**
   - Click "Add to dashboard"
   - Select your dashboard
   - Repeat for more insights

### Recommended Dashboards

#### 1. **Overview Dashboard**
- Total signups (last 7 days)
- Active users (last 24 hours)
- Profile completion rate
- Total matches created
- Messages sent (last 7 days)

#### 2. **Funnel Dashboard**
- Signup → Profile Completion → First Swipe → Match → Message

#### 3. **User Behavior Dashboard**
- Swipe ratio (left vs right)
- Most viewed profiles
- Average images per profile
- Most common roles

---

## 🧪 Testing Your Setup

### Test Checklist

1. **Landing Page**
   - [ ] Visit landing page → Check for `landing_page_viewed`
   - [ ] Click "Sign Up" → Check for `cta_clicked`
   - [ ] Submit waitlist email → Check for `waitlist_signup`

2. **Authentication**
   - [ ] Sign up → Check for `signup_completed`
   - [ ] Log in → Check for `login_successful`
   - [ ] Log out → Check for `logout_clicked`

3. **Profile**
   - [ ] Complete profile → Check for `profile_completed`
   - [ ] Edit profile → Check for `profile_updated`
   - [ ] Upload images → Check for `image_uploaded`

4. **Discovery**
   - [ ] Visit Discover → Check for `discover_page_viewed`
   - [ ] Swipe left → Check for `swipe_left`
   - [ ] Swipe right → Check for `swipe_right`
   - [ ] Get match → Check for `match_created`

5. **Messaging**
   - [ ] Visit Messages → Check for `messages_page_viewed`
   - [ ] Open chat → Check for `chat_opened`
   - [ ] Send message → Check for `message_sent`

---

## 🐛 Troubleshooting

### Events Not Showing Up?

1. **Check Console**
   - Open browser DevTools (F12)
   - Look for PostHog errors
   - Should see: "PostHog initialized successfully"

2. **Check Environment Variables**
   ```bash
   # Make sure .env file has:
   VITE_POSTHOG_KEY=phc_your_key_here
   ```

3. **Check PostHog Dashboard**
   - Go to **Activity** tab
   - Events appear in real-time
   - May take 10-30 seconds to show up

4. **Check Network Tab**
   - Open DevTools → Network tab
   - Filter by "posthog"
   - Should see requests to PostHog API

### PostHog Not Initializing?

1. **Check API Key**
   - Make sure key starts with `phc_`
   - No extra spaces or quotes

2. **Check Host**
   - Default: `https://app.posthog.com`
   - Only change if self-hosting

3. **Restart Dev Server**
   - Stop server (Ctrl+C)
   - Run `npm run dev` again

---

## 📚 Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Event Tracking Guide](https://posthog.com/docs/integrate/client/js)
- [PostHog Dashboards Guide](https://posthog.com/docs/user-guides/dashboards)

---

## 🎉 You're All Set!

Your analytics are now tracking all user actions. Check your PostHog dashboard regularly to understand user behavior and improve your product!

**Next Steps:**
1. Create custom dashboards (see above)
2. Set up alerts for important metrics
3. Create funnels to track user journeys
4. Use insights to improve features

