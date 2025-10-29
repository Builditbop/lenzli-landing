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

### Step 2: Add GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install and Build
        run: |
          npm install
          npm run build
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: lenzli.com
```

### Step 3: Configure GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **gh-pages branch**
3. Custom domain: **lenzli.com**

### Step 4: DNS Configuration
Add these records at your domain registrar:

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
- GitHub Pages: Enable HTTPS in settings

### Site showing 404?
- Verify build folder is correct (`dist/`)
- Check `index.html` exists in deployed folder
- Clear browser cache

### Images not loading?
- Check browser console for errors
- Verify Unsplash URLs are accessible
- Check Content Security Policy settings

## 🚀 Continuous Deployment

### With Vercel (Recommended)
1. Connect GitHub repo in Vercel dashboard
2. Auto-deploys on every `git push`
3. Preview deployments for PRs

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

