import { useEffect, useRef, useState } from 'react';

// Simplified: reveal once on initial load only (no scroll-based triggers)
export default function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return { ref, inView };
}
