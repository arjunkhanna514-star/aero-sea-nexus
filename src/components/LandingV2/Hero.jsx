import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const btnsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation logic (simplified word-by-word)
      const words = titleRef.current.children;
      gsap.from(words, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.5
      });

      gsap.from(subRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2
      });

      gsap.from(btnsRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.5
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6 z-10">
      <h1 
        className="font-display text-5xl md:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-8 overflow-hidden max-w-6xl"
        ref={titleRef}
      >
        <span className="inline-block">One</span>{' '}
        <span className="inline-block">Cloud</span>{' '}
        <span className="inline-block text-brandCyan">Brain</span>{' '}
        <span className="inline-block">for</span>{' '}
        <span className="inline-block">Global</span>{' '}
        <span className="inline-block">Trade.</span>
      </h1>
      
      <p 
        ref={subRef}
        className="font-body text-lg md:text-xl text-gray-400 max-w-3xl font-light leading-relaxed mb-12"
      >
        Aero-Sea Nexus abandons physical hardware completely — a giant AI Brain in the cloud that legally taps into existing global satellite data to orchestrate thousands of ships, planes, and supply chains simultaneously.
      </p>

      <div ref={btnsRef} className="flex flex-col sm:flex-row gap-6">
        <button data-cursor="Watch" className="px-8 py-4 bg-white text-brandDark font-display font-bold text-sm tracking-widest rounded flex items-center gap-3 transition-transform hover:-translate-y-1">
          WATCH THE VISION <ChevronRight size={16} />
        </button>
        <button data-cursor="Partner" className="px-8 py-4 border border-white/20 text-white font-display font-bold text-sm tracking-widest rounded flex items-center gap-3 transition-colors hover:bg-white/5">
          PARTNER WITH US
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white/30 text-xs font-mono tracking-widest">
        SCROLL TO EXPLORE
      </div>
    </section>
  );
}
