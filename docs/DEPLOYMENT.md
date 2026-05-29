# 🚀 Deploying Lenzli to lenzli.com

Your production build is ready! Here's how to deploy it to **lenzli.com**.

## Quick Overview

Your optimized site is in the `dist/` folder and ready to deploy. Choose one of these hosting options:

## 🌟 Recommended: Vercel (Easiest & Free)

**Why Vercel?** Best for React/Vite apps, automatic deployments, free SSL, global CDN.

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
cd /Users/sreekondaveeti/Downloads/lenzli-landing
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → lenzli-landing
- **Directory?** → Press Enter (current directory)
- **Override settings?** → No

### Step 3: Connect Your Domain (lenzli.com)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **lenzli-landing** project
3. Go to **Settings** → **Domains**
4. Add `lenzli.com`
5. Vercel will show you DNS records to add

### Step 4: Configure DNS at Your Domain Registrar

Go to where you bought **lenzli.com** (GoDaddy, Namecheap, Google Domains, etc.) and add:

**Option A - Using A Record (Recommended):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Add www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Option B - Using CNAME (if available for apex domain):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

⏱️ **DNS propagation takes 5-60 minutes**

---

## 🎯 Alternative 1: Netlify

### Quick Deploy
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Connect Domain
1. Go to [netlify.com](https://netlify.com)
2. Site Settings → **Domain Management** → **Add Custom Domain**
3. Enter `lenzli.com`
4. Add these DNS records at your registrar:

```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600

Type: CNAME
Name: www
Value: [your-site-name].netlify.app
TTL: 3600
```

---

## 🔥 Alternative 2: Cloudflare Pages

### Deploy
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create Application** → **Pages** → **Upload assets**
3. Drag the `dist` folder

### Connect Domain
1. If lenzli.com is already on Cloudflare:
   - Go to **Workers & Pages** → your project → **Custom Domains**
   - Add `lenzli.com`
   - DNS is automatically configured!

2. If not on Cloudflare:
   - Add your site to Cloudflare first
   - Transfer your nameservers to Cloudflare's nameservers
   - Then add custom domain

---

## 🌐 Alternative 3: GitHub Pages

### Step 1: Create GitHub Repository
```bash
cd /Users/sreekondaveeti/Downloads/lenzli-landing
git init
git add .
git commit -m "Initial commit"
gh repo create lenzli-landing --public --source=. --remote=origin --push
```

### Step 2: Configure GitHub Pages Settings

**Important:** Enable GitHub Pages with GitHub Actions:
1. Go to your repo → **Settings** → **Pages**
2. **Source:** Select **GitHub Actions** (not "Deploy from a branch")
3. Custom domain: **lenzli.com** (optional, for custom domain)

### Step 3: Add Environment Variables

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets (from your `.env` file):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

### Step 4: Push Code to Trigger Deployment

The workflow file `.github/workflows/deploy.yml` is already configured. Simply push to main:

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

**The workflow will automatically:**
- Use the built-in `GITHUB_TOKEN` (no manual token needed!)
- Build your app with all environment variables
- Deploy to GitHub Pages
- Trigger on every push to `main` branch

### Step 5: Verify Deployment

1. Go to **Actions** tab in your repo
2. Watch the workflow run (takes 2-3 minutes)
3. Once complete, your site will be live at `https://[username].github.io/lenzli-landing`
4. If you set a custom domain, it will be at `https://lenzli.com`

### Step 6: DNS Configuration (For Custom Domain)

If you're using a custom domain (lenzli.com), add these DNS records at your registrar:

```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600

Type: CNAME
Name: www
Value: [your-username].github.io
TTL: 3600
```

**Note:** After adding DNS records, GitHub will automatically configure SSL for your custom domain within 24 hours.

---

## 🎨 Alternative 4: AWS S3 + CloudFront

### Step 1: Upload to S3
```bash
# Install AWS CLI first: brew install awscli
aws s3 sync dist/ s3://lenzli.com --delete
```

### Step 2: Configure S3 Bucket
- Enable **Static Website Hosting**
- Make bucket public
- Set index document: `index.html`

### Step 3: Set up CloudFront
- Create CloudFront distribution
- Origin: Your S3 bucket
- Alternate domain: `lenzli.com`
- SSL Certificate: Request from AWS Certificate Manager

### Step 4: DNS Configuration
```
Type: A (Alias)
Name: @
Value: [CloudFront distribution domain]
TTL: 3600

Type: CNAME
Name: www
Value: [CloudFront distribution domain]
TTL: 3600
```

---

## ✅ Post-Deployment Checklist

After deploying, verify:

- [ ] Site loads at `https://lenzli.com`
- [ ] Site loads at `https://www.lenzli.com` (redirects to main)
- [ ] SSL certificate is active (🔒 padlock in browser)
- [ ] Images load properly
- [ ] All animations work
- [ ] Form submission works
- [ ] Mobile responsive design works
- [ ] All links work
- [ ] Meta tags visible in page source

## 🔍 Troubleshooting

### Domain not resolving?
- Wait 15-60 minutes for DNS propagation
- Check DNS with: `dig lenzli.com` or use [whatsmydns.net](https://whatsmydns.net)
- Verify DNS records are correct

### SSL not working?
- Most hosting providers auto-provision SSL (takes 5-15 minutes)
- Vercel/Netlify: Automatic and free
- GitHub Pages: Enable HTTPS in settings → **Pages** → check "Enforce HTTPS"

### GitHub Actions workflow failing?

**"Permission denied" or "Token not found" errors:**
- ✅ **Fixed!** The workflow now uses the built-in `GITHUB_TOKEN` automatically
- No need to create a Personal Access Token (PAT)
- Make sure GitHub Pages is set to **"GitHub Actions"** as source (not "Deploy from a branch")
- Check that you have `permissions` set correctly in the workflow (already configured)

**"Environment variables not found" errors:**
- Go to repo → **Settings** → **Secrets and variables** → **Actions**
- Add all required environment variables as repository secrets
- Use the exact names listed in Step 3 (with `VITE_` prefix)
- After adding secrets, re-run the workflow from the **Actions** tab

**"Build failed" errors:**
- Check the Actions log for specific error messages
- Verify all dependencies are in `package.json`
- Ensure Node.js version in workflow matches your local version
- Check that all environment variables are set correctly

### Site showing 404?
- Verify build folder is correct (`dist/`)
- Check `index.html` exists in deployed folder
- Clear browser cache

### Vercel deployments not happening automatically?

**Common causes and solutions:**

1. **Git repository not connected:**
   - Go to Vercel Dashboard → Your Project → **Settings** → **Git**
   - If you see "No Git Repository Connected", click **"Connect Git Repository"**
   - Select GitHub and authorize access
   - Select your `lenzli-landing` repository

2. **Wrong branch configured:**
   - Check **Settings** → **Git** → **Production Branch**
   - Ensure it's set to `main` (not `master` or another branch)
   - Make sure you're pushing to the correct branch

3. **GitHub integration not authorized:**
   - Go to https://vercel.com/account/integrations
   - Check if GitHub is connected
   - If not, click **"Connect GitHub"** and authorize

4. **Environment variables missing:**
   - If build fails, check **Deployments** tab → Click failed deployment → **Build Logs**
   - Add missing environment variables in **Settings** → **Environment Variables**

5. **Manual deployment still works:**
   - Even if auto-deploy isn't set up, you can still deploy manually:
   ```bash
   npx vercel --prod
   ```

**Quick fix:**
- Go to Vercel Dashboard → Your Project → **Settings** → **Git**
- If not connected, click **"Connect Git Repository"** → Select GitHub → Select your repo
- Push to GitHub: `git push origin main`
- Vercel will auto-deploy!

## 🚀 Continuous Deployment

### With Vercel (Recommended)

**To enable automatic deployments on every `git push`:**

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click on your `lenzli-landing` project

2. **Connect to GitHub:**
   - Go to **Settings** → **Git**
   - Click **"Connect Git Repository"** or **"Edit Git Repository"**
   - Select **GitHub** as your Git provider
   - Authorize Vercel to access your GitHub account (if not already done)
   - Find and select your repository: `Builditbop/lenzli-landing`
   - Click **"Connect"**

3. **Configure Production Branch:**
   - In **Settings** → **Git**, ensure:
     - **Production Branch:** `main`
     - **Root Directory:** `./` (leave as default)
     - **Build Command:** `npm run build` (should auto-detect)
     - **Output Directory:** `dist` (should auto-detect)
   - Click **"Save"**

4. **Verify Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Ensure all your `VITE_*` variables are set:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_CLOUDINARY_CLOUD_NAME`
     - `VITE_CLOUDINARY_UPLOAD_PRESET`

5. **Test Auto-Deployment:**
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```
   - Vercel will automatically detect the push and start a new deployment
   - You can watch it in the **Deployments** tab

**Once connected, every `git push` to `main` will automatically:**
- ✅ Trigger a new deployment
- ✅ Build your app with environment variables
- ✅ Deploy to production
- ✅ Create preview deployments for pull requests

**Benefits:**
- ✅ No manual deployment needed
- ✅ Preview deployments for every PR
- ✅ Automatic rollback on build failures
- ✅ Deployment history tracking

### With Netlify
1. Link repository in Netlify dashboard
2. Auto-deploys on commit
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## 📊 Performance Tips

After deployment, test your site:

1. **Google PageSpeed Insights**: https://pagespeed.web.dev
2. **GTmetrix**: https://gtmetrix.com
3. **WebPageTest**: https://webpagetest.org

Your site should score 90+ on performance!

---

## 💼 DNS Provider Specific Guides

### GoDaddy
1. Go to **DNS Management**
2. Add/Edit records as shown above
3. Save changes

### Namecheap
1. **Domain List** → **Manage** → **Advanced DNS**
2. Add records
3. Save changes

### Google Domains / Squarespace Domains
1. **DNS** → **Custom records**
2. Add records
3. Changes take effect immediately

### Cloudflare
1. **DNS** → **Records**
2. Add records
3. Instant propagation with Cloudflare proxy

---

## 🎯 My Recommendation

**Go with Vercel** because:
- ✅ Easiest setup (2 commands)
- ✅ Automatic SSL
- ✅ Global CDN (super fast)
- ✅ Automatic deployments from Git
- ✅ Preview deployments
- ✅ 100% free for your use case
- ✅ Best for React/Vite apps

**Simple 3-step process:**
1. `npm install -g vercel && vercel`
2. Add `lenzli.com` in Vercel dashboard
3. Update DNS at your registrar

Your site will be live at **lenzli.com** in under 30 minutes!

---

Need help? Let me know which hosting option you prefer, and I can provide more detailed guidance! 🚀

