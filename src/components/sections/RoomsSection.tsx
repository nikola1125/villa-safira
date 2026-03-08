import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { Lightbox } from '../ui/Lightbox';
import { ROOMS } from '../../data';
import { handleBookNow } from '../../utils';

export const RoomsSection: React.FC = () => {
    const [lightbox, setLightbox] = useState<{ open: boolean; images: string[]; index: number }>({
        open: false,
        images: [],
        index: 0,
    });

    const openLightbox = (roomImages: string[], index: number) => {
        setLightbox({ open: true, images: roomImages, index });
    };

    const closeLightbox = () => setLightbox((prev) => ({ ...prev, open: false }));
    const navigateLightbox = (index: number) => setLightbox((prev) => ({ ...prev, index }));

    return (
        <section id="rooms" className="py-32 sm:py-48 bg-navy">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">

                <FadeUp>
                    <p className="section-label text-gold/70 mb-10 tracking-[0.4em]">Chapter III — The Sanctuary</p>
                </FadeUp>

                <div className="mb-20">
                    <MaskReveal>
                        <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-white leading-none mb-6">
                            Private<br />
                            <em className="italic text-gold">Sanctuaries.</em>
                        </h2>
                    </MaskReveal>
                    <FadeUp delay={0.2}>
                        <p className="text-white/40 text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
                            Four boutique rooms designed for deep rest. Each space is a blend of minimal coastal
                            aesthetics and premium Albanian hospitality.
                        </p>
                    </FadeUp>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
                    {ROOMS.map((room, i) => (
                        <FadeUp key={room.title} delay={i * 0.1}>
                            <div className="group bg-navyMid border border-navyLight rounded-xl sm:rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-500 shadow-lg hover:shadow-gold/10 hover:shadow-2xl">
                                {/* Image */}
                                <div
                                    className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                                    onClick={() => openLightbox(room.images, 0)}
                                >
                                    <motion.img
                                        src={room.img}
                                        alt={room.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navyMid/80 to-transparent" />
                                    {/* Room number badge */}
                                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/10 backdrop-blur-sm border border-white/10 text-white/60 text-[8px] sm:text-[10px] tracking-[0.3em] uppercase px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                                        R{String(i + 1).padStart(2, '0')}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-[8px] sm:text-[10px] tracking-[0.3em] uppercase bg-black/40 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                                            Gallery
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-7">
                                    <h3
                                        className="font-serif text-base sm:text-2xl font-medium text-white mb-2 sm:mb-3 group-hover:text-goldLight transition-colors duration-300 cursor-pointer line-clamp-1"
                                        onClick={() => openLightbox(room.images, 0)}
                                    >
                                        {room.title}
                                    </h3>
                                    <p className="text-white/45 text-[10px] sm:text-sm leading-relaxed mb-4 sm:mb-5 line-clamp-2">{room.desc}</p>

                                    {/* Highlights */}
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                                        {room.highlights.slice(0, 2).map((h) => (
                                            <span
                                                key={h}
                                                className="inline-flex items-center gap-1 text-[8px] sm:text-[10px] tracking-widest uppercase text-white/50 border border-white/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full"
                                            >
                                                <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gold" />
                                                {h}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleBookNow}
                                        className="w-full sm:w-auto text-[8px] sm:text-xs tracking-[0.2em] uppercase font-semibold text-gold border border-gold/30 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </div>

            <Lightbox
                isOpen={lightbox.open}
                images={lightbox.images}
                index={lightbox.index}
                onClose={closeLightbox}
                onNavigate={navigateLightbox}
            />
        </section>
    );
};
