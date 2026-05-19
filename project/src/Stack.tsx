import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { ReactNode } from 'react';

interface CardRotateProps {
    children: ReactNode;
    backContent?: ReactNode;
    onSendToBack: () => void;
    sensitivity: number;
    disableDrag?: boolean;
    isMobile?: boolean;
    startFlipped?: boolean;
}

interface DragInfo {
    velocity: { x: number; y: number };
}

function CardRotate({ children, backContent, onSendToBack, sensitivity, disableDrag = false, isMobile = false, startFlipped = false }: CardRotateProps) {
    const [isFlipped, setIsFlipped] = useState(startFlipped);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [60, -60]);
    const rotateY = useTransform(x, [-100, 100], [-60, 60]);

    // Store raw clientX/Y on pointer-down so we can compute true finger travel
    // in onDragEnd (info.offset is elastic-constrained, not the real pointer delta).
    const dragStart = useRef({ x: 0, y: 0 });

    function handleDragEnd(event: unknown, info: DragInfo) {
        // Use the raw PointerEvent coords — same reference frame as dragStart
        const pe = event as PointerEvent;
        const rawDx = pe.clientX - dragStart.current.x;
        const rawDy = pe.clientY - dragStart.current.y;
        const absX = Math.abs(rawDx);
        const absY = Math.abs(rawDy);
        const velX = Math.abs(info.velocity.x);
        const velY = Math.abs(info.velocity.y);

        // Trigger on real movement OR a quick flick (velocity)
        const triggered = absX > sensitivity || absY > sensitivity || velX > 150 || velY > 150;
        if (!triggered) { x.set(0); y.set(0); return; }

        x.set(0);
        y.set(0);

        const isHorizontal = absX > absY;
        if (backContent && isHorizontal) {
            // Left / right → flip card front ↔ back
            setIsFlipped(prev => !prev);
        } else {
            // Up / down → cycle to next room
            setIsFlipped(false);
            onSendToBack();
        }
    }

    if (disableDrag) {
        return (
            <motion.div className="absolute inset-0 cursor-pointer" style={{ x: 0, y: 0 }}>
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            className="absolute inset-0 cursor-grab"
            style={{ x, y, rotateX, rotateY, touchAction: 'none', ...(isMobile && { willChange: 'transform' }) }}
            drag
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragElastic={isMobile ? 0.28 : 0.6}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 380, bounceDamping: 42 }}
            whileTap={{ cursor: 'grabbing' }}
            onPointerDown={(e) => { dragStart.current = { x: e.clientX, y: e.clientY }; }}
            onDragEnd={handleDragEnd}
        >
            {backContent ? (
                <div className="w-full h-full" style={{ perspective: '1200px' }}>
                    <motion.div
                        className="w-full h-full relative"
                        style={{ transformStyle: 'preserve-3d', ...(isMobile && { willChange: 'transform' }) }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    >
                        <div className="absolute inset-0 rounded-[2rem] overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                            {children}
                        </div>
                        <div className="absolute inset-0 rounded-[2rem] overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            {backContent}
                        </div>
                    </motion.div>
                </div>
            ) : (
                children
            )}
        </motion.div>
    );
}

interface StackProps {
    randomRotation?: boolean;
    sensitivity?: number;
    cards?: ReactNode[];
    cardBacks?: ReactNode[];
    startFlipped?: boolean;
    animationConfig?: { stiffness: number; damping: number };
    sendToBackOnClick?: boolean;
    onActiveChange?: (index: number) => void;
    autoplay?: boolean;
    autoplayDelay?: number;
    pauseOnHover?: boolean;
    mobileClickOnly?: boolean;
    mobileDragOnly?: boolean;
    mobileBreakpoint?: number;
}

export interface StackHandle {
    next: () => void;
    prev: () => void;
}

const Stack = forwardRef<StackHandle, StackProps>(function Stack({
    randomRotation = false,
    sensitivity = 200,
    cards = [],
    cardBacks,
    startFlipped = false,
    animationConfig = { stiffness: 260, damping: 20 },
    sendToBackOnClick = false,
    onActiveChange,
    autoplay = false,
    autoplayDelay = 3000,
    pauseOnHover = false,
    mobileClickOnly = false,
    mobileDragOnly = false,
    mobileBreakpoint = 768
}: StackProps, ref) {
    const [isMobile, setIsMobile] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < mobileBreakpoint);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [mobileBreakpoint]);

    const shouldDisableDrag = (mobileClickOnly && isMobile) || (mobileDragOnly && !isMobile);
    const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

    const [stack, setStack] = useState<{ id: number; content: ReactNode; back?: ReactNode }[]>(() => {
        return cards.map((content, index) => ({ id: index + 1, content, back: cardBacks?.[index] }));
    });

    const rotationsRef = useRef<Map<number, number>>(new Map());
    const getRotation = (id: number) => {
        if (!rotationsRef.current.has(id)) {
            rotationsRef.current.set(id, Math.random() * 10 - 5);
        }
        return rotationsRef.current.get(id)!;
    };

    useEffect(() => {
        if (cards.length) {
            setStack(cards.map((content, index) => ({ id: index + 1, content, back: cardBacks?.[index] })));
        }
    }, [cards, cardBacks]);

    useEffect(() => {
        if (!onActiveChange) return;
        if (!stack.length) return;
        const activeId = stack[stack.length - 1]?.id;
        if (typeof activeId === 'number') {
            onActiveChange(Math.max(0, activeId - 1));
        }
    }, [onActiveChange, stack]);

    const sendToBack = (id: number) => {
        setStack(prev => {
            const newStack = [...prev];
            const index = newStack.findIndex(card => card.id === id);
            const [card] = newStack.splice(index, 1);
            newStack.unshift(card);
            return newStack;
        });
    };

    useImperativeHandle(ref, () => ({
        next: () => setStack(prev => {
            if (prev.length < 2) return prev;
            const newStack = [...prev];
            const [top] = newStack.splice(newStack.length - 1, 1);
            newStack.unshift(top);
            return newStack;
        }),
        prev: () => setStack(prev => {
            if (prev.length < 2) return prev;
            const newStack = [...prev];
            const [bottom] = newStack.splice(0, 1);
            newStack.push(bottom);
            return newStack;
        }),
    }));

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || !isMobile) return;
        const preventScroll = (e: TouchEvent) => e.preventDefault();
        el.addEventListener('touchmove', preventScroll, { passive: false });
        return () => el.removeEventListener('touchmove', preventScroll);
    }, [isMobile]);

    useEffect(() => {
        if (autoplay && stack.length > 1 && !isPaused) {
            const interval = setInterval(() => {
                const topCardId = stack[stack.length - 1].id;
                sendToBack(topCardId);
            }, autoplayDelay);

            return () => clearInterval(interval);
        }
    }, [autoplay, autoplayDelay, stack, isPaused]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full"
            style={{
                perspective: 900
            }}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            {stack.map((card, index) => {
                const rotationVal = randomRotation ? getRotation(card.id) : 0;
                return (
                    <CardRotate
                        key={card.id}
                        backContent={card.back}
                        onSendToBack={() => sendToBack(card.id)}
                        sensitivity={sensitivity}
                        disableDrag={shouldDisableDrag}
                        isMobile={isMobile}
                        startFlipped={startFlipped}
                    >
                        <motion.div
                            className="rounded-2xl overflow-hidden w-full h-full"
                            style={{ transformOrigin: '50% 90%', ...(isMobile && { willChange: 'transform' }) }}
                            onClick={() => shouldEnableClick && sendToBack(card.id)}
                            animate={{
                                rotateZ: (stack.length - index - 1) * (isMobile ? 3 : 4) + rotationVal,
                                scale: 1 + index * 0.06 - stack.length * 0.06,
                            }}
                            initial={false}
                            transition={{
                                type: 'spring',
                                stiffness: animationConfig.stiffness,
                                damping: animationConfig.damping
                            }}
                        >
                            {card.content}
                        </motion.div>
                    </CardRotate>
                );
            })}
        </div>
    );
});

export default Stack;
