// components/services.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Zap,
  BarChart3,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Layers,
  Activity,
  Terminal,
  Database,
  Lock,
  Wifi
} from "lucide-react";

// --- DATA CONFIGURATION ---
const servicesData = [
  {
    id: "implementation",
    icon: <Cpu className="w-5 h-5" />,
    label: "Core Systems",
    title: "Beyond Implementation.\nWe Unlock Potential.",
    desc: "We don't just install software; we architect digital ecosystems. As your advanced partner, we know the platform inside out—ensuring your business logic translates flawlessly into the real world.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    stat: "99.9% Uptime",
    statLabel: "System Stability",
    tag: "ARCHITECTURE",
    meta: "V.4.0.1"
  },
  {
    id: "scaling",
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Scaling",
    title: "Scaling? We're\nBuilt For It.",
    desc: "Your business isn't static, and neither are our solutions. We configure elastic architectures that grow with you—seamlessly connected, fully optimized, and ready for what's next.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
    stat: "+250% Growth",
    statLabel: "Capacity Increase",
    tag: "SCALABILITY",
    meta: "ELASTIC-GRID"
  },
  {
    id: "custom",
    icon: <Layers className="w-5 h-5" />,
    label: "Custom Builds",
    title: "Custom Builds.\nSerious Lift.",
    desc: "You run a serious business. We build systems to match. Everything is designed around what makes your business tick—and how to make it tick faster.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    stat: "Tailored Code",
    statLabel: "Optimization",
    tag: "DEVELOPMENT",
    meta: "NATIVE-C++"
  },
  {
    id: "rapid",
    icon: <Zap className="w-5 h-5" />,
    label: "Rapid Launch",
    title: "Implement\nRapidly.",
    desc: "No delays. No confusion. Just clean, confident launches delivered at top speed using our proprietary deployment protocols.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    stat: "2x Speed",
    statLabel: "Velocity",
    tag: "DEPLOYMENT",
    meta: "TURBO-MODE"
  },
  {
    id: "mobile",
    icon: <Smartphone className="w-5 h-5" />,
    label: "Mobile First",
    title: "Anywhere.\nAny Device.",
    desc: "The world is mobile. Our interfaces are designed to provide a native-app experience directly in the browser, ensuring your team is productive from anywhere.",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=2070&auto=format&fit=crop",
    stat: "Responsive",
    statLabel: "Device Coverage",
    tag: "UX/UI DESIGN",
    meta: "IOS/ANDROID"
  },
  {
    id: "security",
    icon: <ShieldCheck className="w-5 h-5" />,
    label: "Security",
    title: "Fortress Level\nProtection.",
    desc: "Security isn't an afterthought. We implement military-grade encryption and compliance standards to keep your data locked down and secure.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
    stat: "AES-256",
    statLabel: "Encryption",
    tag: "CYBERSECURITY",
    meta: "MIL-SPEC"
  }
];

const AUTOPLAY_DURATION = 5000;

const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [autorun, setAutorun] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // --- PRELOAD IMAGES TO FIX GLITCHES ---
  useEffect(() => {
    servicesData.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  // --- AUTORUN LOGIC ---
  useEffect(() => {
    if (!autorun) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / AUTOPLAY_DURATION) * 100;

      if (newProgress >= 100) {
        setActiveTab((prev) => (prev + 1) % servicesData.length);
        setProgress(0);
        // Reset timer logic implicitly by re-triggering effect dependency if we handled it differently,
        // but here the state change triggers a re-render/re-effect if dependencies allowed.
        // Simplified: The useEffect below handles the reset.
      } else {
        setProgress(newProgress);
        progressInterval.current = setTimeout(tick, 16); // ~60fps
      }
    };

    tick();

    return () => {
      if (progressInterval.current) clearTimeout(progressInterval.current);
    };
  }, [activeTab, autorun]);

  const handleTabClick = (index: number) => {
    setAutorun(false);
    setActiveTab(index);
    setProgress(0);
  };

  return (
    <section className="relative w-full py-24 md:py-32 px-4 md:px-8 max-w-[1920px] mx-auto z-20 pointer-events-auto">

      {/* Background Noise Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Header Area */}
      <div className="max-w-7xl mx-auto mb-20 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#00ff88]" />
            <div className="w-1 h-1 bg-[#00ff88]/50" />
            <div className="w-1 h-1 bg-[#00ff88]/20" />
          </div>
          <span className="font-mono text-xs tracking-[0.3em] text-[#00ff88] uppercase">
            // System capabilities
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
          Our <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00ff88] to-transparent opacity-80">
            Services
          </span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 h-full min-h-[650px]">

        {/* --- LEFT PANEL: NAVIGATION GRID --- */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {servicesData.map((service, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={service.id}
                  onClick={() => handleTabClick(index)}
                  className={`relative group w-full text-left p-4 rounded-xl border transition-all duration-500 overflow-hidden
                    ${isActive
                      ? "bg-white/5 border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.15)]"
                      : "bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5"
                    }`}
                >
                  {/* Progress Bar Background for Active Tab */}
                  {isActive && autorun && (
                    <div
                      className="absolute bottom-0 left-0 h-[2px] bg-[#00ff88] transition-all duration-75 ease-linear z-20"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`p-2.5 rounded-lg border transition-all duration-300 ${isActive ? "bg-[#00ff88] border-[#00ff88] text-black" : "bg-white/5 border-white/10 text-gray-400 group-hover:text-white"}`}>
                      {service.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors mb-1 ${isActive ? "text-[#00ff88]" : "text-gray-500"}`}>
                        0{index + 1}
                      </span>
                      <span className={`text-sm font-bold tracking-wide uppercase transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                        {service.label}
                      </span>
                    </div>

                    {/* Active Chevron */}
                    <div className={`ml-auto transition-transform duration-300 ${isActive ? "translate-x-0 opacity-100 text-[#00ff88]" : "-translate-x-4 opacity-0"}`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Status Indicator at bottom left */}
          <div className="hidden lg:flex items-center gap-4 mt-6 pt-6 border-t border-white/10 opacity-50">
            <Activity className="w-4 h-4 text-[#00ff88] animate-pulse" />
            <span className="font-mono text-[10px] text-white uppercase tracking-widest">
              System Status: Online
            </span>
            <span className="ml-auto font-mono text-[10px] text-[#00ff88]">
              Ping: 14ms
            </span>
          </div>
        </div>

        {/* --- RIGHT PANEL: HOLOGRAPHIC CONTENT --- */}
        <div className="lg:col-span-8 relative h-full min-h-[500px] lg:h-auto perspective-[1000px]">
          {/* Static Glass Container to prevent layout shift */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

            {/* Decorative Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10 opacity-20" />

            {/* Glow Gradient */}
            <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-[#00ff88] blur-[150px] opacity-[0.05] rounded-full pointer-events-none" />

            {/* Corner Brackets (Decoration) */}
            <div className="absolute top-6 left-6 w-4 h-4 border-l border-t border-white/30 z-20" />
            <div className="absolute top-6 right-6 w-4 h-4 border-r border-t border-white/30 z-20" />
            <div className="absolute bottom-6 left-6 w-4 h-4 border-l border-b border-white/30 z-20" />
            <div className="absolute bottom-6 right-6 w-4 h-4 border-r border-b border-white/30 z-20" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="relative w-full h-full p-8 md:p-12 flex flex-col justify-between z-10"
              >

                {/* Top Bar: Meta Data */}
                <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 rounded bg-[#00ff88] border border-[#00ff88]/20 text-[#fff] font-mono text-[10px] font-bold tracking-widest">
                      {servicesData[activeTab].tag}
                    </div>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
                      ID: {servicesData[activeTab].meta}
                    </span>
                  </div>
                  <Terminal className="w-5 h-5 text-white/20" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">

                  {/* Text Area */}
                  <div className="flex flex-col justify-center order-2 md:order-1">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.1] whitespace-pre-line"
                    >
                      {servicesData[activeTab].title}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 border-l-2 border-[#00ff88]/50 pl-6"
                    >
                      {servicesData[activeTab].desc}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button className="inline-flex items-center gap-2 text-white font-bold text-xs tracking-[0.2em] uppercase border-b border-[#00ff88] pb-1 hover:text-[#00ff88]/50 transition-colors group">
                        Initialize Protocol
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Image Area */}
                  <div className="relative order-1 md:order-2 h-[250px] md:h-auto rounded-lg overflow-hidden border border-white/10 group bg-black">
                    {/* Loading State Skeleton (Only visible if image takes time, though preloader fixes this) */}
                    <div className="absolute inset-0 bg-white/5 animate-pulse z-0" />

                    <motion.img
                      src={servicesData[activeTab].image}
                      alt={servicesData[activeTab].label}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out z-10"
                    />

                    {/* Overlay Gradient on Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20" />

                    {/* Floating Data Card */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="absolute bottom-4 left-4 right-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-md z-30 flex justify-between items-end"
                    >
                      <div>
                        <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest mb-1">{servicesData[activeTab].statLabel}</p>
                        <p className="text-2xl font-bold text-white font-mono">{servicesData[activeTab].stat}</p>
                      </div>
                      <div className="flex gap-1 items-end h-8">
                        <div className="w-1 bg-[#00ff88] h-[40%] animate-[bounce_1s_infinite]" />
                        <div className="w-1 bg-[#00ff88] h-[70%] animate-[bounce_1.2s_infinite]" />
                        <div className="w-1 bg-[#00ff88] h-[50%] animate-[bounce_0.8s_infinite]" />
                        <div className="w-1 bg-[#00ff88] h-[100%] animate-[bounce_1.5s_infinite]" />
                      </div>
                    </motion.div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;