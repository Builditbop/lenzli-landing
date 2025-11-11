# 📊 PostHog Dashboard Configurations

Pre-configured dashboard setups for Lenzli analytics.

---

## 🎯 Dashboard 1: User Acquisition & Onboarding

### Purpose
Track how users sign up and complete onboarding.

### Insights to Add

#### 1. Signups Over Time
- **Event:** `signup_completed`
- **Visualization:** Line chart
- **Time Range:** Last 7 days
- **Breakdown:** `method` (email vs google)
- **Title:** "Signups by Method"

#### 2. Signup Funnel
- **Step 1:** `landing_page_viewed`
- **Step 2:** `cta_clicked` (where `cta_type` = "signup")
- **Step 3:** `signup_completed`
- **Step 4:** `profile_completed`
- **Title:** "Signup to Profile Completion Funnel"

#### 3. Waitlist Conversions
- **Event:** `waitlist_signup`
- **Visualization:** Number card
- **Time Range:** All time
- **Title:** "Total Waitlist Signups"

#### 4. Profile Completion Rate
- **Event:** `profile_completed`
- **Visualization:** Percentage
- **Formula:** `profile_completed` / `signup_completed` * 100
- **Title:** "Profile Completion Rate"

---

## 🎯 Dashboard 2: User Engagement

### Purpose
Track how users interact with the app.

### Insights to Add

#### 1. Swipe Activity
- **Event:** `swipe_right` + `swipe_left`
- **Visualization:** Bar chart
- **Breakdown:** Event name
- **Time Range:** Last 7 days
- **Title:** "Swipe Activity"

#### 2. Swipe Ratio
- **Formula:** `swipe_right` / (`swipe_left` + `swipe_right`) * 100
- **Visualization:** Number card
- **Title:** "Swipe Right Ratio (%)"

#### 3. Matches Created
- **Event:** `match_created`
- **Visualization:** Line chart
- **Time Range:** Last 7 days
- **Title:** "Matches Over Time"

#### 4. Match Rate
- **Formula:** `match_created` / `swipe_right` * 100
- **Visualization:** Number card
- **Title:** "Match Rate (%)"

#### 5. Profile Views
- **Event:** `profile_page_viewed`
- **Visualization:** Line chart
- **Breakdown:** `is_own_profile` (true/false)
- **Title:** "Profile Views"

---

## 🎯 Dashboard 3: Messaging Activity

### Purpose
Track messaging engagement and activity.

### Insights to Add

#### 1. Messages Sent
- **Event:** `message_sent`
- **Visualization:** Line chart
- **Time Range:** Last 7 days
- **Title:** "Messages Sent Over Time"

#### 2. Message Types
- **Event:** `message_sent`
- **Visualization:** Pie chart
- **Breakdown:** `has_image` (true/false)
- **Title:** "Text vs Image Messages"

#### 3. Active Chats
- **Event:** `chat_opened`
- **Visualization:** Number card
- **Unique Users:** Yes
- **Time Range:** Last 24 hours
- **Title:** "Active Chats (24h)"

#### 4. Chat Engagement Funnel
- **Step 1:** `match_created`
- **Step 2:** `chat_opened`
- **Step 3:** `message_sent`
- **Title:** "Match to Message Funnel"

---

## 🎯 Dashboard 4: Profile Performance

### Purpose
Track profile creation and updates.

### Insights to Add

#### 1. Profile Updates
- **Event:** `profile_updated`
- **Visualization:** Line chart
- **Time Range:** Last 7 days
- **Title:** "Profile Updates Over Time"

#### 2. Image Uploads
- **Event:** `image_uploaded`
- **Visualization:** Bar chart
- **Breakdown:** `context` (profile_setup vs edit_profile)
- **Title:** "Image Uploads by Context"

#### 3. Average Images Per Profile
- **Event:** `profile_completed`
- **Property:** `portfolio_images_count`
- **Visualization:** Number card
- **Aggregation:** Average
- **Title:** "Avg Portfolio Images"

#### 4. Most Common Roles
- **Event:** `profile_completed`
- **Visualization:** Bar chart
- **Breakdown:** `role`
- **Title:** "User Roles Distribution"

---

## 🎯 Dashboard 5: Error Tracking

### Purpose
Monitor errors and failed actions.

### Insights to Add

#### 1. Signup Errors
- **Event:** `signup_failed`
- **Visualization:** Bar chart
- **Breakdown:** `error`
- **Title:** "Signup Errors"

#### 2. Login Errors
- **Event:** `login_failed`
- **Visualization:** Bar chart
- **Breakdown:** `error`
- **Title:** "Login Errors"

#### 3. Upload Errors
- **Event:** `image_upload_failed`
- **Visualization:** Number card
- **Time Range:** Last 7 days
- **Title:** "Image Upload Errors"

#### 4. Connection Errors
- **Event:** `connection_failed`
- **Visualization:** Bar chart
- **Breakdown:** `error`
- **Title:** "Connection Errors"

---

## 📋 Quick Setup Instructions

### For Each Dashboard:

1. **Create Dashboard**
   - Go to PostHog → Dashboards
   - Click "New Dashboard"
   - Name it (e.g., "User Acquisition")

2. **Add Insights**
   - Click "New Insight"
   - Select event from list above
   - Configure visualization
   - Click "Save"
   - Click "Add to dashboard"

3. **Repeat**
   - Add all insights listed
   - Arrange as needed
   - Save dashboard

---

## 🔔 Recommended Alerts

Set up alerts for important metrics:

1. **Signup Drop**
   - Alert if signups drop 50% in 24h
   - Event: `signup_completed`

2. **High Error Rate**
   - Alert if errors > 10% of actions
   - Events: All `*_failed` events

3. **Low Match Rate**
   - Alert if match rate < 5%
   - Events: `match_created` / `swipe_right`

4. **Profile Completion Drop**
   - Alert if completion rate < 50%
   - Events: `profile_completed` / `signup_completed`

---

## 📊 Key Metrics to Monitor

### Daily Metrics
- Total signups
- Profile completion rate
- Swipe activity (left/right)
- Matches created
- Messages sent

### Weekly Metrics
- User retention (returning users)
- Average matches per user
- Average messages per chat
- Profile update frequency

### Monthly Metrics
- User growth rate
- Feature adoption rates
- Error rates
- User satisfaction (if tracking)

---

## 🎨 Dashboard Best Practices

1. **Keep it Simple**
   - 4-6 insights per dashboard max
   - Focus on actionable metrics

2. **Use Appropriate Visualizations**
   - Trends over time → Line charts
   - Comparisons → Bar charts
   - Proportions → Pie charts
   - Single numbers → Number cards

3. **Set Time Ranges**
   - Daily dashboards: Last 7 days
   - Weekly reviews: Last 30 days
   - Monthly reports: All time

4. **Add Context**
   - Use titles and descriptions
   - Add notes for important changes
   - Document anomalies

---

## 🚀 Advanced: Custom Insights

### Example: User Journey Funnel

```
1. landing_page_viewed
2. cta_clicked (signup)
3. signup_completed
4. profile_completed
5. discover_page_viewed
6. swipe_right
7. match_created
8. chat_opened
9. message_sent
```

### Example: Retention Analysis

Track users who:
- Signed up in last 7 days
- Returned within 7 days
- Completed profile
- Made at least 1 match

---

## 📝 Notes

- All events are automatically tracked
- Events include relevant metadata
- Dashboards update in real-time
- Export data for external analysis if needed

---

**Need Help?** Check [POSTHOG-SETUP.md](./POSTHOG-SETUP.md) for setup instructions.

