import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CalendarCheck2, MapPinned, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { handleBookNow, openWhatsApp, scrollToSection } from '../../utils';

export const HighlightsSection: React.FC = () => {
    return (
        <section
            id="highlights"
            className="relative pt-24 pb-6 bg-gradient-to-b from-ivory via-cream to-ivory overflow-hidden h-screen snap-start flex flex-col justify-center"
        >
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                }}
            />

            <div className="absolute inset-x-0 top-0 pointer-events-none">
                <div className="h-px bg-gradient-to-r from-transparent via-sand to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <FadeUp>
                    <div className="w-fit mb-4">
                        <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                            <p className="section-label text-gold/70 tracking-[0.4em]">Chapter II — The Promise</p>
                        </div>
                    </div>
                </FadeUp>

                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    <div className="lg:col-span-6">
                        <MaskReveal>
                            <h2 className="font-serif text-5xl sm:text-7xl font-light text-warmBlack leading-[0.95]">
                                Adored by guests.
                                <br />
                                <em className="italic text-gold">Easy to book.</em>
                            </h2>
                        </MaskReveal>
                        <FadeUp delay={0.2}>
                            <p className="mt-7 text-warmMuted text-base sm:text-lg leading-loose max-w-xl">
                                A boutique villa for beach days and quiet nights. Four rooms. Fresh breakfast. The Adriatic two minutes
                                away.
                            </p>
                        </FadeUp>

                        <FadeUp delay={0.35}>
                            <div className="mt-10 rounded-[2rem] border border-sand bg-white/70 backdrop-blur-xl shadow-2xl shadow-warmBlack/10 overflow-hidden">
                                <div className="p-7 sm:p-9">
                                    <div className="flex items-center justify-between gap-6">
                                        <p className="text-[10px] tracking-[0.45em] uppercase text-warmMuted/80">Today’s best move</p>
                                        <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-warmMuted/70">
                                            <Star className="w-4 h-4 text-gold fill-gold" />
                                            4.9
                                        </div>
                                    </div>
                                    <p className="mt-4 font-serif text-2xl sm:text-3xl text-warmBlack leading-snug">
                                        Reserve now, then arrive to calm.
                                    </p>
                                    <div className="mt-7 flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={handleBookNow}
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy text-white rounded-full text-xs tracking-[0.25em] uppercase font-semibold hover:bg-navyMid transition-all duration-300 shadow-lg shadow-navy/15"
                                        >
                                            Check availability
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={openWhatsApp}
                                            className="px-8 py-4 border border-gold/30 text-gold rounded-full text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                                        >
                                            WhatsApp us
                                        </button>
                                    </div>
                                    <div className="mt-7 text-[10px] tracking-[0.3em] uppercase text-warmMuted/70">
                                        Or explore:
                                        <button
                                            onClick={() => scrollToSection('rooms')}
                                            className="ml-3 text-gold hover:text-goldDark transition-colors"
                                        >
                                            Rooms
                                        </button>
                                        <span className="mx-2 text-warmMuted/30">/</span>
                                        <button
                                            onClick={() => scrollToSection('gallery')}
                                            className="text-gold hover:text-goldDark transition-colors"
                                        >
                                            Photos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </FadeUp>
                    </div>

                    <div className="lg:col-span-6">
                        <FadeUp delay={0.1}>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    {
                                        icon: MapPinned,
                                        title: 'Beach in 2 minutes',
                                        body: 'Walk 100m and you’re on the Adriatic shore.',
                                    },
                                    {
                                        icon: CalendarCheck2,
                                        title: 'Instant booking',
                                        body: 'Reserve in minutes on Booking.com.',
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Boutique comfort',
                                        body: 'Premium bedding, bright coastal rooms.',
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: 'Quiet & secure',
                                        body: 'A calm stay designed for rest.',
                                    },
                                ].map((item) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 18 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-80px' }}
                                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        className="bg-white/70 backdrop-blur-xl border border-sand rounded-[2rem] p-6 sm:p-7 shadow-sm shadow-warmBlack/5"
                                    >
                                        <div className="w-11 h-11 rounded-2xl bg-ivory border border-sand flex items-center justify-center text-navy mb-5">
                                            <item.icon className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-serif text-xl text-warmBlack mb-2">{item.title}</h3>
                                        <p className="text-warmMuted text-sm leading-relaxed">{item.body}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </FadeUp>

                        <FadeUp delay={0.25}>
                            <div className="mt-6 bg-navy text-white rounded-[2rem] p-7 border border-white/5 shadow-2xl shadow-navy/15 overflow-hidden relative">
                                <div
                                    className="absolute inset-0 opacity-[0.12] pointer-events-none"
                                    style={{
                                        backgroundImage:
                                            'radial-gradient(circle at 18% 18%, rgba(163,179,106,0.45) 0%, rgba(0,0,0,0) 60%), radial-gradient(circle at 80% 30%, rgba(201,160,82,0.24) 0%, rgba(0,0,0,0) 60%)',
                                    }}
                                />
                                <p className="section-label text-white/45">Guest favorite</p>
                                <p className="mt-4 font-serif text-2xl sm:text-3xl font-light leading-snug">
                                    "Quiet, clean, and so close to the beach — we felt at home instantly."
                                </p>
                                <p className="mt-5 text-white/55 text-[10px] tracking-[0.35em] uppercase">From recent reviews</p>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </div>
        </section>
    );
};
