import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    
    // Quick setter for performance
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    const moveCursor = (e) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setLabel(target.getAttribute('data-cursor'));
        gsap.to(cursorRef.current, { scale: 4, backgroundColor: 'rgba(0, 229, 255, 0.8)', duration: 0.3, ease: 'power2.out' });
      } else {
        setLabel('');
        gsap.to(cursorRef.current, { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)', duration: 0.3, ease: 'power2.out' });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 font-display text-[3px] font-bold text-brandDark uppercase transition-colors"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
    >
      <span className="scale-[0.5] opacity-80 whitespace-nowrap">{label}</span>
    </div>
  );
}
