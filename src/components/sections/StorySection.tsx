import React from 'react';
import { motion } from 'motion/react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { STORY_STATS, LOCATION_POINTS } from '../../data';

export const StorySection: React.FC = () => {
    return (
        <section id="story" className="bg-ivory text-warmBlack py-32 sm:py-48">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">

                {/* Chapter label */}
                <FadeUp>
                    <p className="section-label text-gold mb-12 tracking-[0.4em]">
                        Chapter I — Arrive
                    </p>
                </FadeUp>

                {/* Big editorial statement */}
                <div className="mb-24 sm:mb-40">
                    <MaskReveal>
                        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light leading-[1.05] max-w-5xl text-warmBlack">
                            A place where<br />
                            <em className="italic text-gold">time slows down.</em>
                        </h2>
                    </MaskReveal>
                </div>

                {/* Two-column story layout */}
                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center mb-32 sm:mb-48">

                    {/* Left — image */}
                    <FadeUp delay={0.1}>
                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-warmBlack/10">
                            <motion.img
                                src="./dhome7.jpg"
                                alt="Villa exterior — warm interiors with natural light"
                                loading="lazy"
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.04 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                            {/* Gold badge overlay */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="inline-flex items-center gap-2 bg-gold/90 text-white text-[10px] tracking-[0.25em] uppercase px-4 py-2 rounded-full">
                                    Est. on the Albanian Riviera
                                </div>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Right — narrative text */}
                    <div className="space-y-8">
                        <FadeUp delay={0.15}>
                            <p className="section-label text-gold tracking-[0.35em]">The Retreat</p>
                        </FadeUp>
                        <FadeUp delay={0.25}>
                            <h3 className="font-serif text-2xl sm:text-3xl font-light leading-relaxed text-warmBlack">
                                A charming four-floor retreat, just a breath away from the Adriatic Sea.
                            </h3>
                        </FadeUp>
                        <FadeUp delay={0.35}>
                            <p className="text-warmMuted text-base sm:text-lg leading-loose">
                                Villa Safira is not just a place to sleep — it's your personal corner of the Albanian coast.
                                Four individually designed rooms, each with private bathrooms, enveloped in warmth and natural light.
                                Breakfast is served fresh every morning, and the sea is yours to discover.
                            </p>
                        </FadeUp>
                        <FadeUp delay={0.45}>
                            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-sand">
                                {STORY_STATS.map(({ value, label }) => (
                                    <div key={label} className="pt-4">
                                        <div className="font-serif text-3xl text-gold font-bold">{value}</div>
                                        <div className="text-warmMuted text-xs tracking-widest uppercase mt-1">{label}</div>
                                    </div>
                                ))}
                            </div>
                        </FadeUp>
                    </div>
                </div>

                {/* Chapter II — The Location */}
                <FadeUp>
                    <p className="section-label text-gold mb-12 tracking-[0.4em]">Chapter II — The Setting</p>
                </FadeUp>

                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">

                    {/* Left — text */}
                    <div className="order-2 md:order-1 space-y-8">
                        <MaskReveal>
                            <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-tight text-warmBlack">
                                The sea is your<br />
                                <em className="italic text-gold">backyard.</em>
                            </h3>
                        </MaskReveal>
                        <FadeUp delay={0.25}>
                            <p className="text-warmMuted text-base sm:text-lg leading-loose">
                                Situated in the heart of Durrës — Albania's most beloved coastal city — Villa Safira
                                places you 100 meters from the Adriatic shore. Wake up to salty air, spend your days
                                on golden sands, and return each evening to the comfort of your private sanctuary.
                            </p>
                        </FadeUp>
                        <FadeUp delay={0.35}>
                            <div className="flex flex-col gap-3.5">
                                {LOCATION_POINTS.map((item) => (
                                    <div key={item} className="flex items-center gap-4 text-warmMuted text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </FadeUp>
                    </div>

                    {/* Right — image stack */}
                    <FadeUp delay={0.1} className="order-1 md:order-2">
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-warmBlack/10">
                                <motion.img
                                    src="./jasht1.jpg"
                                    alt="Outdoor terrace area with lush garden"
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.04 }}
                                    transition={{ duration: 1.2 }}
                                />
                            </div>
                            {/* Floating inset image */}
                            <motion.div
                                initial={{ opacity: 0, x: 40, y: 40 }}
                                whileInView={{ opacity: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, delay: 0.5 }}
                                className="absolute -bottom-8 -right-4 sm:-right-8 w-2/3 aspect-video rounded-2xl overflow-hidden border-4 border-ivory shadow-2xl"
                            >
                                <img
                                    src="./jasht2.jpg"
                                    alt="Lush garden view"
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </div>
                    </FadeUp>
                </div>

            </div>
        </section>
    );
};
