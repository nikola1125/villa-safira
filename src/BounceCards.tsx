import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BounceCardsProps {
  className?: string;
  images?: string[];
  containerWidth?: number | string;
  containerHeight?: number | string;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  titles?: string[];
  enableHover?: boolean;
  hoverPushOffset?: number;
  onCardClick?: (idx: number) => void;
}

export default function BounceCards({
  className = '',
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = 'elastic.out(1, 0.8)',
  transformStyles = [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)'
  ],
  titles = [],
  enableHover = false,
  hoverPushOffset = 190,
  onCardClick
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const gsapCtx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (hasAnimated.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          gsapCtx.current = gsap.context(() => {
            // Card entry animation
            gsap.fromTo(
              '.card-inner',
              { scale: 0, rotation: 0 },
              {
                scale: 1,
                stagger: animationStagger,
                ease: easeType,
                delay: animationDelay
              }
            );

            // Title floating animation
            gsap.to('.card-title', {
              y: -5,
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              stagger: {
                each: 0.2,
                from: "random"
              }
            });
          }, containerRef);

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (gsapCtx.current) gsapCtx.current.revert();
    };
  }, [animationStagger, easeType, animationDelay]);

  const getNoRotationTransform = (transformStr: string) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (baseTransform: string, offsetX: number) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);
    images.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || 'none';

      if (i === hoveredIdx) {
        const noRotation = getNoRotationTransform(baseTransform);
        gsap.to(selector, {
          transform: noRotation,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto'
        });
      } else {
        const offsetX = i < hoveredIdx ? -hoverPushOffset : hoverPushOffset;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(selector, {
          transform: pushedTransform,
          duration: 0.4,
          ease: 'back.out(1.4)',
          delay,
          overwrite: 'auto'
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    images.forEach((_, i) => {
      const selector = q(`.card-${i}`);
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || 'none';
      gsap.to(selector, {
        transform: baseTransform,
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto'
      });
    });
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: containerWidth,
        height: containerHeight
      }}
      ref={containerRef}
    >
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`card card-${idx} absolute flex flex-col items-center cursor-pointer group`}
          style={{
            transform: transformStyles[idx] || 'none',
            width: 'fit-content'
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
          onClick={() => onCardClick?.(idx)}
        >
          <div
            className="w-40 h-40 sm:w-56 sm:h-56 md:w-[240px] aspect-square border-4 sm:border-8 border-white rounded-xl sm:rounded-[30px] overflow-hidden shadow-xl"
          >
            <img className="w-full h-full object-cover" src={src} alt={`card-${idx}`} />
          </div>
          {titles[idx] && (
            <div className="mt-3 px-3 py-1 bg-transparent">
              <span className="text-amber-900 text-[11px] sm:text-sm md:text-base font-bold block text-center leading-tight whitespace-nowrap drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
                {titles[idx]}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
