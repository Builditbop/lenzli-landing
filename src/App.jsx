import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSetup from './pages/ProfileSetup';
import Discover from './pages/Discover';
import Connections from './pages/Connections';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import BlockedUsers from './pages/BlockedUsers';
import SeedDatabase from './pages/SeedDatabase';
import Marketplace from './pages/Marketplace';
import Feed from './pages/Feed';
import Jobs from './pages/Jobs';
import Gallery from './pages/Gallery';
import Globe from './pages/Globe';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Safety from './pages/Safety';
import Conduct from './pages/Conduct';

function AppContent() {
  const location = useLocation();

  // Define which paths should show the navbar
  const showNavbarPaths = [
    '/discover', '/globe', '/connections', '/feed', '/jobs', 
    '/marketplace', '/gallery', '/messages', '/profile', 
    '/settings', '/blocked-users', '/edit-profile'
  ];

  const shouldShowNavbar = showNavbarPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowNavbar && <Navbar />}
      <div className="flex-1 relative">
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/conduct" element={<Conduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/profile-setup"
              element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <Discover />
                </ProtectedRoute>
              }
            />
            <Route path="/globe" element={<Globe />} />
            <Route
              path="/connections"
              element={
                <ProtectedRoute>
                  <Connections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blocked-users"
              element={
                <ProtectedRoute>
                  <BlockedUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seed-database"
              element={
                <ProtectedRoute>
                  <SeedDatabase />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
