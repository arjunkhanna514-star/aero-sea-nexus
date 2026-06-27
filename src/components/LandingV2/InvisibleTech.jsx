import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    title: 'The Global Eyes',
    subtitle: 'Third-Party APIs',
    desc: 'Rents live satellite tracking & weather data instead of building physical sensors. Our AI reads live feeds to see every ship, plane, and storm on Earth instantly.',
  },
  {
    title: 'The Virtual Earth',
    subtitle: 'Digital Supply Chain Twin',
    desc: 'A perfect digital replica of the world\'s oceans, skies, and ports. Runs 10,000 "what-if" scenarios in hours to find optimal paths before real ships move.',
  },
  {
    title: 'The AI Negotiator',
    subtitle: 'Agentic AI',
    desc: 'Autonomous AI workers that think, negotiate, and act. When a route changes, they email suppliers, renegotiate payment terms, and secure warehouse space in seconds.',
  },
  {
    title: 'The Data Goldmine',
    subtitle: 'DaaS',
    desc: 'Sells global movement-pattern insights to hedge funds and insurers as high-margin recurring revenue.',
  },
  {
    title: 'The Public Spinoffs',
    subtitle: 'B2C & Micro-SaaS',
    desc: 'Turbulence-forecast app for flyers, carbon-footprint shopping calculator, real-time personal shipment tracker — micro-fees at macro scale.',
  }
];

export default function InvisibleTech() {
  const containerRef = useRef(null);
  const scrollWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.tech-panel');
      
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => "+=" + scrollWrapperRef.current.offsetWidth
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative z-10 w-full h-screen bg-brandDark overflow-hidden flex items-center">
      
      <div className="absolute top-12 left-12 text-white/50 font-display text-sm tracking-widest uppercase">
        The "Invisible" Technologies
      </div>

      <div ref={scrollWrapperRef} className="flex h-[60vh] w-[500vw]">
        {PILLARS.map((pillar, i) => (
          <div key={i} className="tech-panel w-screen h-full flex flex-col justify-center px-12 md:px-32">
            <div className="max-w-4xl" data-cursor="Drag">
              <h4 className="font-mono text-brandCyan text-sm tracking-widest mb-4">
                0{i+1} — {pillar.subtitle}
              </h4>
              <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                {pillar.title}.
              </h2>
              <p className="font-body text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}
