import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PageTransition from './components/PageTransition';

import Landing from './pages/Landing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Safety from './pages/Safety';
import Conduct from './pages/Conduct';

/**
 * Landing-only app for Vercel deployment.
 * No login, signup, or protected routes — just the landing page, waitlist, and legal pages.
 */
function AppLanding() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 relative">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/conduct" element={<Conduct />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageTransition>
        </div>
      </div>
    </Router>
  );
}

export default AppLanding;
