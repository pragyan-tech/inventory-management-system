import { useEffect, useRef, useState } from "react";

// Module-level cache survives component unmount/remount.
// Keyed so multiple instances don't clobber each other.
const previousValues = new Map();

export function useCountUp(end, duration = 1200, cacheKey) {
  const [count, setCount] = useState(() => {
    if (cacheKey && previousValues.has(cacheKey)) {
      return previousValues.get(cacheKey);
    }
    return 0;
  });

  const previousEnd = useRef(
    cacheKey && previousValues.has(cacheKey) ? previousValues.get(cacheKey) : 0
  );

  useEffect(() => {
    if (typeof end !== "number" || isNaN(end)) {
      setCount(0);
      return;
    }

    // If we already animated to this exact value, skip
    if (previousEnd.current === end) {
      return;
    }

    const startValue = previousEnd.current;
    const startTime = performance.now();
    let animationFrame = null;

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (end - startValue) * eased;

      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
        previousEnd.current = end;
        if (cacheKey) {
          previousValues.set(cacheKey, end);
        }
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, cacheKey]);

  return count;
}