import React, { useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check, Images } from 'lucide-react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { Lightbox } from '../ui/Lightbox';
import { ROOMS } from '../../data';
import { handleBookNow } from '../../utils';
import Stack from '../../Stack';

export const RoomsSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightbox, setLightbox] = useState<{ open: boolean; images: string[]; index: number }>({
        open: false,
        images: [],
        index: 0,
    });

    const { scrollY } = useScroll();
    const bandY = useTransform(scrollY, [0, 900], [0, 40]);

    const openLightbox = (roomImages: string[], index: number) => {
        setLightbox({ open: true, images: roomImages, index });
    };

    const closeLightbox = () => setLightbox((prev) => ({ ...prev, open: false }));
    const navigateLightbox = (index: number) => setLightbox((prev) => ({ ...prev, index }));

    const activeRoom = ROOMS[Math.min(Math.max(activeIndex, 0), ROOMS.length - 1)];

    const cards = useMemo(() => {
        return ROOMS.map((room, i) => (
            <div key={room.title} className="relative w-full h-full">
                <button
                    type="button"
                    onClick={() => openLightbox(room.images, 0)}
                    className="group relative w-full h-full rounded-[2rem] overflow-hidden border border-sand bg-white/60 backdrop-blur-xl shadow-2xl shadow-warmBlack/10 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-ivory"
                    aria-label={`Open ${room.title} gallery`}
                >
                    <img
                        src={room.img}
                        alt={room.title}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-warmBlack/75 via-warmBlack/10 to-transparent" />
                    <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-ivory/85 border border-sand rounded-full px-4 py-2">
                        <span className="text-[10px] tracking-[0.35em] uppercase text-warmBlack/70">Room</span>
                        <span className="text-[10px] tracking-[0.35em] uppercase text-gold font-semibold">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-end justify-between gap-6">
                            <div className="text-left">
                                <p className="text-white/65 text-[10px] tracking-[0.3em] uppercase">Preview</p>
                                <h3 className="font-serif text-2xl sm:text-3xl text-white leading-tight mt-2">
                                    {room.title}
                                </h3>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-white/70 text-[10px] tracking-[0.3em] uppercase border border-white/20 bg-white/5 px-4 py-2 rounded-full">
                                <Images className="w-4 h-4" />
                                Open
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        ));
    }, []);

    return (
        <section id="rooms" className="relative py-32 sm:py-48 bg-gradient-to-b from-ivory via-cream to-ivory overflow-hidden min-h-screen snap-start scroll-mt-24">
            <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ivory to-transparent"
                style={{ y: bandY }}
            />
            <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ivory to-transparent"
                style={{ y: bandY }}
            />
            <div className="max-w-7xl mx-auto px-6 sm:px-12">

                <FadeUp>
                    <div className="sticky top-24 z-10 w-fit mb-10">
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                            <p className="section-label text-gold/70 tracking-[0.4em]">Chapter III — The Sanctuary</p>
                        </div>
                    </div>
                </FadeUp>

                <div className="mb-20">
                    <MaskReveal>
                        <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-warmBlack leading-none mb-6">
                            Choose your<br />
                            <em className="italic text-gold">Room.</em>
                        </h2>
                    </MaskReveal>
                    <FadeUp delay={0.2}>
                        <p className="text-warmMuted text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
                            Drag or tap through the stack to explore each room. Details update instantly — book the one that
                            fits your stay.
                        </p>
                    </FadeUp>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    <FadeUp>
                        <div className="relative">
                            <div className="relative w-full max-w-xl mx-auto lg:mx-0 aspect-[4/5]">
                                <Stack
                                    cards={cards}
                                    sensitivity={140}
                                    randomRotation
                                    sendToBackOnClick
                                    mobileClickOnly
                                    onActiveChange={setActiveIndex}
                                    animationConfig={{ stiffness: 240, damping: 22 }}
                                />
                            </div>
                            <p className="mt-6 text-warmMuted/70 text-[10px] tracking-[0.3em] uppercase text-center lg:text-left">
                                Tip: drag the card to switch rooms · tap to open gallery
                            </p>
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <div className="lg:sticky lg:top-28">
                            <div className="bg-white/70 border border-sand rounded-[2rem] backdrop-blur-xl shadow-2xl shadow-warmBlack/10 overflow-hidden">
                                <div className="p-7 sm:p-10">
                                    <div className="flex items-start justify-between gap-6">
                                        <div>
                                            <p className="section-label text-gold/70">Selected</p>
                                            <h3 className="font-serif text-3xl sm:text-4xl text-warmBlack leading-tight mt-3">
                                                {activeRoom?.title}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] tracking-[0.35em] uppercase text-warmMuted/70">Room</p>
                                            <p className="font-serif text-2xl text-gold mt-2">
                                                {String(activeIndex + 1).padStart(2, '0')}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-6 text-warmMuted text-base sm:text-lg leading-loose">
                                        {activeRoom?.desc}
                                    </p>

                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {activeRoom?.highlights.map((h) => (
                                            <span
                                                key={h}
                                                className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-warmMuted border border-sand px-3 py-2 rounded-full"
                                            >
                                                <Check className="w-3 h-3 text-gold" />
                                                {h}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-9 flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={handleBookNow}
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy text-white rounded-full text-xs tracking-[0.25em] uppercase font-semibold hover:bg-navyMid transition-all duration-300"
                                        >
                                            Book this room
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openLightbox(activeRoom?.images ?? [], 0)}
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold/30 text-gold rounded-full text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                                        >
                                            View gallery
                                            <Images className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-sand/80">
                                        <p className="text-[10px] tracking-[0.3em] uppercase text-warmMuted/70">Quick shots</p>
                                        <div className="mt-4 grid grid-cols-4 gap-3">
                                            {(activeRoom?.images ?? []).slice(0, 4).map((img, idx) => (
                                                <button
                                                    key={img}
                                                    type="button"
                                                    onClick={() => openLightbox(activeRoom.images, idx)}
                                                    className="relative aspect-square rounded-2xl overflow-hidden border border-sand hover:border-gold/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-ivory"
                                                    aria-label={`Open image ${idx + 1} for ${activeRoom.title}`}
                                                >
                                                    <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeUp>
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
