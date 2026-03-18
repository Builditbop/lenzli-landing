import React from 'react';

export default function Feed() {
    const samplePosts = [
        {
            id: 1,
            author: 'Sarah Chen',
            role: 'Portrait Photographer',
            timeAgo: '2h ago',
            content: 'Just wrapped up an incredible golden hour session at Griffith Observatory. The light was absolutely perfect today ✨',
            likes: 24,
            comments: 8,
        },
        {
            id: 2,
            author: 'Marcus Rivera',
            role: 'Videographer',
            timeAgo: '5h ago',
            content: 'Looking for a sound designer to collaborate on a short film project. DM me if interested!',
            likes: 15,
            comments: 12,
        },
        {
            id: 3,
            author: 'Aisha Patel',
            role: 'Fashion Photographer',
            timeAgo: '1d ago',
            content: 'Tip for new photographers: Don\'t underestimate the power of natural reflectors. White walls, sidewalks, and buildings can create beautiful fill light without any gear.',
            likes: 89,
            comments: 23,
        },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="mx-auto max-w-2xl px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-black">Feed</h1>
                    <p className="text-gray-500">Updates and posts from the creator community</p>
                </div>

                {/* Create Post */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6 shadow-card">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                        <div className="flex-1">
                            <textarea
                                placeholder="Share something with the community..."
                                className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all resize-none h-20 text-gray-900 placeholder-gray-400"
                            />
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                    <button className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Photo
                                    </button>
                                    <button className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        Tag
                                    </button>
                                </div>
                                <button className="rounded-xl bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition-all shadow-subtle">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts */}
                <div className="space-y-4">
                    {samplePosts.map((post) => (
                        <div key={post.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card hover:border-gray-300 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="font-semibold text-black">{post.author}</div>
                                    <div className="text-xs text-gray-400">{post.role} · {post.timeAgo}</div>
                                </div>
                                <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
                            <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                                <button className="flex items-center gap-1.5 text-gray-500 hover:text-black text-sm transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {post.likes}
                                </button>
                                <button className="flex items-center gap-1.5 text-gray-500 hover:text-black text-sm transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {post.comments}
                                </button>
                                <button className="flex items-center gap-1.5 text-gray-500 hover:text-black text-sm transition-colors ml-auto">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Notice */}
                <div className="mt-8 text-center py-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Feed is being built</p>
                    <p className="text-gray-400 text-xs mt-1">More features coming soon</p>
                </div>
            </div>
        </div>
    );
}
