import { useState, useEffect, useRef } from 'react';

interface Options extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: Options = {}
): [React.RefObject<HTMLElement | null>, boolean] {
  const { threshold = 0.1, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;

  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const frozenRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || frozenRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIntersecting(isElementIntersecting);

        // If we only want to trigger once, disconnect after first intersection
        if (isElementIntersecting && freezeOnceVisible) {
          frozenRef.current = true;
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [ref, isIntersecting];
}
