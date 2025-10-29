# ⚡ Quick Start: Get lenzli.com Live in 10 Minutes

## 🚀 Fastest Method: One-Command Deploy

### Option 1: Using the Deploy Script (Easiest!)

```bash
cd /Users/sreekondaveeti/Downloads/lenzli-landing
./deploy-vercel.sh
```

This script will:
1. ✅ Install Vercel CLI (if needed)
2. ✅ Build your production site
3. ✅ Deploy to Vercel
4. ✅ Give you a live URL

---

### Option 2: Manual Vercel Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (answer prompts)
cd /Users/sreekondaveeti/Downloads/lenzli-landing
vercel --prod
```

---

## 🌐 Connect lenzli.com to Your Deployment

After deploying, you'll have a URL like `https://lenzli-landing.vercel.app`

### Step 1: Add Domain in Vercel

1. Go to https://vercel.com/dashboard
2. Click your **lenzli-landing** project
3. Click **Settings** → **Domains**
4. Click **Add Domain**
5. Type: `lenzli.com`
6. Click **Add**

Vercel will show you DNS records to add.

### Step 2: Update DNS Records

Go to where you registered **lenzli.com** and add these records:

#### For the main domain (lenzli.com):
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### For www subdomain:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### Common Domain Registrars:

**GoDaddy:**
- My Products → Domain → DNS → Add Record

**Namecheap:**
- Domain List → Manage → Advanced DNS → Add New Record

**Google Domains:**
- My Domains → Manage → DNS → Custom Records

**Cloudflare:**
- DNS → Add Record

---

## ⏱️ Wait for DNS Propagation

- **Typical time:** 5-30 minutes
- **Maximum:** 24-48 hours (rare)

Check status at: https://whatsmydns.net/#A/lenzli.com

---

## ✅ Test Your Site

Once DNS propagates, visit:
- https://lenzli.com ✨
- https://www.lenzli.com ✨

Both should show your beautiful Lenzli landing page!

---

## 🎯 Alternative: Netlify (Also Very Easy)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /Users/sreekondaveeti/Downloads/lenzli-landing
netlify deploy --prod --dir=dist
```

Then add domain:
1. Netlify Dashboard → Site Settings → Domain Management
2. Add custom domain: `lenzli.com`
3. Follow DNS instructions

---

## 🔥 Alternative: Cloudflare Pages (Best for Cloudflare Users)

If your domain is already on Cloudflare:

1. Go to dash.cloudflare.com
2. Workers & Pages → Create Application → Pages
3. Upload assets → drag the `dist` folder
4. Custom Domains → Add `lenzli.com`

✅ DNS configured automatically if domain is on Cloudflare!

---

## 📊 Already Own lenzli.com?

**If you bought the domain from:**
- ✅ **GoDaddy** - Update DNS as shown above
- ✅ **Namecheap** - Update DNS in Advanced DNS section
- ✅ **Google Domains** - Update DNS in Custom records
- ✅ **Cloudflare** - Use Cloudflare Pages for easiest setup

**Don't own it yet?**
1. Buy lenzli.com from any registrar (GoDaddy, Namecheap, etc.)
2. Deploy your site first (get a Vercel URL)
3. Add DNS records to point domain to your deployment

---

## 🚨 Troubleshooting

### "Domain not resolving"
- Wait 15-30 minutes for DNS propagation
- Clear browser cache (Cmd + Shift + R on Mac)
- Check DNS at https://whatsmydns.net

### "SSL certificate error"
- Wait 5-10 minutes after DNS resolves
- Vercel/Netlify automatically provision SSL
- Should auto-fix within 15 minutes

### "Site showing old content"
- Clear browser cache
- Try incognito/private browsing
- Check you deployed latest build

---

## 💡 Pro Tips

1. **Use Vercel** for the smoothest experience with React/Vite
2. **Enable auto-deployments** by connecting your GitHub repo
3. **Test locally first** with `npm run dev` before deploying
4. **Check mobile** responsiveness at https://responsively.app

---

## 🎉 That's It!

Your Lenzli landing page should now be live at **lenzli.com**!

**Need help?** Check the full `DEPLOYMENT.md` guide or ask for assistance with your specific registrar.

---

### Quick Command Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
./deploy-vercel.sh

# Or manually
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

🚀 Happy deploying!

