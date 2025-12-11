"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Target, Shield, Zap, Users } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">{value}</span>
    <span className="text-xs font-mono text-white/50 uppercase tracking-widest">{label}</span>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc }: any) => (
  <div className="group relative p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 backdrop-blur-md transition-all duration-300 rounded-xl overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4 text-[#00ff88] group-hover:scale-110 transition-transform duration-300">
            <Icon size={20} />
        </div>
        <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
        <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const AboutUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Image/Card Reveal
      gsap.fromTo(imageRef.current,
        { x: -100, opacity: 0, scale: 0.9 },
        { 
          x: 0, opacity: 1, scale: 1, 
          duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      // 2. Content Stagger
      gsap.fromTo(".reveal-item",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );

      // 3. Parallax Effect on Mouse Move (Subtle)
      const handleMouseMove = (e: MouseEvent) => {
         const { innerWidth, innerHeight } = window;
         const x = (e.clientX / innerWidth - 0.5) * 20;
         const y = (e.clientY / innerHeight - 0.5) * 20;
         
         gsap.to(".parallax-bg", { x: -x, y: -y, duration: 1, ease: "power2.out" });
         gsap.to(".parallax-fg", { x: x, y: y, duration: 1, ease: "power2.out" });
      };
      
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-screen py-32 flex items-center justify-center z-20 pointer-events-auto"
    >
      {/* --- BACKGROUND ACCENTS (Subtle Glows) --- */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none parallax-bg" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none parallax-bg" />

      {/* --- MAIN GLASS CONTAINER --- */}
      <div className="max-w-[1600px] w-full mx-6 md:mx-12 relative">
        
        {/* TOP BADGE */}
        <div className="flex justify-center mb-16 reveal-item">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
                </span>
                <span className="text-xs font-mono tracking-[0.2em] text-white/80 uppercase">Elite Intelligence Agency</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* --- LEFT: VISUAL (The Agent Profile) --- */}
            <div ref={imageRef} className="relative parallax-fg group">
                {/* Image Frame */}
                <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    
                    {/* Clean, High-End Agency Image */}
                    <img 
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                        alt="Agency Headquarters" 
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />

                    {/* Floating Glass Card on Image */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <div className="text-white font-bold text-lg">AI SHARKS HQ</div>
                            <div className="text-white/50 text-xs font-mono">SECURE SECTOR • LEVEL 9</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#00ff88] text-black flex items-center justify-center">
                            <Target size={20} />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements around image */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-[#00ff88]/30 rounded-tr-3xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-white/10 rounded-bl-3xl" />
            </div>

            {/* --- RIGHT: CONTENT (The Pitch) --- */}
            <div ref={contentRef} className="relative">
                
                <h2 className="reveal-item text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[0.9]">
                    About <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Us</span>
                </h2>

                <p className="reveal-item text-lg md:text-xl text-white/70 leading-relaxed mb-10 font-light max-w-xl">
                    We are not just developers; we are <strong>digital architects</strong> for the world's most ambitious brands. 
                    Operating at the intersection of superior design and absolute performance, we deploy systems that don't just work—they command authority.
                </p>

                {/* Stats Row */}
                <div className="reveal-item flex gap-12 mb-12 border-b border-white/10 pb-8">
                    <StatBadge value="150+" label="Missions" />
                    <StatBadge value="$500M" label="Value Created" />
                    <StatBadge value="100%" label="Success Rate" />
                </div>

                {/* Feature Grid */}
                <div className="reveal-item grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                     <FeatureCard 
                        icon={Zap} 
                        title="Hyper-Performance" 
                        desc="Optimized for millisecond response times. Speed is our currency."
                     />
                     <FeatureCard 
                        icon={Shield} 
                        title="Ironclad Security" 
                        desc="Enterprise-grade protection for your digital assets."
                     />
                </div>

                {/* CTA Button */}
                <div className="reveal-item">
                    <button className="group relative px-8 py-4 bg-white text-black font-bold tracking-wide uppercase overflow-hidden rounded-sm transition-transform active:scale-95">
                        <div className="absolute inset-0 bg-[#00ff88] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative flex items-center gap-2 group-hover:text-black transition-colors">
                            Initiate Protocol <ArrowUpRight className="w-5 h-5" />
                        </span>
                    </button>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 