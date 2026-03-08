import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
    isOpen: boolean;
    images: string[];
    index: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, images, index, onClose, onNavigate }) => {
    const touchStartX = useRef<number>(0);

    const goPrev = useCallback(() => {
        onNavigate((index - 1 + images.length) % images.length);
    }, [index, images.length, onNavigate]);

    const goNext = useCallback(() => {
        onNavigate((index + 1) % images.length);
    }, [index, images.length, onNavigate]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, goNext, goPrev, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? goNext() : goPrev();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[200] bg-navy/97 flex flex-col items-center justify-center"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-gold/20 hover:border-gold/40 transition-all duration-300"
                        aria-label="Close lightbox"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image */}
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-5xl px-16 sm:px-20"
                    >
                        <img
                            src={images[index]}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full max-h-[75vh] object-contain rounded-xl"
                            loading="lazy"
                        />
                    </motion.div>

                    {/* Counter */}
                    <div className="mt-6 text-white/40 text-xs tracking-[0.3em] uppercase font-sans">
                        {index + 1} / {images.length}
                    </div>

                    {/* Thumbnail strip */}
                    <div className="flex gap-2 mt-4 px-4 overflow-x-auto scrollbar-hide max-w-2xl">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => onNavigate(i)}
                                className={`flex-shrink-0 w-12 h-9 rounded overflow-hidden transition-all duration-200 ${
                                    i === index
                                        ? 'ring-2 ring-gold opacity-100'
                                        : 'opacity-40 hover:opacity-70'
                                }`}
                                aria-label={`Go to image ${i + 1}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                            </button>
                        ))}
                    </div>

                    {/* Prev button */}
                    <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-gold/20 hover:border-gold/40 transition-all duration-300"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Next button */}
                    <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-gold/20 hover:border-gold/40 transition-all duration-300"
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
