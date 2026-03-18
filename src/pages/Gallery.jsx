import React, { useState } from 'react';

export default function Gallery() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'portrait', label: 'Portrait' },
        { id: 'landscape', label: 'Landscape' },
        { id: 'street', label: 'Street' },
        { id: 'fashion', label: 'Fashion' },
        { id: 'wedding', label: 'Wedding' },
        { id: 'product', label: 'Product' },
    ];

    // Placeholder gallery items with varied aspect ratios
    const galleryItems = [
        { id: 1, category: 'portrait', author: 'Sarah Chen', aspect: 'tall' },
        { id: 2, category: 'landscape', author: 'Marcus Rivera', aspect: 'wide' },
        { id: 3, category: 'street', author: 'Aisha Patel', aspect: 'square' },
        { id: 4, category: 'fashion', author: 'Jake Wilson', aspect: 'tall' },
        { id: 5, category: 'wedding', author: 'Emma Davis', aspect: 'wide' },
        { id: 6, category: 'product', author: 'Chris Lee', aspect: 'square' },
        { id: 7, category: 'portrait', author: 'Mia Johnson', aspect: 'wide' },
        { id: 8, category: 'landscape', author: 'David Kim', aspect: 'tall' },
        { id: 9, category: 'street', author: 'Olivia Brown', aspect: 'square' },
        { id: 10, category: 'fashion', author: 'Liam Garcia', aspect: 'wide' },
        { id: 11, category: 'wedding', author: 'Sophia Miller', aspect: 'tall' },
        { id: 12, category: 'product', author: 'Noah Taylor', aspect: 'square' },
    ];

    const filteredItems = selectedCategory === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === selectedCategory);

    const getAspectClass = (aspect) => {
        switch (aspect) {
            case 'tall': return 'row-span-2';
            case 'wide': return 'col-span-2';
            default: return '';
        }
    };

    const getGradient = (id) => {
        const gradients = [
            'from-gray-200 to-gray-300',
            'from-gray-100 to-gray-200',
            'from-gray-300 to-gray-400',
            'from-gray-150 to-gray-250',
        ];
        return gradients[id % gradients.length];
    };

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-black">Gallery</h1>
                    <p className="text-gray-500">Explore stunning work from creators in the community</p>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className={`relative rounded-2xl overflow-hidden border border-gray-200 group cursor-pointer transition-all hover:shadow-elevated ${getAspectClass(item.aspect)}`}
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className={`w-full h-full bg-gradient-to-br ${getGradient(item.id)} flex items-center justify-center`}>
                                <svg className="w-12 h-12 text-gray-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="font-semibold text-white text-sm">{item.author}</div>
                                    <div className="text-white/70 text-xs capitalize">{item.category}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Notice */}
                <div className="mt-8 text-center py-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Gallery is being built</p>
                    <p className="text-gray-400 text-xs mt-1">Community portfolio showcase coming soon</p>
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-gray-400/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500 font-medium">{selectedImage.author}</p>
                                <p className="text-gray-400 text-sm capitalize">{selectedImage.category}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
