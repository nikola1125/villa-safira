import React from 'react';
import { FadeUp } from '../ui/FadeUp';
import { AMENITIES } from '../../data';
import { handleBookNow } from '../../utils';

export const AmenitiesSection: React.FC = () => {
    return (
        <section id="amenities" className="py-32 sm:py-48 bg-ivory border-y border-sand">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">

                {/* Header row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-24">
                    <div className="max-w-xl">
                        <FadeUp>
                            <p className="section-label text-gold mb-8 tracking-[0.4em]">Chapter IV — The Essentials</p>
                            <h2 className="font-serif text-4xl sm:text-6xl font-light text-warmBlack leading-[1.1]">
                                Everything you need,<br />
                                <em className="italic text-gold">nothing you don't.</em>
                            </h2>
                        </FadeUp>
                    </div>
                    <FadeUp delay={0.2}>
                        <button
                            onClick={handleBookNow}
                            className="px-10 py-5 bg-navy text-white rounded-full text-xs tracking-[0.2em] uppercase font-semibold hover:bg-navyMid transition-all duration-300 shadow-lg shadow-navy/20"
                        >
                            View on Booking.com
                        </button>
                    </FadeUp>
                </div>

                {/* Amenities grid */}
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-14">
                    {AMENITIES.map((item, i) => (
                        <FadeUp key={item.label} delay={i * 0.04}>
                            <div className="group space-y-3 sm:space-y-4 cursor-default">
                                {/* Icon container */}
                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-navy flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-400 shadow-md shadow-navy/15">
                                    <item.icon strokeWidth={1.5} className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-warmBlack text-[10px] sm:text-base mb-0.5 sm:mb-1 group-hover:text-gold transition-colors duration-300 line-clamp-1">
                                        {item.label}
                                    </h4>
                                    <p className="text-warmMuted text-[8px] sm:text-sm leading-snug sm:leading-relaxed line-clamp-2">{item.desc}</p>
                                </div>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </div>
        </section>
    );
};
