import React from 'react';
import { ArrowUpRight, CalendarCheck2, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { FadeUp } from '../ui/FadeUp';
import { MaskReveal } from '../ui/MaskReveal';
import { handleBookNow, openWhatsApp } from '../../utils';

export const FinalCtaSection: React.FC = () => {
    return (
        <section
            id="cta"
            className="relative pt-24 pb-6 bg-gradient-to-b from-cream via-ivory to-cream overflow-hidden h-screen snap-start flex flex-col justify-center"
        >
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                }}
            />

            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <div>
                        <FadeUp>
                            <div className="w-fit mb-4">
                                <div className="inline-flex items-center bg-white/60 backdrop-blur-xl border border-sand rounded-full px-4 py-2 shadow-sm shadow-warmBlack/5">
                                    <p className="section-label text-gold/70 tracking-[0.4em]">Final Chapter — Your Arrival</p>
                                </div>
                            </div>
                        </FadeUp>

                        <div className="relative overflow-hidden rounded-[2.75rem] border border-sand bg-white/70 backdrop-blur-xl shadow-2xl shadow-warmBlack/10">
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle at 18% 12%, rgba(201,160,82,0.25) 0%, rgba(0,0,0,0) 60%), radial-gradient(circle at 80% 30%, rgba(163,179,106,0.25) 0%, rgba(0,0,0,0) 60%)',
                                }}
                            />
                            <div className="relative p-8 sm:p-12 lg:p-14 grid lg:grid-cols-12 gap-12 items-center">
                                <div className="lg:col-span-7">
                                    <MaskReveal>
                                        <h2 className="font-serif text-4xl sm:text-6xl font-light text-warmBlack leading-[1.05]">
                                            Your beach stay
                                            <br />
                                            starts here.
                                        </h2>
                                    </MaskReveal>
                                    <FadeUp delay={0.2}>
                                        <p className="mt-6 text-warmMuted text-base sm:text-lg leading-loose max-w-xl">
                                            Choose a room, reserve on Booking.com, and arrive to calm. If you have a question, message us
                                            and we’ll reply quickly.
                                        </p>
                                    </FadeUp>

                                    <FadeUp delay={0.35}>
                                        <div className="mt-9 flex flex-col sm:flex-row gap-4">
                                            <button
                                                onClick={handleBookNow}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy text-white rounded-full text-xs tracking-[0.25em] uppercase font-semibold hover:bg-navyMid transition-all duration-300 shadow-lg shadow-navy/15"
                                            >
                                                Reserve now
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={openWhatsApp}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold/30 text-gold rounded-full text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                                            >
                                                WhatsApp us
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </FadeUp>

                                    <FadeUp delay={0.5}>
                                        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[10px] tracking-[0.35em] uppercase text-warmMuted/70">
                                            <span className="inline-flex items-center gap-2">
                                                <Star className="w-4 h-4 text-gold fill-gold" />
                                                4.9 rating
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-gold" />
                                                safe & quiet
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <CalendarCheck2 className="w-4 h-4 text-gold" />
                                                easy booking
                                            </span>
                                        </div>
                                    </FadeUp>

                                </div>

                                <FadeUp delay={0.2} className="lg:col-span-5">
                                    <div>
                                        <div className="rounded-[2.25rem] bg-navy text-white border border-white/5 p-8 sm:p-10 shadow-2xl shadow-navy/15">
                                            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6 text-gold">
                                                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                                            </div>
                                            <p className="section-label text-white/40">What you get</p>
                                            <ul className="mt-6 space-y-4 text-white/70 text-sm">
                                                {[
                                                    'A quiet boutique stay near the sea',
                                                    'Fresh breakfast each morning',
                                                    'Private bathrooms + premium bedding',
                                                    'Warm local hospitality',
                                                ].map((t) => (
                                                    <li key={t} className="flex items-start gap-3">
                                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                                                        <span className="leading-relaxed">{t}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </FadeUp>
                            </div>
                        </div>
                </div>
            </div>
        </section>
    );
};
