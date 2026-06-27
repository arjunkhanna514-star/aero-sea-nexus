import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import all sections
import CustomCursor from '../components/LandingV2/CustomCursor';
import WebGLBackground from '../components/LandingV2/WebGLBackground';
import Hero from '../components/LandingV2/Hero';
import TheBigIdea from '../components/LandingV2/TheBigIdea';
import InvisibleTech from '../components/LandingV2/InvisibleTech';
import ScalingStats from '../components/LandingV2/ScalingStats';
import RealWorldExamples from '../components/LandingV2/RealWorldExamples';
import ComparisonTable from '../components/LandingV2/ComparisonTable';
import CTA from '../components/LandingV2/CTA';
import Footer from '../components/LandingV2/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  
  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <div className="bg-brandDark text-white min-h-screen font-body selection:bg-brandCyan/30 overflow-hidden relative">
      <CustomCursor />
      <WebGLBackground />
      
      <main className="relative z-10 w-full flex flex-col">
        <Hero />
        <TheBigIdea />
        <InvisibleTech />
        <ScalingStats />
        <RealWorldExamples />
        <ComparisonTable />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
