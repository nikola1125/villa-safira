import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface FadeUpProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export const FadeUp: React.FC<FadeUpProps> = ({ children, delay = 0, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
