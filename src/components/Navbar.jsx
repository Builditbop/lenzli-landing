import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
    { to: '/discover', label: 'Discover', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { to: '/feed', label: 'Feed', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { to: '/globe', label: 'Globe', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { to: '/jobs', label: 'Jobs', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { to: '/marketplace', label: 'Marketplace', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { to: '/gallery', label: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { to: '/connections', label: 'Connections', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { to: '/messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { to: '/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { to: '/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function Navbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setIsNavigating(true);
        const timer = setTimeout(() => setIsNavigating(false), 400);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
            {/* Top Loading Progress Bar */}
            <div className={`absolute top-0 left-0 h-0.5 bg-black transition-all duration-500 ease-out z-50 ${isNavigating ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
            
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link to="/discover" className="flex items-center gap-2">
                    <svg aria-hidden viewBox="0 0 48 48" className="h-7 w-7" fill="none">
                        <rect x="3" y="3" width="42" height="42" rx="12" stroke="#000" strokeWidth="2" />
                        <circle cx="24" cy="24" r="9" stroke="#000" strokeWidth="2" />
                        <path d="M24 15v18M15 24h18" stroke="#000" strokeWidth="1.5" strokeOpacity="0.4" />
                    </svg>
                    <span className="text-xl font-bold tracking-tight text-black">Lenzli</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.to)
                                    ? 'bg-black text-white shadow-sm'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                            </svg>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        {mobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(link.to)
                                        ? 'bg-black text-white shadow-sm'
                                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                                </svg>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
