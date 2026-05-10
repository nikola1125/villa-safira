import React from 'react';
import { motion } from 'motion/react';
import { FadeUp } from '../ui/FadeUp';
import { AMENITIES } from '../../data';
import { handleBookNow } from '../../utils';

export const AmenitiesSection: React.FC = () => {
    return (
        <section id="amenities" className="relative py-24 sm:py-32 bg-gradient-to-b from-cream via-ivory to-cream border-y border-sand overflow-hidden min-h-screen snap-start scroll-mt-24">
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                }}
            />
            <div className="max-w-7xl mx-auto px-6 sm:px-12">

                <FadeUp>
                    <div className="sticky top-24 z-10 w-fit mb-10">
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                            <p className="section-label text-gold/70 tracking-[0.4em]">Chapter IV — The Essentials</p>
                        </div>
                    </div>
                </FadeUp>

                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16 sm:mb-20">
                    <div className="lg:col-span-6">
                        <FadeUp>
                            <h2 className="font-serif text-5xl sm:text-7xl font-light text-warmBlack leading-[0.95]">
                                Light, quiet,
                                <br />
                                <em className="italic text-gold">considered.</em>
                            </h2>
                        </FadeUp>
                        <FadeUp delay={0.2}>
                            <p className="mt-7 text-warmMuted text-base sm:text-lg leading-loose max-w-xl">
                                The details are simple — and done properly. Everything you need for a calm coastal stay.
                            </p>
                        </FadeUp>
                        <FadeUp delay={0.35}>
                            <button
                                onClick={handleBookNow}
                                className="mt-10 px-10 py-5 bg-navy text-white rounded-full text-xs tracking-[0.2em] uppercase font-semibold hover:bg-navyMid transition-all duration-300 shadow-lg shadow-navy/20"
                            >
                                View on Booking.com
                            </button>
                        </FadeUp>
                    </div>

                    <FadeUp delay={0.1} className="lg:col-span-6">
                        <div className="grid grid-cols-12 gap-4 sm:gap-6">
                            <div className="col-span-7">
                                <div className="relative aspect-[4/5] rounded-[2.25rem] overflow-hidden border border-sand shadow-2xl shadow-warmBlack/10">
                                    <motion.img
                                        src="./kuzhin.jpg"
                                        alt="Shared kitchen and breakfast area"
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.03 }}
                                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-5 flex flex-col gap-4 sm:gap-6">
                                <div className="relative aspect-square rounded-[2.25rem] overflow-hidden border border-sand shadow-xl shadow-warmBlack/10">
                                    <img src="./kuzhin77.jpg" alt="Breakfast details" loading="lazy" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative aspect-square rounded-[2.25rem] overflow-hidden border border-sand shadow-xl shadow-warmBlack/10">
                                    <img src="./kuzhin78.jpg" alt="Guest amenities" loading="lazy" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </FadeUp>
                </div>

                {/* Amenities grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {AMENITIES.map((item, i) => (
                        <FadeUp key={item.label} delay={i * 0.04}>
                            <div className="group bg-white/70 backdrop-blur-xl border border-sand rounded-[2rem] p-6 sm:p-7 shadow-sm shadow-warmBlack/5 hover:shadow-lg hover:shadow-warmBlack/10 hover:border-gold/25 transition-all duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-ivory border border-sand flex items-center justify-center text-navy mb-5 group-hover:bg-navy group-hover:text-gold transition-colors duration-300">
                                    <item.icon strokeWidth={1.5} className="w-6 h-6" />
                                </div>
                                <h4 className="font-serif text-lg text-warmBlack mb-2 group-hover:text-goldDark transition-colors duration-300">
                                    {item.label}
                                </h4>
                                <p className="text-warmMuted text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    );
};
