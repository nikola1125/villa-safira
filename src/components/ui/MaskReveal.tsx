import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface MaskRevealProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({ children, delay = 0, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <div className={`overflow-hidden ${className}`} ref={ref}>
            <motion.div
                initial={{ y: '105%' }}
                animate={inView ? { y: '0%' } : {}}
                transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay }}
            >
                {children}
            </motion.div>
        </div>
    );
};
