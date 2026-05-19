import React from 'react';
import { FadeUp } from '../ui/FadeUp';
import { AMENITIES } from '../../data';

export const AmenitiesSection: React.FC = () => {
    return (
        <section id="amenities" className="relative pt-16 pb-10 md:pt-24 md:pb-6 bg-gradient-to-b from-cream via-ivory to-cream border-y border-sand overflow-x-hidden md:overflow-hidden md:h-screen snap-start md:flex md:flex-col md:justify-center">
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
                    <div className="w-fit mb-4">
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                            <p className="section-label text-gold/70 tracking-[0.4em]">Chapter IV — The Essentials</p>
                        </div>
                    </div>
                </FadeUp>

                <div className="mb-4">
                    <FadeUp>
                        <h2 className="font-serif text-5xl sm:text-6xl font-light text-warmBlack leading-[0.95]">
                            Light, quiet,
                            <br />
                            <em className="italic text-gold">considered.</em>
                        </h2>
                    </FadeUp>
                    <FadeUp delay={0.2}>
                        <p className="mt-4 text-warmMuted text-base leading-loose max-w-2xl">
                            The details are simple — and done properly. Everything you need for a calm coastal stay.
                        </p>
                    </FadeUp>
                </div>

                {/* Amenities grid */}
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                    {AMENITIES.slice(0, 8).map((item, i) => (
                        <FadeUp key={item.label} delay={i * 0.04} className="h-full">
                            <div className="group h-full bg-white/70 backdrop-blur-xl border border-sand rounded-xl sm:rounded-[1.5rem] p-3 sm:p-6 shadow-sm shadow-warmBlack/5 hover:shadow-lg hover:shadow-warmBlack/10 hover:border-gold/25 transition-all duration-300">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-ivory border border-sand flex items-center justify-center text-navy mb-2 sm:mb-4 group-hover:bg-navy group-hover:text-gold transition-colors duration-300">
                                    <item.icon strokeWidth={1.5} className="w-4 h-4 sm:w-6 sm:h-6" />
                                </div>
                                <h4 className="font-sans text-[11px] sm:font-serif sm:text-lg text-warmBlack mb-0 sm:mb-2 leading-tight group-hover:text-goldDark transition-colors duration-300">
                                    {item.label}
                                </h4>
                                <p className="hidden sm:block text-warmMuted text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    );
};
