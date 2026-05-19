import React, { useEffect, useRef, useState } from 'react';
import { Phone } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { HighlightsSection } from './components/sections/HighlightsSection';
import { StorySection } from './components/sections/StorySection';
import { RoomsSection } from './components/sections/RoomsSection';
import { AmenitiesSection } from './components/sections/AmenitiesSection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { openWhatsApp } from './utils';

const SECTION_IDS = ['hero', 'highlights', 'story', 'rooms', 'amenities', 'reviews', 'contact'];
const TOTAL = SECTION_IDS.length;
const COOLDOWN = 850;

const App: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    );
    const lastMove = useRef(0);

    useEffect(() => {
        const media = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(media.matches);
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    const goTo = (index: number) => {
        const clamped = Math.min(Math.max(index, 0), TOTAL - 1);
        setCurrentIndex(clamped);
        lastMove.current = Date.now();
        window.dispatchEvent(new CustomEvent('section-change', { detail: clamped }));
    };

    useEffect(() => {
        if (!isMobile) return;
        const handleNavigateTo = (e: Event) => {
            const id = (e as CustomEvent).detail as string;
            const el = document.getElementById(id);
            if (el) {
                const offset = el.getBoundingClientRect().top + window.scrollY - 68;
                window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
            }
        };
        window.addEventListener('navigate-to', handleNavigateTo);
        return () => window.removeEventListener('navigate-to', handleNavigateTo);
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (Date.now() - lastMove.current < COOLDOWN) return;
            if (Math.abs(e.deltaY) < 5) return;
            setCurrentIndex(prev => {
                const next = Math.min(Math.max(prev + (e.deltaY > 0 ? 1 : -1), 0), TOTAL - 1);
                lastMove.current = Date.now();
                window.dispatchEvent(new CustomEvent('section-change', { detail: next }));
                return next;
            });
        };

        const handleKey = (e: KeyboardEvent) => {
            if (Date.now() - lastMove.current < COOLDOWN) return;
            if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(currentIndex + 1); }
            else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(currentIndex - 1); }
        };

        const handleNavigateTo = (e: Event) => {
            const id = (e as CustomEvent).detail as string;
            const idx = SECTION_IDS.indexOf(id);
            if (idx >= 0) goTo(idx);
        };

        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
        const handleTouchEnd = (e: TouchEvent) => {
            const delta = touchStartY - e.changedTouches[0].clientY;
            if (Math.abs(delta) < 50 || Date.now() - lastMove.current < COOLDOWN) return;
            setCurrentIndex(prev => {
                const next = Math.min(Math.max(prev + (delta > 0 ? 1 : -1), 0), TOTAL - 1);
                lastMove.current = Date.now();
                window.dispatchEvent(new CustomEvent('section-change', { detail: next }));
                return next;
            });
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKey);
        window.addEventListener('navigate-to', handleNavigateTo);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('navigate-to', handleNavigateTo);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [currentIndex, isMobile]);

    const whatsAppBtn = (
        <button
            onClick={openWhatsApp}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full shadow-lg shadow-black/25 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300"
            aria-label="Chat on WhatsApp"
            style={{ width: '52px', height: '52px' }}
        >
            <Phone className="w-5 h-5" />
        </button>
    );

    if (isMobile) {
        return (
            <div className="font-sans bg-ivory text-warmBlack overflow-x-hidden">
                <Navbar />
                <HeroSection />
                <HighlightsSection />
                <StorySection />
                <RoomsSection />
                <AmenitiesSection />
                <ReviewsSection />
                <Footer />
                {whatsAppBtn}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 overflow-hidden font-sans bg-ivory text-warmBlack">
            <Navbar />

            <div
                style={{
                    transform: `translateY(-${currentIndex * 100}vh)`,
                    transition: 'transform 750ms cubic-bezier(0.76, 0, 0.24, 1)',
                    willChange: 'transform',
                }}
            >
                <HeroSection />
                <HighlightsSection />
                <StorySection />
                <RoomsSection />
                <AmenitiesSection />
                <ReviewsSection />
                <Footer />
            </div>

            {whatsAppBtn}
        </div>
    );
};

export default App;
