import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full bg-black py-20 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand */}
        <div className="md:col-span-1">
          <h3 className="font-display text-2xl font-bold text-white mb-4">AERO-SEA NEXUS</h3>
          <p className="font-body text-sm text-gray-500 max-w-xs">
            The world's first AI Cloud Brain for global trade and logistics orchestration.
          </p>
        </div>

        {/* Links */}
        <div className="md:col-span-1">
          <h4 className="font-mono text-xs text-white/50 tracking-widest uppercase mb-6">Platform</h4>
          <ul className="space-y-4 font-body text-sm text-gray-400">
            <li><a href="#" className="hover:text-brandCyan transition-colors">Quantum Navigation</a></li>
            <li><a href="#" className="hover:text-brandCyan transition-colors">Swarm Computing</a></li>
            <li><a href="#" className="hover:text-brandCyan transition-colors">Bioluminescence Radar</a></li>
            <li><a href="#" className="hover:text-brandCyan transition-colors">Agentic AI</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-1">
          <h4 className="font-mono text-xs text-white/50 tracking-widest uppercase mb-6">Contact</h4>
          <ul className="space-y-4 font-body text-sm text-gray-400">
            <li><a href="mailto:partners@aerosea.ai" className="hover:text-white transition-colors">partners@aerosea.ai</a></li>
            <li><a href="mailto:press@aerosea.ai" className="hover:text-white transition-colors">press@aerosea.ai</a></li>
          </ul>
        </div>

        {/* Social */}
        <div className="md:col-span-1">
          <h4 className="font-mono text-xs text-white/50 tracking-widest uppercase mb-6">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"><Twitter size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"><Linkedin size={18} /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"><Github size={18} /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-xs text-gray-600">
          © 2026 Aero-Sea Nexus. All rights reserved.
        </div>
        <div className="flex gap-6 font-mono text-xs text-gray-600">
          <a href="#" className="hover:text-gray-300">Privacy</a>
          <a href="#" className="hover:text-gray-300">Terms</a>
        </div>
      </div>
    </footer>
  );
}
