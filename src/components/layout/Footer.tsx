import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { NAV_LINKS } from '../../data';
import { handleBookNow, openWhatsApp, scrollToSection } from '../../utils';
import { FadeUp } from '../ui/FadeUp';

export const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer id="contact" className="bg-navy text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 sm:px-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand */}
                    <FadeUp>
                        <div className="space-y-6">
                            <h3 className="font-serif text-3xl font-light">
                                Villa <span className="text-gold">Safira</span>
                            </h3>
                            <p className="text-white/40 text-sm leading-loose">
                                A boutique retreat in Durrës, where Albanian warmth meets the calm of the Adriatic shore.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { label: 'IG', href: 'https://instagram.com' },
                                    { label: 'FB', href: 'https://facebook.com' },
                                    { label: 'BK', href: 'https://www.booking.com/hotel/al/villa-sol-durres.html' },
                                ].map(({ label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 text-[10px] tracking-widest hover:border-gold/50 hover:text-gold transition-all duration-300"
                                        aria-label={label}
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </FadeUp>

                    {/* Navigation */}
                    <FadeUp delay={0.1}>
                        <div className="space-y-6">
                            <h4 className="section-label text-white/30">Navigation</h4>
                            <ul className="space-y-3">
                                {NAV_LINKS.map((link) => (
                                    <li key={link}>
                                        <button
                                            onClick={() => scrollToSection(link)}
                                            className="text-white/60 hover:text-gold text-sm uppercase tracking-widest transition-colors duration-300"
                                        >
                                            {link}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={handleBookNow}
                                        className="text-gold/80 hover:text-gold text-sm uppercase tracking-widest transition-colors duration-300"
                                    >
                                        Book Now ↗
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </FadeUp>

                    {/* Contact */}
                    <FadeUp delay={0.15}>
                        <div className="space-y-6">
                            <h4 className="section-label text-white/30">Contact</h4>
                            <div className="space-y-4">
                                <a
                                    href="mailto:villasafiradurres@gmail.com"
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-300">
                                        <Mail className="w-4 h-4 text-white/50 group-hover:text-gold transition-colors" />
                                    </div>
                                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                                        villasafiradurres@gmail.com
                                    </span>
                                </a>
                                <button
                                    onClick={openWhatsApp}
                                    className="flex items-center gap-3 group w-full text-left"
                                >
                                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-300">
                                        <Phone className="w-4 h-4 text-white/50 group-hover:text-gold transition-colors" />
                                    </div>
                                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                                        +355 69 242 9567
                                    </span>
                                </button>
                                <a
                                    href="https://maps.app.goo.gl/hZa8t1TER1ymqn338"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-300">
                                        <MapPin className="w-4 h-4 text-white/50 group-hover:text-gold transition-colors" />
                                    </div>
                                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                                        Durrës, Albania
                                    </span>
                                </a>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Newsletter */}
                    <FadeUp delay={0.2}>
                        <div className="space-y-6">
                            <h4 className="section-label text-white/30">Newsletter</h4>
                            {subscribed ? (
                                <p className="text-gold text-sm leading-relaxed">
                                    Thank you! We'll be in touch soon. 🌊
                                </p>
                            ) : (
                                <form onSubmit={handleSubscribe} className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full bg-transparent border-b border-white/15 pb-3 text-sm text-white placeholder-white/25 focus:border-gold focus:outline-none transition-colors duration-300"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="text-xs tracking-[0.2em] uppercase font-semibold text-gold hover:text-goldLight transition-colors duration-300"
                                    >
                                        Subscribe →
                                    </button>
                                </form>
                            )}
                            <p className="text-white/20 text-xs leading-relaxed">
                                Seasonal updates, special offers, and Adriatic stories.
                            </p>
                        </div>
                    </FadeUp>
                </div>

                {/* Bottom bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase">
                        © {new Date().getFullYear()} Villa Safira · Durrës, Albania
                    </p>
                    <div className="flex gap-6">
                        {[
                            { label: 'Privacy', href: '#' },
                            { label: 'Terms', href: '#' },
                        ].map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="text-white/20 hover:text-white/60 transition-colors text-[10px] tracking-[0.3em] uppercase"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
