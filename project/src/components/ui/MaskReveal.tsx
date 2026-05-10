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
                initial={{ y: '110%', opacity: 0.9 }}
                animate={inView ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1], delay }}
                style={{ willChange: 'transform, opacity' }}
            >
                {children}
            </motion.div>
        </div>
    );
};
