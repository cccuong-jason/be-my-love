"use client";

import { useRef, forwardRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

function useParallax(value: MotionValue<number>, distance: number) {
    return useTransform(value, [0, 1], [-distance, distance]);
}

interface ParallaxSectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    backgroundImage?: string;
    parallaxDistance?: number;
}

const ParallaxSection = forwardRef<HTMLElement, ParallaxSectionProps>(
    ({ children, className, id, style, backgroundImage, parallaxDistance = 100, ...props }, ref) => {
        const localRef = useRef(null);
        // Use the passed ref if available, otherwise use localRef. 
        // Composing refs is a bit tricky, for now let's just use a local ref for scroll tracking
        // and rely on the fact that we don't strictly *need* to expose the ref for this specific use case yet,
        // OR we can use the local ref for the motion logic.

        // Actually, `useScroll` needs a ref to the target. 
        const { scrollYProgress } = useScroll({ target: localRef, offset: ["start end", "end start"] });
        const y = useParallax(scrollYProgress, parallaxDistance);

        return (
            <section
                ref={localRef}
                className={className}
                id={id}
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    ...style
                }}
                {...props}
            >
                {backgroundImage && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            y: y,
                            zIndex: -1
                        }}
                    />
                )}
                <motion.div style={{ position: 'relative', zIndex: 1, y: !backgroundImage ? y : 0 }}>
                    {/* 
                        If no background image is provided, we apply the parallax effect to the content itself.
                        This creates a "floating" feel for the section content relative to the scroll.
                     */}
                    {children}
                </motion.div>
            </section>
        );
    }
);

ParallaxSection.displayName = "ParallaxSection";

export default ParallaxSection;
