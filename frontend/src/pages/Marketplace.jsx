import React, { useState, useMemo } from 'react';
import { Search, Plus, ShoppingBag, Heart, MapPin, Tag, ExternalLink, Filter, Package, BookOpen, Layers } from 'lucide-react';

export default function Marketplace() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [savedItems, setSavedItems] = useState(new Set());

    const marketplaceItems = [
        {
            id: 1,
            title: 'Sony A7IV - Gently Used',
            seller: 'Marcus Visuals',
            location: 'Austin, TX',
            category: 'equipment',
            type: 'Physical',
            condition: 'Excellent',
            price: 2100,
            posted: '1d ago',
            description: 'Selling my backup A7IV. Low shutter count (under 5k). Includes original box and 2 extra batteries.',
            tags: ['Camera', 'Sony', 'Full Frame'],
            color: 'bg-blue-500/10'
        },
        {
            id: 2,
            title: 'Cinematic Dream Preset Pack',
            seller: 'Elena Styles',
            location: 'Digital Download',
            category: 'presets',
            type: 'Digital',
            condition: 'New',
            price: 45,
            posted: '3h ago',
            description: '15 Lightroom presets designed for outdoor and natural light photography. Gives a warm, cinematic film look.',
            tags: ['Lightroom', 'Presets', 'Editing'],
            color: 'bg-purple-500/10'
        },
        {
            id: 3,
            title: 'Mastering Studio Lighting',
            seller: 'Studio Pro Academy',
            location: 'Online Course',
            category: 'education',
            type: 'Digital',
            condition: 'Course',
            price: 199,
            posted: '5d ago',
            description: 'Comprehensive 10-module course on high-end studio lighting for portraits and products. Includes 1-on-1 feedback session.',
            tags: ['Education', 'Studio', 'Lighting'],
            color: 'bg-orange-500/10'
        },
        {
            id: 4,
            title: 'DJI RS3 Pro Gimbal',
            seller: 'FilmRentals Co.',
            location: 'New York, NY',
            category: 'equipment',
            type: 'Physical',
            condition: 'Like New',
            price: 650,
            posted: '2d ago',
            description: 'Like new RS3 Pro. Only used on two shoots. Comes with all accessories and carrying case.',
            tags: ['Gimbal', 'Video', 'DJI'],
            color: 'bg-green-500/10'
        },
        {
            id: 5,
            title: '85mm f/1.4 GM Lens',
            seller: 'Sarah Jenkins',
            location: 'Portland, OR',
            category: 'equipment',
            type: 'Physical',
            condition: 'Good',
            price: 1250,
            posted: '4h ago',
            description: 'Sharpest portrait lens I have ever owned. Selling to switch systems. No scratches or dust.',
            tags: ['Lens', 'Portrait', 'Sony'],
            color: 'bg-red-500/10'
        },
        {
            id: 6,
            title: 'Pro Color Grading LUTs',
            seller: 'Visionary Films',
            location: 'Digital Download',
            category: 'presets',
            type: 'Digital',
            condition: 'New',
            price: 29,
            posted: '1w ago',
            description: '5 heavy-duty LUTs for Davinci Resolve and Premiere Pro. Perfect for Log footage.',
            tags: ['LUTs', 'Color Grading', 'Video'],
            color: 'bg-indigo-500/10'
        }
    ];

    const tabs = [
        { id: 'all', label: 'All', icon: <Layers className="w-4 h-4" /> },
        { id: 'equipment', label: 'Equipment', icon: <Package className="w-4 h-4" /> },
        { id: 'presets', label: 'Presets', icon: <Tag className="w-4 h-4" /> },
        { id: 'education', label: 'Education', icon: <BookOpen className="w-4 h-4" /> },
    ];

    const toggleSave = (id) => {
        const newSaved = new Set(savedItems);
        if (newSaved.has(id)) newSaved.delete(id);
        else newSaved.add(id);
        setSavedItems(newSaved);
    };

    const filteredItems = useMemo(() => {
        return marketplaceItems.filter(item => {
            const matchesTab = activeTab === 'all' || item.category === activeTab;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 item.seller.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--text-primary)]/5 text-[var(--text-primary)]/60 text-xs font-bold tracking-widest uppercase">
                            <ShoppingBag className="w-3 h-3" />
                            Community Market
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl">Marketplace</h1>
                        <p className="text-lg text-[var(--text-secondary)] max-w-xl">The best gear, creative assets, and learning resources from the Lenzli community.</p>
                    </div>
                    
                    <button className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent-color)] px-6 py-4 text-sm font-bold text-[var(--accent-text)] shadow-xl hover:opacity-90 hover:-translate-y-0.5 transition-all active:scale-95 group">
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        List an Item
                    </button>
                </div>

                {/* Filters and Search Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--text-primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search equipment, presets, sellers..."
                            className="w-full rounded-2xl border-none bg-[var(--card-bg)] py-4 pl-12 pr-4 text-sm shadow-sm ring-1 ring-[var(--border-color)] focus:ring-2 focus:ring-[var(--accent-color)] outline-none transition-all text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 no-scrollbar font-bold">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 whitespace-nowrap px-5 py-3.5 rounded-2xl text-sm transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-[var(--accent-color)] text-[var(--accent-text)] shadow-lg'
                                        : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 ring-1 ring-[var(--border-color)] shadow-sm'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <button className="hidden sm:flex items-center justify-center p-3.5 rounded-2xl bg-[var(--card-bg)] ring-1 ring-[var(--border-color)] shadow-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Results Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div 
                                key={item.id} 
                                className="group relative flex flex-col rounded-[2.5rem] bg-[var(--card-bg)] p-2 shadow-sm ring-1 ring-[var(--border-color)] hover:shadow-2xl hover:ring-[var(--accent-color)]/20 transition-all duration-500 ease-out cursor-pointer overflow-hidden"
                            >
                                {/* Placeholder "Image" Area */}
                                <div className={`aspect-[4/3] rounded-[2rem] ${item.color} flex items-center justify-center relative overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]`}>
                                    <ShoppingBag className="w-12 h-12 text-[var(--text-primary)]/10 transition-transform duration-500 group-hover:scale-110" />
                                    
                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }}
                                            className={`p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all ${
                                                savedItems.has(item.id) ? 'bg-red-500 text-white' : 'bg-[var(--card-bg)]/80 text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                                            }`}
                                        >
                                            <Heart className={`w-4 h-4 ${savedItems.has(item.id) ? 'fill-current' : ''}`} />
                                        </button>
                                        <button className="p-2.5 rounded-full bg-[var(--card-bg)]/80 text-[var(--text-primary)] backdrop-blur-md shadow-lg hover:bg-[var(--card-bg)] transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute bottom-4 left-4">
                                        <span className="px-3 py-1.5 rounded-xl bg-[var(--card-bg)]/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] shadow-sm">
                                            {item.condition}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight group-hover:opacity-70 transition-opacity">
                                            {item.title}
                                        </h3>
                                        <span className="text-xl font-black text-[var(--text-primary)]">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-xs font-medium text-[var(--text-secondary)] mb-4">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {item.location}
                                        </span>
                                        <span className="opacity-30">•</span>
                                        <span className="flex items-center gap-1 font-bold text-[var(--text-primary)]/40">
                                            {item.seller}
                                        </span>
                                    </div>

                                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {item.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="px-2 py-1 rounded-lg bg-[var(--text-primary)]/5 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter ring-1 ring-[var(--border-color)]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <button className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-[var(--accent-text)] text-xs font-bold hover:opacity-80 transition-opacity active:scale-95">
                                            Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-6 rounded-[3rem] bg-[var(--card-bg)] ring-1 ring-[var(--border-color)] shadow-sm text-center">
                        <div className="w-20 h-20 bg-[var(--text-primary)]/5 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-8 h-8 text-[var(--text-secondary)]/30" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">No items found</h3>
                        <p className="text-[var(--text-secondary)] max-w-xs mx-auto">We couldn't find anything matching your search. Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                            className="mt-8 text-sm font-bold text-[var(--text-primary)] underline underline-offset-4 hover:opacity-70 transition-opacity"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Enhanced Coming Soon Section */}
                <div className="mt-20 relative overflow-hidden rounded-[3rem] bg-[var(--accent-color)] p-12 text-center shadow-2xl group">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none text-[var(--accent-text)]">
                        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full bg-current opacity-[0.05] blur-[120px] rounded-full rotate-45 group-hover:translate-x-12 transition-transform duration-1000"></div>
                        <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full bg-current opacity-[0.05] blur-[120px] rounded-full -rotate-45 group-hover:-translate-x-12 transition-transform duration-1000"></div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-[var(--accent-text)]/10 rounded-3xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-transform duration-500">
                            <ShoppingBag className="w-8 h-8 text-[var(--accent-text)]" />
                        </div>
                        <h2 className="text-3xl font-black text-[var(--accent-text)] mb-4 sm:text-4xl">Coming Very Soon</h2>
                        <p className="text-[var(--accent-text)] opacity-60 max-w-lg mx-auto text-lg font-medium leading-relaxed">
                            We're finishing the secure checkout and listing verification system to make buying and selling safe for everyone.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <div className="px-6 py-3 rounded-2xl bg-[var(--accent-text)]/10 text-[var(--accent-text)] text-sm font-bold border border-[var(--accent-text)]/10">Secure Checkout</div>
                            <div className="px-6 py-3 rounded-2xl bg-[var(--accent-text)]/10 text-[var(--accent-text)] text-sm font-bold border border-[var(--accent-text)]/10">Verified Sellers</div>
                            <div className="px-6 py-3 rounded-2xl bg-[var(--accent-text)]/10 text-[var(--accent-text)] text-sm font-bold border border-[var(--accent-text)]/10">Direct Messaging</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
