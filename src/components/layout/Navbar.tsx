import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NAV_LINKS } from '../../data';
import { handleBookNow, scrollToSection } from '../../utils';

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNav = (id: string) => {
        setIsMenuOpen(false);
        scrollToSection(id);
    };

    const leftLinks = NAV_LINKS.slice(0, Math.ceil(NAV_LINKS.length / 2));
    const rightLinks = NAV_LINKS.slice(Math.ceil(NAV_LINKS.length / 2));

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${isScrolled
                    ? 'bg-ivory/95 backdrop-blur-xl border-b border-sand shadow-sm py-2'
                    : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="flex items-center justify-between md:justify-center">
                    {/* Desktop Left Nav */}
                    <nav className="hidden md:flex items-center gap-8 mr-auto w-[40%]" aria-label="Left navigation">
                        {leftLinks.map((link) => (
                            <button
                                key={link}
                                onClick={() => handleNav(link)}
                                className={`text-[10px] tracking-[0.3em] uppercase font-medium transition-all duration-400 relative group ${isScrolled ? 'text-warmBlack hover:text-gold' : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {link}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                            </button>
                        ))}
                    </nav>

                    {/* Logo (Centered) */}
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex-shrink-0 transition-all duration-500 z-10"
                    >
                        <motion.img
                            src="/logo.jpg"
                            alt="Villa Safira"
                            animate={{
                                height: isScrolled ? 60 : 100,
                                margin: isScrolled ? '0px 0' : '0px 0'
                            }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="w-auto object-contain rounded-full border border-sand/20 shadow-md"
                        />
                    </button>

                    {/* Desktop Right Nav */}
                    <nav className="hidden md:flex items-center gap-8 ml-auto w-[40%] justify-end" aria-label="Right navigation">
                        {rightLinks.map((link) => (
                            <button
                                key={link}
                                onClick={() => handleNav(link)}
                                className={`text-[10px] tracking-[0.3em] uppercase font-medium transition-all duration-400 relative group ${isScrolled ? 'text-warmBlack hover:text-gold' : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {link}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                            </button>
                        ))}
                        <button
                            onClick={handleBookNow}
                            className={`ml-2 text-[10px] tracking-[0.3em] uppercase font-semibold px-6 py-3 rounded-full border transition-all duration-400 ${isScrolled
                                    ? 'border-gold text-gold hover:bg-gold hover:text-white'
                                    : 'border-white/70 text-white hover:bg-white hover:text-warmBlack'
                                }`}
                        >
                            Book
                        </button>
                    </nav>

                    {/* Mobile Hamburger (Right) */}
                    <button
                        onClick={() => setIsMenuOpen((p) => !p)}
                        className={`md:hidden flex flex-col gap-1.5 p-2 transition-colors duration-400 absolute right-6 top-1/2 -translate-y-1/2 ${isScrolled ? 'text-warmBlack' : 'text-white'
                            }`}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <motion.span
                            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                            className="block w-6 h-0.5 bg-current"
                        />
                        <motion.span
                            animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                            className="block w-6 h-0.5 bg-current"
                        />
                        <motion.span
                            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                            className="block w-6 h-0.5 bg-current"
                        />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden overflow-hidden bg-ivory border-t border-sand"
                    >
                        <div className="px-6 py-5 flex flex-col gap-1">
                            {[...NAV_LINKS, 'contact'].map((link) => (
                                <button
                                    key={link}
                                    onClick={() => handleNav(link)}
                                    className="text-[10px] tracking-[0.3em] uppercase font-medium text-left text-warmBlack py-4 border-b border-sand/60 hover:text-gold transition-colors"
                                >
                                    {link}
                                </button>
                            ))}
                            <button
                                onClick={() => { setIsMenuOpen(false); handleBookNow(); }}
                                className="mt-4 w-full text-[10px] tracking-[0.3em] uppercase font-semibold py-4 rounded-full bg-gold text-white hover:bg-goldDark transition-colors"
                            >
                                Book Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
