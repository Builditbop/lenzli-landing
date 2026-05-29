#!/bin/bash

# Quick deployment script for Lenzli to Vercel

echo "🚀 Deploying Lenzli to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

# Build the project
echo "🔨 Building production site..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    # Deploy to Vercel
    echo "🌍 Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Click on your lenzli-landing project"
    echo "3. Go to Settings → Domains"
    echo "4. Add 'lenzli.com' as a custom domain"
    echo "5. Update your DNS records at your domain registrar"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed DNS configuration"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

