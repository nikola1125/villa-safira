import React from 'react';
import { motion } from 'motion/react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { STORY_STATS, LOCATION_POINTS } from '../../data';

export const StorySection: React.FC = () => {
    return (
        <section id="story" className="relative bg-gradient-to-b from-ivory via-cream to-ivory text-warmBlack py-24 sm:py-32 overflow-hidden min-h-screen snap-start scroll-mt-24">
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                }}
            />
            <div className="max-w-7xl mx-auto px-6 sm:px-12">

                {/* Chapter label */}
                <FadeUp>
                    <div className="sticky top-24 z-10 w-fit">
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                            <p className="section-label text-gold tracking-[0.4em]">
                                Chapter I — Arrive
                            </p>
                        </div>
                    </div>
                </FadeUp>

                <div className="mt-12 sm:mt-16 grid lg:grid-cols-12 gap-10 lg:gap-14 items-end">
                    <div className="lg:col-span-6">
                        <MaskReveal>
                            <h2 className="font-serif text-5xl sm:text-7xl font-light leading-[0.95] text-warmBlack">
                                Villa Safira,
                                <br />
                                <em className="italic text-gold">in soft light.</em>
                            </h2>
                        </MaskReveal>
                        <FadeUp delay={0.2}>
                            <p className="mt-7 text-warmMuted text-base sm:text-lg leading-loose max-w-xl">
                                Four boutique rooms near the sea — designed for quiet mornings, beach afternoons, and deep rest.
                            </p>
                        </FadeUp>
                        <FadeUp delay={0.35}>
                            <div className="mt-10 grid grid-cols-3 gap-6 pt-6 border-t border-sand/80">
                                {STORY_STATS.map(({ value, label }) => (
                                    <div key={label} className="pt-1">
                                        <div className="font-serif text-3xl text-gold font-semibold">{value}</div>
                                        <div className="text-warmMuted text-xs tracking-widest uppercase mt-1">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </FadeUp>
                    </div>

                    <FadeUp delay={0.1} className="lg:col-span-6">
                        <div className="grid grid-cols-12 gap-4 sm:gap-6">
                            <div className="col-span-7">
                                <div className="relative aspect-[3/4] rounded-[2.25rem] overflow-hidden shadow-2xl shadow-warmBlack/10">
                                    <motion.img
                                        src="./jasht1.jpg"
                                        alt="Villa Safira — outdoor terrace"
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
                                </div>
                            </div>
                            <div className="col-span-5 flex flex-col gap-4 sm:gap-6">
                                <div className="relative aspect-[4/5] rounded-[2.25rem] overflow-hidden border border-sand shadow-xl shadow-warmBlack/10">
                                    <img
                                        src="./dhome7.jpg"
                                        alt="Villa Safira — warm interior"
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="relative aspect-video rounded-[2.25rem] overflow-hidden border border-sand shadow-xl shadow-warmBlack/10">
                                    <img
                                        src="./jasht2.jpg"
                                        alt="Garden view"
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </FadeUp>
                </div>

                <div className="mt-16 sm:mt-24 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    <div className="lg:col-span-5">
                        <FadeUp>
                            <p className="section-label text-gold tracking-[0.4em]">The setting</p>
                        </FadeUp>
                        <MaskReveal>
                            <h3 className="mt-6 font-serif text-4xl sm:text-5xl font-light leading-tight text-warmBlack">
                                100 meters
                                <br />
                                <em className="italic text-gold">to the sea.</em>
                            </h3>
                        </MaskReveal>
                    </div>
                    <div className="lg:col-span-7">
                        <FadeUp delay={0.1}>
                            <div className="rounded-[2.25rem] bg-white/70 backdrop-blur-xl border border-sand shadow-2xl shadow-warmBlack/10 p-8 sm:p-10">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-warmMuted leading-loose">
                                            Durrës, Albania — beach, cafés, and the city within easy reach.
                                        </p>
                                    </div>
                                    <div className="space-y-3.5">
                                        {LOCATION_POINTS.map((item) => (
                                            <div key={item} className="flex items-start gap-4 text-warmMuted text-sm">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                                                <span className="leading-relaxed">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                </div>

            </div>
        </section>
    );
};
