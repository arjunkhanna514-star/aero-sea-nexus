import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TheBigIdea() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 w-full min-h-screen py-32 px-6 bg-brandDark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="font-display text-4xl md:text-6xl text-white font-bold tracking-tight mb-6">
            The Ultimate Vision.
          </h2>
          <p className="font-body text-lg text-gray-400 max-w-3xl mx-auto font-light">
            Starting as a 100% software and data company, our goal is to become the biggest data company in the world — taking our massive enterprise system and offering simplified, highly profitable slices of it to the general public.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-end h-full">
          {/* Tier 1 */}
          <div ref={el => cardsRef.current[0] = el} className="flex-1 bg-white/5 border border-white/10 p-8 rounded-xl min-h-[250px] relative group hover:bg-white/10 transition-colors">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-brandDark border border-white/20 rounded-full flex items-center justify-center font-mono text-xs text-gray-400">01</div>
            <h3 className="font-display text-xl text-white mb-4">B2B Enterprise SaaS</h3>
            <p className="font-body text-sm text-gray-400">Used by global shipping giants to orchestrate entire fleets via our cloud brain.</p>
          </div>

          {/* Tier 2 */}
          <div ref={el => cardsRef.current[1] = el} className="flex-1 bg-white/5 border border-white/10 p-8 rounded-xl min-h-[300px] relative group hover:bg-brandCyan/10 transition-colors">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-brandDark border border-brandCyan/50 rounded-full flex items-center justify-center font-mono text-xs text-brandCyan">02</div>
            <h3 className="font-display text-xl text-brandCyan mb-4">B2B DaaS</h3>
            <p className="font-body text-sm text-gray-400">Data as a Service. Selling real-time global movement insights to Wall Street hedge funds and top-tier insurers.</p>
          </div>

          {/* Tier 3 */}
          <div ref={el => cardsRef.current[2] = el} className="flex-1 bg-white/5 border border-white/10 p-8 rounded-xl min-h-[350px] relative group hover:bg-brandAmber/10 transition-colors">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-brandDark border border-brandAmber/50 rounded-full flex items-center justify-center font-mono text-xs text-brandAmber">03</div>
            <h3 className="font-display text-xl text-brandAmber mb-4">B2C Micro-SaaS</h3>
            <p className="font-body text-sm text-gray-400">Millions of smartphones. Turbulence forecasting, real-time shipment tracking, carbon calculators. Micro-fees at global scale.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
