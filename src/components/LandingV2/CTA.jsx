import { ChevronRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative z-10 w-full py-40 px-6 bg-brandDark text-center overflow-hidden border-t border-white/5">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brandCyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto" data-cursor="Join">
        <h2 className="font-display text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter">
          Join the Cloud Brain.
        </h2>
        
        <p className="font-body text-xl md:text-2xl text-gray-400 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
          We're closing the gap between today's fragmented logistics and tomorrow's fully orchestrated, software-defined global trade network.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="px-10 py-5 bg-brandCyan text-brandDark font-display font-bold text-sm tracking-widest rounded flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_50px_rgba(0,229,255,0.5)]">
            PARTNER WITH US <ChevronRight size={18} />
          </button>
          <button className="px-10 py-5 border border-white/20 text-white font-display font-bold text-sm tracking-widest rounded flex items-center justify-center transition-colors hover:bg-white/5 hover:border-white/40">
            GET THE APP
          </button>
        </div>
      </div>
    </section>
  );
}
