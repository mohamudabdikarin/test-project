import { useState, useEffect, useRef } from 'react';

export default function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target === 0 || target === null || target === undefined) {
      setValue(0);
      return;
    }

    const num = Number(target);
    if (isNaN(num)) {
      setValue(target);
      return;
    }

    let start = 0;
    const startTime = performance.now();
    const isDecimal = num % 1 !== 0;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (num - start) * eased;

      setValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));

      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    }

    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return value;
}
