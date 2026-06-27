import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EXAMPLES = [
  {
    tag: 'B2B AI SaaS',
    title: 'The Global Fleet',
    context: '50 cargo ships, Asia to North America.',
    action: 'AI detects an LA port strike, reroutes all 50 ships, renegotiates trucking rates, updates buyers — no human required.',
    result: 'Saves $50–75M in risk, cuts logistics costs up to 25%. Aero-Sea Nexus takes a success fee as pure software profit.',
    color: 'from-brandCyan/20 to-transparent'
  },
  {
    tag: 'B2B Pure DaaS',
    title: 'Selling "Exhaust Data"',
    context: 'Wall Street, New York.',
    action: 'AI notices lithium shipping traffic slowing globally before it hits the news.',
    result: 'Sold as an early-warning monthly subscription to a hedge fund — high-margin recurring revenue, zero physical movement.',
    color: 'from-brandAmber/20 to-transparent'
  },
  {
    tag: 'B2C Public Use',
    title: 'Reaching the Whole World',
    context: 'Millions of smartphones.',
    action: 'A nervous flyer gets minute-by-minute turbulence predictions, a shopper tracks an overseas package in real time.',
    result: '$5/month and $2/tracking-fee micro-revenue streams scale to multi-million-dollar cash flow overnight with zero manufacturing cost.',
    color: 'from-purple-500/20 to-transparent'
  }
];

export default function RealWorldExamples() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.case-panel');
      
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing: false,
          end: 'bottom top',
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative z-10 w-full bg-brandDark">
      {EXAMPLES.map((ex, i) => (
        <div key={i} className={`case-panel w-full h-screen flex flex-col justify-center px-6 md:px-24 bg-gradient-to-b ${ex.color} border-t border-white/5 backdrop-blur-sm`} style={{ zIndex: i }}>
          <div className="max-w-5xl" data-cursor="Explore">
            <div className="font-mono text-sm tracking-widest text-white/60 mb-6 uppercase border border-white/20 inline-block px-4 py-1 rounded-full">
              {ex.tag}
            </div>
            <h2 className="font-display text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter">
              {ex.title}.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
              <div>
                <h4 className="font-mono text-brandCyan text-xs uppercase tracking-widest mb-2">The Context</h4>
                <p className="font-body text-lg text-gray-300 font-light">{ex.context}</p>
              </div>
              <div>
                <h4 className="font-mono text-brandCyan text-xs uppercase tracking-widest mb-2">The AI Action</h4>
                <p className="font-body text-lg text-gray-300 font-light">{ex.action}</p>
              </div>
              <div>
                <h4 className="font-mono text-brandAmber text-xs uppercase tracking-widest mb-2">The Result</h4>
                <p className="font-body text-lg text-white font-medium">{ex.result}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
