import React, { useEffect, useRef } from 'react';
import { Phone } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { HighlightsSection } from './components/sections/HighlightsSection';
import { StorySection } from './components/sections/StorySection';
import { RoomsSection } from './components/sections/RoomsSection';
import { AmenitiesSection } from './components/sections/AmenitiesSection';
import { GallerySection } from './components/sections/GallerySection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { FinalCtaSection } from './components/sections/FinalCtaSection';
import { openWhatsApp } from './utils';

const App: React.FC = () => {
    const currentIndex = useRef(0);
    const lastMove = useRef(0);

    useEffect(() => {
        const sections = Array.from(document.querySelectorAll('.snap-start')) as HTMLElement[];
        if (sections.length === 0) return;

        const COOLDOWN = 950;

        const syncIndex = () => {
            if (Date.now() - lastMove.current < COOLDOWN) return;
            let closest = 0;
            let minDist = Infinity;
            sections.forEach((s, i) => {
                const dist = Math.abs(s.getBoundingClientRect().top);
                if (dist < minDist) { minDist = dist; closest = i; }
            });
            currentIndex.current = closest;
        };

        const goToSection = (index: number) => {
            if (index < 0 || index >= sections.length) return;
            currentIndex.current = index;
            lastMove.current = Date.now();
            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (Date.now() - lastMove.current < COOLDOWN) return;
            if (Math.abs(e.deltaY) < 5) return;
            goToSection(currentIndex.current + (e.deltaY > 0 ? 1 : -1));
        };

        const handleKey = (e: KeyboardEvent) => {
            if (Date.now() - lastMove.current < COOLDOWN) return;
            if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goToSection(currentIndex.current + 1); }
            else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goToSection(currentIndex.current - 1); }
        };

        window.addEventListener('scroll', syncIndex, { passive: true });
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('scroll', syncIndex);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKey);
        };
    }, []);

    return (
        <div className="font-sans bg-ivory text-warmBlack min-h-screen">
            <Navbar />

            <main>
                <HeroSection />
                <HighlightsSection />
                <StorySection />
                <RoomsSection />
                <AmenitiesSection />
                <GallerySection />
                <ReviewsSection />
                <FinalCtaSection />
            </main>

            <Footer />

            {/* WhatsApp floating button */}
            <button
                onClick={openWhatsApp}
                className="fixed bottom-6 right-6 z-50 w-13 h-13 bg-[#25D366] text-white rounded-full shadow-lg shadow-black/25 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300"
                aria-label="Chat on WhatsApp"
                style={{ width: '52px', height: '52px' }}
            >
                <Phone className="w-5 h-5" />
            </button>
        </div>
    );
};

export default App;
