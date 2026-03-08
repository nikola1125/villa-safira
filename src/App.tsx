import React from 'react';
import { Phone } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { StorySection } from './components/sections/StorySection';
import { RoomsSection } from './components/sections/RoomsSection';
import { AmenitiesSection } from './components/sections/AmenitiesSection';
import { GallerySection } from './components/sections/GallerySection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { openWhatsApp } from './utils';

const App: React.FC = () => {
    return (
        <div className="font-sans bg-ivory text-warmBlack min-h-screen">
            <Navbar />

            <main>
                <HeroSection />
                <StorySection />
                <RoomsSection />
                <AmenitiesSection />
                <GallerySection />
                <ReviewsSection />
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
