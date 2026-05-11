import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, ChevronDown, MapPin, ShieldCheck, Star } from 'lucide-react';
import { handleBookNow, scrollToSection } from '../../utils';

export const HeroSection: React.FC = () => {
    const shouldReduceMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        const media = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    const enableParallax = useMemo(() => !shouldReduceMotion && !isMobile, [shouldReduceMotion, isMobile]);

    const heroY = useTransform(scrollY, [0, 800], [0, enableParallax ? 320 : 0]);
    const heroScale = useTransform(scrollY, [0, 800], [1, enableParallax ? 1.06 : 1]);

    return (
        <section id="hero" className="relative overflow-hidden h-screen snap-start">
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('./jasht3.jpg')",
                    y: heroY,
                    scale: heroScale,
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/55 to-ivory" />

            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                }}
            />

            <div className="relative z-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-36 sm:pt-40 pb-16 sm:pb-24">
                    <div className="grid lg:grid-cols-12 gap-10 items-end">
                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.2 }}
                                className="inline-flex items-center gap-2 border border-white/20 text-white/80 text-[10px] tracking-[0.35em] uppercase px-5 py-2.5 rounded-full mb-7 bg-white/5 backdrop-blur-sm"
                            >
                                <MapPin className="w-3 h-3" />
                                Durrës · 100m from the Adriatic
                            </motion.div>

                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: '110%' }}
                                    animate={{ y: '0%' }}
                                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                                    className="font-serif text-white font-semibold leading-[0.92] tracking-tight"
                                    style={{ fontSize: 'clamp(3.1rem, 7.4vw, 6.6rem)' }}
                                >
                                    A boutique villa
                                    <br />
                                    designed for calm.
                                </motion.h1>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.75 }}
                                className="mt-7 text-white/65 text-base sm:text-lg leading-loose max-w-xl"
                            >
                                Villa Safira offers four private rooms, fresh breakfast, and the sea within a two-minute walk.
                                Simple to book, unforgettable to stay.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0, duration: 0.8 }}
                                className="mt-10 flex flex-col sm:flex-row gap-4"
                            >
                                <button
                                    onClick={handleBookNow}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-white font-semibold text-xs tracking-[0.25em] uppercase rounded-full hover:bg-goldDark transition-all duration-300 shadow-xl shadow-gold/20"
                                >
                                    Book on Booking.com
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => scrollToSection('rooms')}
                                    className="px-8 py-4 border border-white/30 text-white font-medium text-xs tracking-[0.25em] uppercase rounded-full hover:border-white/70 hover:bg-white/10 transition-all duration-300"
                                >
                                    Choose a room
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.9 }}
                                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-white/55 text-[10px] tracking-[0.25em] uppercase"
                            >
                                <div className="flex items-center gap-2">
                                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                                    <span>4.9 guest rating</span>
                                </div>
                                <div className="w-px h-3 bg-white/20 hidden sm:block" />
                                <span>Breakfast included</span>
                                <div className="w-px h-3 bg-white/20 hidden sm:block" />
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                                    <span>Safe & quiet</span>
                                </div>
                            </motion.div>
                        </div>

                        <motion.aside
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.55 }}
                            className="lg:col-span-5 hidden lg:block"
                        >
                            <div className="rounded-[2.5rem] border border-white/15 bg-white/6 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/25">
                                <div className="p-7 sm:p-9">
                                    <p className="text-white/70 text-[10px] tracking-[0.45em] uppercase">Limited dates</p>
                                    <p className="mt-4 font-serif text-3xl sm:text-4xl text-white leading-tight">
                                        Summer stays
                                        <br />
                                        near the sea.
                                    </p>
                                    <p className="mt-5 text-white/60 leading-loose">
                                        Pick your room and reserve in minutes. For questions, message us any time.
                                    </p>
                                    <div className="mt-7 grid grid-cols-2 gap-3">
                                        <button
                                            onClick={handleBookNow}
                                            className="px-5 py-3.5 rounded-2xl bg-white text-warmBlack text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-ivory transition-colors"
                                        >
                                            Availability
                                        </button>
                                        <button
                                            onClick={() => scrollToSection('gallery')}
                                            className="px-5 py-3.5 rounded-2xl border border-white/25 text-white text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-white/10 transition-colors"
                                        >
                                            See photos
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 border-t border-white/10">
                                    {[{ k: '4', v: 'Rooms' }, { k: '100m', v: 'Beach' }, { k: '4.9', v: 'Rating' }].map((i) => (
                                        <div key={i.v} className="p-5 text-center">
                                            <div className="font-serif text-2xl text-gold">{i.k}</div>
                                            <div className="mt-1 text-[10px] tracking-[0.35em] uppercase text-white/55">{i.v}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.9 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-warmBlack/40"
            >
                <span className="text-[9px] tracking-[0.45em] uppercase">Scroll</span>
                <motion.div
                    animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
                    transition={shouldReduceMotion ? undefined : { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </motion.div>
        </section>
    );
};
