import React, { useState } from 'react';

export default function Jobs() {
    const [activeTab, setActiveTab] = useState('all');

    const sampleJobs = [
        {
            id: 1,
            title: 'Wedding Photographer Needed',
            poster: 'Emily & James',
            location: 'San Francisco, CA',
            type: 'Gig',
            budget: '$2,000 - $3,500',
            posted: '2d ago',
            description: 'Looking for an experienced wedding photographer for our ceremony on March 15th. Must have portfolio of previous wedding work.',
            tags: ['Wedding', 'Portrait', 'Events'],
        },
        {
            id: 2,
            title: 'Product Photography for E-Commerce',
            poster: 'Bloom Skincare Co.',
            location: 'Remote',
            type: 'Contract',
            budget: '$500 - $1,200',
            posted: '5h ago',
            description: 'Need high-quality product photography for our new skincare line. 20 products, white background with lifestyle shots.',
            tags: ['Product', 'Commercial', 'Studio'],
        },
        {
            id: 3,
            title: 'Seeking Videographer for Music Video',
            poster: 'Luna Records',
            location: 'Los Angeles, CA',
            type: 'Gig',
            budget: '$3,000 - $5,000',
            posted: '1d ago',
            description: 'Indie artist looking for a creative videographer to shoot a music video. Concept involves outdoor locations and cinematic style.',
            tags: ['Video', 'Music', 'Cinematic'],
        },
        {
            id: 4,
            title: 'Real Estate Photography',
            poster: 'Luxe Properties',
            location: 'Miami, FL',
            type: 'Recurring',
            budget: '$200 - $400 per listing',
            posted: '3d ago',
            description: 'Ongoing opportunity to photograph luxury real estate listings. Must have wide-angle lens and experience with interior photography.',
            tags: ['Real Estate', 'Architecture', 'Interior'],
        },
    ];

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'gig', label: 'Gigs' },
        { id: 'contract', label: 'Contracts' },
        { id: 'recurring', label: 'Recurring' },
    ];

    const filteredJobs = activeTab === 'all'
        ? sampleJobs
        : sampleJobs.filter(j => j.type.toLowerCase() === activeTab);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="mx-auto max-w-4xl px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-black">Jobs & Gigs</h1>
                        <p className="text-gray-500">Find photography & videography opportunities</p>
                    </div>
                    <button className="rounded-xl bg-black text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post a Job
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card hover:border-gray-300 hover:shadow-elevated transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-black mb-1">{job.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {job.poster}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {job.location}
                                        </span>
                                        <span className="text-gray-400">· {job.posted}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-700">{job.type}</span>
                                    <span className="text-sm font-semibold text-black">{job.budget}</span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{job.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map((tag) => (
                                        <span key={tag} className="px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-600">{tag}</span>
                                    ))}
                                </div>
                                <button className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700">
                                    Apply
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Notice */}
                <div className="mt-8 text-center py-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Jobs board is being built</p>
                    <p className="text-gray-400 text-xs mt-1">Post and apply for creative opportunities soon</p>
                </div>
            </div>
        </div>
    );
}
