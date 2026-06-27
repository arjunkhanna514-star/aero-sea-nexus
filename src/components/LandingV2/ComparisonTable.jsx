import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const COMPARISON = [
  { feature: 'Startup Investment', old: 'Millions for factories, parts, shipping', new: 'Very low — only cloud computing & software' },
  { feature: 'Profit Margins', old: 'Low (hardware breaks, costly to ship/fix)', new: '50–80% (pure software, easily distributed)' },
  { feature: 'Growth Speed', old: 'Slow — one ship at a time', new: 'Instant — 500-ship fleet activated in one day' },
  { feature: 'Target Audience', old: 'Extremely limited (airlines/shipping lines only)', new: 'The entire world — B2B megacorps + B2C consumers' },
  { feature: 'Yearly Revenue', old: 'One-time hardware sale, limited recurring fees', new: 'Enterprise SaaS + hedge fund DaaS + millions of micro-subscriptions' }
];

export default function ComparisonTable() {
  const tableRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.compare-row');
      
      gsap.from(rows, {
        scrollTrigger: {
          trigger: tableRef.current,
          start: 'top 70%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 w-full py-32 px-6 bg-brandDark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">Why This Wins.</h2>
          <p className="font-body text-xl text-gray-400 font-light max-w-2xl mx-auto">
            The fundamental shift from legacy hardware limitations to boundless software scale.
          </p>
        </div>

        <div ref={tableRef} className="w-full border border-white/10 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-white/10 bg-white/5">
            <div className="p-6 font-mono text-sm tracking-widest text-white/50 uppercase">Feature</div>
            <div className="p-6 font-mono text-sm tracking-widest text-white/50 uppercase border-l border-white/10">Old Hardware Model</div>
            <div className="p-6 font-mono text-sm tracking-widest text-brandCyan uppercase border-l border-white/10">New AI Software Model</div>
          </div>

          {/* Rows */}
          {COMPARISON.map((row, i) => (
            <div key={i} className="compare-row grid grid-cols-1 md:grid-cols-3 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
              <div className="p-6 font-display text-lg text-white md:border-r border-white/10 font-bold">{row.feature}</div>
              <div className="p-6 font-body text-gray-500 font-light flex items-start gap-4 md:border-r border-white/10">
                <X className="shrink-0 mt-1 text-red-500/50" size={16} />
                {row.old}
              </div>
              <div className="p-6 font-body text-white font-medium flex items-start gap-4 bg-brandCyan/5">
                <Check className="shrink-0 mt-1 text-brandCyan" size={16} />
                {row.new}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
