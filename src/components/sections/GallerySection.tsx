import React, { useState } from 'react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { Lightbox } from '../ui/Lightbox';
import { GALLERY_IMAGES } from '../../data';

export const GallerySection: React.FC = () => {
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });

    const openLightbox = (index: number) => setLightbox({ open: true, index });
    const closeLightbox = () => setLightbox((prev) => ({ ...prev, open: false }));
    const navigateLightbox = (index: number) => setLightbox({ open: true, index });

    return (
        <section id="gallery" className="py-32 sm:py-48 bg-navy overflow-hidden">
            {/* Heading */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-16">
                <FadeUp>
                    <p className="section-label text-gold/70 mb-8 tracking-[0.4em]">Chapter V — The Perspective</p>
                </FadeUp>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                    <MaskReveal>
                        <h2 className="font-serif text-5xl sm:text-7xl font-light text-white leading-none">
                            Captured<br />
                            <em className="italic text-gold">Moments.</em>
                        </h2>
                    </MaskReveal>
                    <FadeUp delay={0.2}>
                        <p className="text-white/30 text-xs tracking-widest uppercase max-w-[200px] text-right hidden sm:block">
                            Swipe or scroll to explore
                        </p>
                    </FadeUp>
                </div>
            </div>

            {/* Filmstrip */}
            <FadeUp>
                <div className="pl-6 sm:pl-12 py-4">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                        {GALLERY_IMAGES.map((src, idx) => (
                            <button
                                key={idx}
                                onClick={() => openLightbox(idx)}
                                className="relative flex-shrink-0 w-72 sm:w-80 rounded-2xl overflow-hidden cursor-pointer group snap-start focus:outline-none focus:ring-2 focus:ring-gold"
                                aria-label={`Open gallery image ${idx + 1}`}
                                style={{
                                    height: idx % 3 === 0 ? '340px' : idx % 3 === 1 ? '300px' : '320px',
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`Villa Safira — photo ${idx + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                {/* Gold border on hover */}
                                <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/40 rounded-2xl transition-all duration-400" />
                                <div className="absolute bottom-4 left-4 text-white/0 group-hover:text-white/80 transition-all duration-400 text-xs tracking-widest uppercase">
                                    {String(idx + 1).padStart(2, '0')}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </FadeUp>

            {/* Hint for mobile */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-6">
                <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase sm:hidden">
                    Swipe to explore · Tap to enlarge
                </p>
                <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase hidden sm:block">
                    Click any image to enlarge · {GALLERY_IMAGES.length} photos
                </p>
            </div>

            {/* Lightbox */}
            <Lightbox
                isOpen={lightbox.open}
                images={GALLERY_IMAGES}
                index={lightbox.index}
                onClose={closeLightbox}
                onNavigate={navigateLightbox}
            />
        </section>
    );
};
