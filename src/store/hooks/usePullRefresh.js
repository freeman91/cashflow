import { useEffect, useRef } from 'react';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { useDispatch } from 'react-redux';

const usePullToRefresh = (pullRef, onTrigger) => {
  const dispatch = useDispatch();
  const startY = useRef(0);
  const endY = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      endY.current = e.touches[0].clientY;
      if (pullRef.current.scrollTop === 0 && endY.current > startY.current) {
        pullRef.current.style.transform = `translateY(${Math.min(
          endY.current - startY.current,
          100
        )}px)`;
      }
    };

    const handleTouchEnd = () => {
      clearTimeout(timerRef.current);
      if (
        pullRef.current.scrollTop === 0 &&
        endY.current > startY.current + 450
      ) {
        dispatch(showLoading());
        pullRef.current.style.transform = 'translateY(0px)';
        timerRef.current = setTimeout(() => {
          onTrigger();
          dispatch(hideLoading());
        }, 500); // 500ms delay for deliberate pull-down
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
  }, [pullRef, onTrigger, dispatch]);
};

export default usePullToRefresh;
