import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScalingStats() {
  const sectionRef = useRef(null);
  
  // Custom hook for animated numbers
  const [ships, setShips] = useState(0);
  const [scenarios, setScenarios] = useState(0);
  const [margin, setMargin] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.to({ val: 0 }, { val: 1000, duration: 2, ease: 'power2.out', onUpdate: function() { setShips(Math.floor(this.targets()[0].val)); } });
          gsap.to({ val: 0 }, { val: 10000, duration: 2.5, ease: 'power2.out', onUpdate: function() { setScenarios(Math.floor(this.targets()[0].val)); } });
          gsap.to({ val: 0 }, { val: 80, duration: 2, ease: 'power2.out', delay: 0.5, onUpdate: function() { setMargin(Math.floor(this.targets()[0].val)); } });
        },
        once: true
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 w-full py-32 bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        
        <div>
          <div className="font-display text-6xl md:text-8xl font-black text-white mb-2">{ships}s</div>
          <div className="font-mono text-sm text-brandCyan tracking-widest uppercase">Ships, Planes & Chains</div>
          <div className="font-body text-sm text-gray-500 mt-2">Orchestrated simultaneously</div>
        </div>

        <div>
          <div className="font-display text-6xl md:text-8xl font-black text-white mb-2">{scenarios.toLocaleString()}</div>
          <div className="font-mono text-sm text-brandAmber tracking-widest uppercase">What-If Scenarios</div>
          <div className="font-body text-sm text-gray-500 mt-2">Simulated per session</div>
        </div>

        <div>
          <div className="font-display text-6xl md:text-8xl font-black text-white mb-2">50-{margin}%</div>
          <div className="font-mono text-sm text-brandCyan tracking-widest uppercase">Profit Margins</div>
          <div className="font-body text-sm text-gray-500 mt-2">Pure software vs legacy models</div>
        </div>

      </div>
    </section>
  );
}
