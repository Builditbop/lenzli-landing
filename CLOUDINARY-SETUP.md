# 📸 Cloudinary Setup Guide (Free Image Storage)

Since you can't upgrade Firebase to use Storage, we're using **Cloudinary** instead - it's **100% free** for your needs and even easier to set up!

## ✨ Why Cloudinary?

- ✅ **Completely Free** (25GB storage, 25GB bandwidth/month)
- ✅ **No credit card required**
- ✅ **Automatic image optimization**
- ✅ **Fast CDN delivery**
- ✅ **Easy to set up** (5 minutes)

## 🚀 Setup Steps (5 Minutes)

### Step 1: Create Free Cloudinary Account

1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email (or use Google/GitHub)
3. Verify your email
4. You'll be redirected to your dashboard

### Step 2: Get Your Credentials

Once logged in, you'll see your dashboard. You need:

1. **Cloud Name** - Shows at the top of your dashboard
   - Example: `dq6jxyz12`
   
2. **Upload Preset** - We need to create this:
   - Click **Settings** (gear icon) in top right
   - Go to **Upload** tab
   - Scroll down to **Upload presets**
   - Click **Add upload preset**
   - Set these values:
     - **Preset name**: `lenzli_uploads`
     - **Signing Mode**: Select **Unsigned**
     - **Folder**: `lenzli-portfolios`
   - Click **Save**

### Step 3: Add to Your Project

Create or update your `.env` file:

```bash
# In your project root
touch .env
```

Add these lines to `.env`:

```env
# Firebase (Auth & Database only - no storage needed!)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# Cloudinary (Image Storage)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
VITE_CLOUDINARY_UPLOAD_PRESET=lenzli_uploads
```

**Example with real values:**
```env
VITE_CLOUDINARY_CLOUD_NAME=dq6jxyz12
VITE_CLOUDINARY_UPLOAD_PRESET=lenzli_uploads
```

### Step 4: Restart Your Dev Server

```bash
# Stop your dev server (Ctrl+C)
# Then restart it
npm run dev
```

## ✅ Test It Out!

1. Visit http://localhost:5173
2. Sign up and create a profile
3. Upload some portfolio images
4. They'll be stored in Cloudinary!

You can view your uploaded images in your Cloudinary dashboard under **Media Library**.

## 🔐 Security (Optional but Recommended)

The current setup uses **unsigned uploads** which is fine for MVP, but for production you might want signed uploads.

### To enable signed uploads later:

1. In Cloudinary dashboard → Upload presets
2. Change **Signing Mode** to **Signed**
3. Get your **API Secret** from Dashboard
4. Update your backend to generate signed upload signatures

For MVP, unsigned uploads are perfectly fine!

## 📊 Free Tier Limits

Cloudinary's free tier includes:
- **25 GB** storage
- **25 GB** bandwidth per month
- **Unlimited** transformations
- **500** monthly transformations

This is **more than enough** for your MVP!

## 🌐 For Production/Deployment

When deploying to Vercel/Netlify, add these environment variables:

**Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add:
   - `VITE_CLOUDINARY_CLOUD_NAME` = your-cloud-name
   - `VITE_CLOUDINARY_UPLOAD_PRESET` = lenzli_uploads

**Netlify:**
1. Site settings → Build & deploy → Environment
2. Add the same variables

## 🎨 Image Transformations (Bonus!)

Cloudinary automatically optimizes images. You can also transform them:

```javascript
// Example: Resize image
const imageUrl = "https://res.cloudinary.com/your-cloud/image/upload/v1234/image.jpg";

// Add transformations
const optimized = imageUrl.replace('/upload/', '/upload/w_500,h_500,c_fill/');
```

For MVP, automatic optimization is already enabled!

## 🚨 Troubleshooting

### "Upload preset not found"
→ Make sure you created the upload preset and it's set to **Unsigned**

### "Invalid cloud name"
→ Check your `.env` file has the correct cloud name (no quotes, no spaces)

### Images not uploading
→ Restart your dev server after adding `.env` variables

### "CORS error"
→ This shouldn't happen with Cloudinary, but if it does:
  - Go to Cloudinary Settings → Security
  - Add your domain to **Allowed domains**

## 📈 Upgrade Later (If Needed)

If you outgrow the free tier (which is unlikely for MVP):
- **Plus Plan**: $99/month - 100GB storage
- **Advanced**: $224/month - 500GB storage

But **start with free** - it's plenty!

## ✨ Comparison

| Feature | Firebase Storage (Paid) | Cloudinary (Free) |
|---------|------------------------|-------------------|
| Cost | Requires Blaze plan | 100% Free |
| Storage | Pay per GB | 25GB free |
| Bandwidth | Pay per GB | 25GB/month free |
| Setup | Complex | Easy |
| Image Optimization | Manual | Automatic |
| CDN | Yes | Yes |

## 🎯 What You Get

With Cloudinary, your users can:
- ✅ Upload portfolio images
- ✅ Images are automatically optimized
- ✅ Fast loading via CDN
- ✅ No cost to you!

## 🔗 Useful Links

- Cloudinary Dashboard: https://cloudinary.com/console
- Documentation: https://cloudinary.com/documentation
- React SDK: https://cloudinary.com/documentation/react_integration

---

## ✅ You're All Set!

That's it! Your image uploads now work without needing Firebase Storage billing.

**Next steps:**
1. Create Cloudinary account ✓
2. Get cloud name & create upload preset ✓
3. Add to `.env` file ✓
4. Test uploads ✓

Your MVP is ready to go! 🚀

