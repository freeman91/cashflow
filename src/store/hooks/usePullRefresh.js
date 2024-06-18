import { useEffect, useRef } from 'react';

const usePullToRefresh = (pullRef, onTrigger) => {
  const startY = useRef(0);
  const endY = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      endY.current = e.touches[0].clientY;
      if (
        pullRef.current.scrollTop === 0 &&
        endY.current > startY.current + 50
      ) {
        pullRef.current.style.transform = `translateY(${Math.min(
          endY.current - startY.current,
          100
        )}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (endY.current > startY.current + 50) {
        pullRef.current.style.transform = 'translateY(0px)';
        onTrigger();
      } else {
        pullRef.current.style.transform = 'translateY(0px)';
      }
    };

    const pullElement = pullRef.current;
    pullElement.addEventListener('touchstart', handleTouchStart);
    pullElement.addEventListener('touchmove', handleTouchMove);
    pullElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      pullElement.removeEventListener('touchstart', handleTouchStart);
      pullElement.removeEventListener('touchmove', handleTouchMove);
      pullElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullRef, onTrigger]);
};

export default usePullToRefresh;
