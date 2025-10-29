# 📸 Lenzli - Photography Social Network

A beautiful, modern landing page for **Lenzli** - a photography and filmmaking social platform that combines Tinder-style swiping with professional networking for visual creators.

![Lenzli](https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-blue)
![Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC)

## ✨ Features

### 🎨 Modern Design
- **Dark theme** optimized for visual content
- **Smooth animations** using CSS keyframes (no heavy dependencies)
- **Responsive layout** that works on all devices
- **Glassmorphism effects** for a premium feel

### 🔥 Key Sections

1. **Hero Section**
   - Eye-catching headline and value proposition
   - Email waitlist signup form
   - Interactive phone mockup with auto-rotating creator cards

2. **Interactive Phone Mockup**
   - Auto-cycling through photographer profiles every 4 seconds
   - Shows the Tinder-like swipe interface
   - Displays gear, roles, and creator information
   - Animated card stack effect

3. **Social Proof**
   - Featured platforms (Unsplash, Behance, etc.)
   - Early signup counter

4. **Features Showcase**
   - Swipe to discover creators
   - Real-time help pings for shoots
   - Smart filtering by gear, role, and style

5. **Statistics Section**
   - Active creators count
   - Collaboration metrics
   - Global reach indicators
   - App rating

6. **Testimonials**
   - Real creator stories
   - Location and role information
   - Authentic feedback from photographers and filmmakers

7. **How It Works**
   - 3-step process breakdown
   - Clear call-to-action flow

8. **FAQ Section**
   - Collapsible questions
   - Addresses common concerns

9. **Footer**
   - Brand links
   - Legal pages
   - Contact information

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

### Development

The project uses:
- **React 18** for UI components
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Vitest** for testing

## 📁 Project Structure

```
lenzli-landing/
├── src/
│   ├── App.jsx          # Main landing page component
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles (Tailwind imports)
│   └── __tests__/       # Test files
├── index.html           # HTML template with SEO meta tags
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 🎯 Key Components

### `PhoneMockup`
Interactive phone display that auto-cycles through photographer profiles every 4 seconds. Shows:
- Profile images from Unsplash
- Creator names and roles
- Camera gear information
- Swipe actions (Connect/Pass)
- Progress indicator dots

### `FeatureCard`
Highlights platform capabilities with icons and descriptions. Includes hover effects.

### `TestimonialCard`
Displays user feedback with author details, roles, and locations.

### `StatCard`
Shows key metrics with gradient text effects for visual appeal.

### `FAQ`
Collapsible question/answer pairs for common inquiries.

## 🎨 Design Highlights

- **Color Scheme**: Black background with white text and subtle gradients
- **Typography**: Clean, modern sans-serif with proper hierarchy
- **Animations**: 
  - Floating cards with CSS keyframes
  - Pulsing effects on main card
  - Smooth transitions on all interactive elements
  - Auto-rotating phone mockup content
- **Interactions**: Hover states, form validation, smooth scrolling
- **Accessibility**: Semantic HTML, proper ARIA labels

## 🌐 SEO Optimization

The landing page includes:
- Descriptive meta tags
- Open Graph tags for social sharing
- Twitter Card support
- Semantic HTML structure
- Optimized images from Unsplash CDN
- Proper heading hierarchy

## 📱 Responsive Design

Fully responsive with breakpoints for:
- Mobile (< 640px)
- Tablet (640px - 768px)
- Desktop (768px+)
- Large screens (1024px+)

## 🔧 Customization

### Changing Colors
Edit the Tailwind classes in `src/App.jsx` or extend the theme in `tailwind.config.js`.

### Updating Content
- **Hero text**: Modify the `<h1>` in the Hero section
- **Features**: Edit the `FeatureCard` components
- **Testimonials**: Update the `TestimonialCard` props
- **FAQ**: Add/remove `FAQ` components
- **Stats**: Update numbers in `StatCard` components

### Adding Images
Replace the Unsplash URLs in the `cards` array within `PhoneMockup` component.

### Customizing Animations
Modify the CSS keyframes in the `<style>` tag within the component or adjust timing in the `useEffect` hook.

## 🧪 Testing

```bash
# Run tests once
npm test

# Run tests with UI
npm run test:ui
```

## 📦 Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder, ready for deployment.

## 🚀 Deployment

Deploy to any static hosting service:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop the `dist` folder or connect repo
- **GitHub Pages**: Use GitHub Actions workflow
- **Cloudflare Pages**: Connect your repository

## 🎯 What Makes This Special

1. **No Heavy Dependencies**: Uses pure CSS animations instead of animation libraries
2. **Performance**: Optimized Vite build with code splitting
3. **Interactive Demo**: Phone mockup actually demonstrates the app's core feature
4. **Professional Design**: Dark theme that puts visual content first
5. **Creator-Focused**: Every section speaks to photographers and filmmakers
6. **Conversion-Optimized**: Multiple CTAs and clear value propositions

## 💡 Technical Highlights

- **React Hooks**: Uses `useState` and `useEffect` for state management
- **Component Architecture**: Modular, reusable components
- **CSS-in-JS**: Inline styles for animations to avoid build complexity
- **Tailwind Utility Classes**: Rapid UI development
- **Auto-rotating Content**: Demonstrates multiple creator profiles automatically

## 🤝 Contributing

This is a landing page for Lenzli. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary to Lenzli.

## 🎯 Future Enhancements

- [ ] Add video background in hero section
- [ ] Integrate actual waitlist API backend
- [ ] Add loading states and error handling
- [ ] Implement actual swipe gestures on mobile
- [ ] Add dark/light theme toggle
- [ ] Include blog section for creator stories
- [ ] Add creator spotlight carousel
- [ ] Integrate analytics (Google Analytics, Mixpanel)
- [ ] Add more interactive elements
- [ ] Implement lazy loading for images
- [ ] Add newsletter integration

---

Built with ❤️ for visual creators everywhere
