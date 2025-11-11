import posthog from 'posthog-js'

let isInitialized = false

// Initialize PostHog (optional)
export const initPostHog = () => {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

  if (posthogKey && posthogKey !== 'your-posthog-key-here') {
    try {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        loaded: (posthog) => {
          // Callback fires when PostHog is fully loaded
          if (import.meta.env.DEV) {
            console.log('PostHog initialized successfully')
          }
        },
        // Enable autocapture for better insights
        autocapture: true,
        // Capture pageviews automatically
        capture_pageview: true,
        // Capture pageleaves automatically
        capture_pageleave: true,
      })
      // Mark as initialized immediately - PostHog will queue calls made before it's fully loaded
      isInitialized = true
    } catch (error) {
      console.error('Failed to initialize PostHog:', error)
      isInitialized = false
    }
  } else {
    if (import.meta.env.DEV) {
      console.log('PostHog key not found. Analytics will not be tracked.')
    }
    isInitialized = false
  }
}

// Check if PostHog is initialized
export const isPostHogInitialized = () => isInitialized

// Safe wrapper for PostHog methods
// PostHog methods are safe to call even before initialization (they queue calls)
// But we check isInitialized to avoid unnecessary calls when PostHog isn't configured
const safePostHog = {
  identify: (...args) => {
    if (isInitialized && typeof posthog.identify === 'function') {
      try {
        posthog.identify(...args)
      } catch (error) {
        console.error('PostHog identify error:', error)
      }
    }
  },
  reset: () => {
    if (isInitialized && typeof posthog.reset === 'function') {
      try {
        posthog.reset()
      } catch (error) {
        console.error('PostHog reset error:', error)
      }
    }
  },
  capture: (...args) => {
    if (isInitialized && typeof posthog.capture === 'function') {
      try {
        posthog.capture(...args)
      } catch (error) {
        console.error('PostHog capture error:', error)
      }
    }
  },
  // Expose the full posthog instance for advanced usage
  get instance() {
    return isInitialized ? posthog : null
  }
}

// Export the safe wrapper as default
export default safePostHog

