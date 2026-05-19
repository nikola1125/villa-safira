import React, { useMemo, useRef, useState, startTransition } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Images } from 'lucide-react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { Lightbox } from '../ui/Lightbox';
import { ROOMS } from '../../data';
import { handleBookNow } from '../../utils';
import Stack, { type StackHandle } from '../../Stack';

export const RoomsSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightbox, setLightbox] = useState<{ open: boolean; images: string[]; index: number }>({
        open: false,
        images: [],
        index: 0,
    });

    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    const { scrollY } = useScroll();
    const bandY = useTransform(scrollY, [0, 900], isMobile ? [0, 0] : [0, 40]);

    const openLightbox = (roomImages: string[], index: number) => {
        setLightbox({ open: true, images: roomImages, index });
    };

    const closeLightbox = () => setLightbox((prev) => ({ ...prev, open: false }));
    const navigateLightbox = (index: number) => setLightbox((prev) => ({ ...prev, index }));

    const stackRef = useRef<StackHandle>(null);
    const activeRoom = ROOMS[Math.min(Math.max(activeIndex, 0), ROOMS.length - 1)];

    const cards = useMemo(() => {
        return ROOMS.map((room, i) => {
            let downX = 0, downY = 0;
            return (
            <div key={room.title} className="relative w-full h-full">
                <div
                    className="group relative w-full h-full rounded-[2rem] overflow-hidden border border-sand bg-white/60 backdrop-blur-xl shadow-2xl shadow-warmBlack/10 cursor-pointer"
                    aria-label={`Open ${room.title} gallery`}
                    onPointerDown={(e) => { downX = e.clientX; downY = e.clientY; }}
                    onPointerUp={(e) => {
                        const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
                        if (dist < 8) openLightbox(room.images, 0);
                    }}
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
                </div>
            </div>
            );
        });
    }, []);

    return (
        <section id="rooms" className="relative pt-16 pb-10 md:pt-24 md:pb-6 bg-gradient-to-b from-ivory via-cream to-ivory overflow-x-hidden md:overflow-hidden md:h-screen snap-start md:flex md:flex-col md:justify-center">
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
                    <div className="w-fit mb-4">
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                            <p className="section-label text-gold/70 tracking-[0.4em]">Chapter III — The Sanctuary</p>
                        </div>
                    </div>
                </FadeUp>

                <div className="mb-3">
                    <MaskReveal>
                        <h2 className="font-serif text-4xl sm:text-5xl font-light text-warmBlack leading-none mb-2">
                            Choose your<br />
                            <em className="italic text-gold">Room.</em>
                        </h2>
                    </MaskReveal>
                    <FadeUp delay={0.2}>
                        <p className="text-warmMuted text-sm sm:text-base max-w-2xl font-light leading-relaxed">
                            Drag or tap through the stack to explore each room.
                        </p>
                    </FadeUp>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-start">
                    <FadeUp>
                        <div className="relative group">
                            <div className="relative w-full max-w-xl mx-auto lg:mx-0 h-[52vh] sm:h-[62vh] pr-8 md:pr-0 outline-none focus:outline-none [&_*]:outline-none">
                                <Stack
                                    ref={stackRef}
                                    cards={cards}
                                    sensitivity={140}
                                    randomRotation
                                    sendToBackOnClick
                                    mobileDragOnly
                                    onActiveChange={(i) => startTransition(() => setActiveIndex(i))}
                                    animationConfig={{ stiffness: 460, damping: 42 }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-warmMuted/70 text-[10px] tracking-[0.3em] uppercase">
                                    <span className="md:hidden">Swipe to explore rooms</span>
                                    <span className="hidden md:inline">Tap image to open gallery</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => stackRef.current?.prev()}
                                        className="w-9 h-9 rounded-full border border-sand bg-white/70 backdrop-blur-sm flex items-center justify-center text-warmMuted hover:border-gold/50 hover:text-gold transition-all duration-200"
                                        aria-label="Previous room"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => stackRef.current?.next()}
                                        className="w-9 h-9 rounded-full border border-sand bg-white/70 backdrop-blur-sm flex items-center justify-center text-warmMuted hover:border-gold/50 hover:text-gold transition-all duration-200"
                                        aria-label="Next room"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </FadeUp>

                    <FadeUp delay={0.1}>
                        <div className="pl-2 md:-mt-10">
                            <div className="bg-white/70 border border-sand rounded-[2rem] backdrop-blur-xl shadow-2xl shadow-warmBlack/10 overflow-hidden md:min-h-[72vh] flex flex-col">
                                <div className="p-5 sm:p-6 flex flex-col flex-1">
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

                                    <div className="mt-3 flex flex-wrap gap-2">
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

                                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
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

                                    <div className="mt-auto pt-4 border-t border-sand/80">
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
