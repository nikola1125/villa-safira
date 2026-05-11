import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { Lightbox } from '../ui/Lightbox';
import { GALLERY_IMAGES } from '../../data';

export const GallerySection: React.FC = () => {
    const [lightbox, setLightbox] = useState({ open: false, index: 0 });

    const { scrollY } = useScroll();
    const bandY = useTransform(scrollY, [0, 900], [0, 40]);

    const openLightbox = (index: number) => setLightbox({ open: true, index });
    const closeLightbox = () => setLightbox((prev) => ({ ...prev, open: false }));
    const navigateLightbox = (index: number) => setLightbox({ open: true, index });

    return (
        <section id="gallery" className="relative pt-24 pb-6 bg-gradient-to-b from-ivory via-cream to-ivory overflow-hidden h-screen snap-start flex flex-col justify-center">
            <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ivory to-transparent"
                style={{ y: bandY }}
            />
            <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ivory to-transparent"
                style={{ y: bandY }}
            />
            {/* Heading */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-6">
                <FadeUp>
                    <div className="w-fit mb-4">
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                            <p className="section-label text-gold/70 tracking-[0.4em]">Chapter V — The Perspective</p>
                        </div>
                    </div>
                </FadeUp>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                    <MaskReveal>
                        <h2 className="font-serif text-5xl sm:text-7xl font-light text-warmBlack leading-none">
                            A light-filled
                            <br />
                            <em className="italic text-gold">stay.</em>
                        </h2>
                    </MaskReveal>
                    <FadeUp delay={0.2}>
                        <p className="text-warmMuted/70 text-xs tracking-widest uppercase max-w-[260px] text-right hidden sm:block">
                            Tap any image to open the full gallery
                        </p>
                    </FadeUp>
                </div>
            </div>

            {/* Filmstrip */}
            <FadeUp>
                <div className="max-w-7xl mx-auto px-6 sm:px-12">
                    <div className="grid lg:grid-cols-12 gap-4 items-start">
                        <button
                            onClick={() => openLightbox(0)}
                            className="relative lg:col-span-7 h-[45vh] rounded-[2.5rem] overflow-hidden border border-sand bg-white/60 shadow-2xl shadow-warmBlack/10 group focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-ivory"
                            aria-label="Open gallery"
                        >
                            <motion.img
                                src={GALLERY_IMAGES[0]}
                                alt="Villa Safira — featured"
                                loading="eager"
                                className="absolute inset-0 w-full h-full object-cover"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-warmBlack/70 via-warmBlack/10 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6">
                                <div className="text-left">
                                    <p className="text-white/60 text-[10px] tracking-[0.35em] uppercase">Villa Safira</p>
                                    <p className="mt-2 font-serif text-2xl sm:text-3xl text-white">A day by the coast</p>
                                </div>
                                <div className="hidden sm:flex text-white/70 text-[10px] tracking-[0.35em] uppercase border border-white/20 bg-white/5 px-4 py-2 rounded-full">
                                    Open
                                </div>
                            </div>
                        </button>

                        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                            {GALLERY_IMAGES.slice(1, 5).map((src, idx) => (
                                <button
                                    key={src}
                                    onClick={() => openLightbox(idx + 1)}
                                    className="relative h-[21vh] rounded-[2rem] overflow-hidden border border-sand bg-white/60 shadow-xl shadow-warmBlack/10 group focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-ivory"
                                    aria-label={`Open gallery image ${idx + 2}`}
                                >
                                    <img
                                        src={src}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-warmBlack/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </FadeUp>

            {/* Hint for mobile */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-6">
                <p className="text-warmMuted/60 text-[10px] tracking-[0.3em] uppercase sm:hidden">
                    Swipe to explore · Tap to enlarge
                </p>
                <p className="text-warmMuted/60 text-[10px] tracking-[0.3em] uppercase hidden sm:block">
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
