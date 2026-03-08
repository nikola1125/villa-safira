import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, MapPin, Star } from 'lucide-react';
import { useScroll, useTransform } from 'motion/react';
import { handleBookNow, scrollToSection } from '../../utils';

export const HeroSection: React.FC = () => {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 800], [0, 320]);
    const heroOpacity = useTransform(scrollY, [0, 480], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 800], [1, 1.1]);

    return (
        <section className="relative h-screen overflow-hidden">
            {/* Parallax background */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('./jasht3.jpg')",
                    y: heroY,
                    scale: heroScale,
                }}
            />

            {/* Gradient overlay — rich navy gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy/75 via-navy/55 to-navy/85" />

            {/* Subtle grain overlay for texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Hero content */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
            >
                {/* Location badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="inline-flex items-center gap-2 border border-gold/40 text-gold/90 text-[10px] tracking-[0.35em] uppercase px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm bg-white/5"
                >
                    <MapPin className="w-3 h-3" />
                    Durrës, Albania · Adriatic Coast
                </motion.div>

                {/* Title */}
                <div className="overflow-hidden mb-5">
                    <motion.h1
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                        className="font-serif text-white font-bold italic leading-none tracking-tight"
                        style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
                    >
                        Villa Safira
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <div className="overflow-hidden mb-10">
                    <motion.p
                        initial={{ y: '120%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
                        className="text-white/60 text-lg sm:text-xl font-light max-w-lg font-sans"
                    >
                        Where the Adriatic breeze meets Albanian warmth
                    </motion.p>
                </div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 mb-16"
                >
                    <button
                        onClick={handleBookNow}
                        className="px-8 py-4 bg-gold text-white font-semibold text-xs tracking-[0.25em] uppercase rounded-full hover:bg-goldDark transition-all duration-300 shadow-lg shadow-gold/20"
                    >
                        Reserve Your Stay
                    </button>
                    <button
                        onClick={() => scrollToSection('story')}
                        className="px-8 py-4 border border-white/40 text-white font-medium text-xs tracking-[0.25em] uppercase rounded-full hover:border-white/80 hover:bg-white/8 transition-all duration-300"
                    >
                        Discover the Story
                    </button>
                </motion.div>

                {/* Trust strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="flex items-center gap-5 sm:gap-8 text-white/50 text-[10px] tracking-[0.25em] uppercase"
                >
                    <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        <span>4.9 Rating</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <span>100m Beach</span>
                    <div className="w-px h-3 bg-white/20" />
                    <span>4 Rooms</span>
                    <div className="w-px h-3 bg-white/20 hidden sm:block" />
                    <span className="hidden sm:inline">Breakfast Included</span>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
            >
                <span className="text-[9px] tracking-[0.35em] uppercase font-sans">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </motion.div>
        </section>
    );
};
