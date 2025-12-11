// components/hero.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    ArrowUpRight, CreditCard, Wallet, BarChart3,
    MoreHorizontal, ShieldCheck, MessageSquare,
    Cpu, PlayCircle, CheckCircle2, Activity, Users
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- 1. TYPEWRITER COMPONENT ---
const TypewriterText = () => {
    const words = ["POTENTIAL", "VELOCITY", "VISION", "FUTURE"];
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        const cursorInterval = setInterval(() => setBlink(b => !b), 500);
        return () => clearInterval(cursorInterval);
    }, []);

    useEffect(() => {
        if (subIndex === words[index].length + 1 && !reverse) {
            setTimeout(() => setReverse(true), 2500);
            return;
        }
        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }
        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 50 : 100);
        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4afab] to-[#f4afab]/60 drop-shadow-[0_0_15px_rgba(244,175,171,0.5)]">
                {words[index].substring(0, subIndex)}
            </span>
            <span className={cn("absolute -right-[4px] top-1 bottom-1 w-[6px] bg-[#f4afab]", blink ? "opacity-100" : "opacity-0")} />
        </span>
    );
};

// --- 2. NUMBER TICKER ---
const NumberTicker = ({ value, delay = 0 }: { value: number; delay?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            let start = 0;
            const duration = 1500;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 4);
                setDisplayValue(start + (value - start) * ease);
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return <span>{displayValue.toFixed(2)}%</span>;
};

// --- 3. GLASS WIDGET CARD ---
const GlassCard = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay, type: "spring", stiffness: 120, damping: 20 }}
        className={cn(
            "bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#f4afab]/30 transition-colors duration-500",
            className
        )}
    >
        {children}
    </motion.div>
);

// --- 4. DASHBOARD ANIMATION ENGINE (SCROLL TRIGGERED) ---
const DashboardAnimation = () => {
    const containerRef = useRef(null);
    // Trigger ONLY when 30% of the component is in view for faster activation
    const isInView = useInView(containerRef, { once: true, amount: 0.3 });

    const [step, setStep] = useState(0); // 0: Init, 1: Growth, 2: Grid

    useEffect(() => {
        if (isInView) {
            const sequence = async () => {
                // Wait 200ms after scroll trigger
                await new Promise(r => setTimeout(r, 200));
                setStep(1); // Show Graph

                // Wait 1.5s then explode
                await new Promise(r => setTimeout(r, 1200));
                setStep(2); // Explode to Grid
            };
            sequence();
        }
    }, [isInView]);

    return (
        <div ref={containerRef} className="relative w-[800px] h-[500px] mx-auto perspective-[1000px] mt-10 md:mt-20 scale-[0.6] sm:scale-[0.8] md:scale-100 origin-top">

            {/* --- PHASE 1 & 2: CENTER CARD --- */}
            <motion.div
                layout
                className={cn(
                    "absolute z-30 bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl",
                    step === 2 ? "border-[#FF6B9D]/30" : "border-white/10"
                )}
                initial={{
                    width: 180, height: 180,
                    left: "50%", top: "50%", x: "-50%", y: "-50%"
                }}
                animate={{
                    width: step === 1 ? 320 : step === 2 ? 240 : 180,
                    height: step === 1 ? 380 : step === 2 ? 220 : 180,
                    left: step === 2 ? 0 : "50%",
                    top: step === 2 ? 0 : "50%",
                    x: step === 2 ? 0 : "-50%",
                    y: step === 2 ? 0 : "-50%"
                }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
            >
                <div className="p-5 flex flex-col h-full relative z-10">
                    <motion.span className="text-gray-500 text-[10px] font-mono mb-1 uppercase tracking-wider">
                        Growth Metric
                    </motion.span>
                    <h2 className={cn("font-bold text-[#f4afab] tracking-tight", step === 2 ? "text-3xl" : "text-4xl")}>
                        <NumberTicker value={step === 0 ? 2.36 : 84.21} delay={step === 0 ? 0 : 200} />
                    </h2>

                    {step >= 1 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 h-32"
                        >
                            {/* Updated Gradient & Path Color */}
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <motion.path
                                    d="M0,100 C 30,80 50,90 70,50 S 90,20 100,10"
                                    fill="none" stroke="#f4afab" strokeWidth="2"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                                />
                                <path d="M0,100 C 30,80 50,90 70,50 S 90,20 100,10 V 100 H 0 Z" fill="url(#grad)" opacity="0.4" />
                                <defs>
                                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f4afab" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#f4afab" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </motion.div>
                    )}

                    {step === 0 && <ArrowUpRight className="absolute bottom-4 left-4 text-[#f4afab]" />}
                </div>
            </motion.div>

            {/* --- PHASE 3: THE EXPLOSION (BENTO GRID) --- */}
            {step === 2 && (
                <>
                    {/* === COLUMN 1 (LEFT) === */}

                    {/* 1. Growth Card (Top Left - Already rendered above) */}

                    {/* 2. Wallet (Middle Left) */}
                    <GlassCard className="absolute left-0 top-[236px] w-[240px] h-[140px] bg-[#f4afab]/5 border-[#f4afab]/20" delay={0.1}>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="text-[#f4afab]" size={20} />
                            <span className="text-white text-sm font-bold">Secure Vault</span>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-tight mb-3">
                            Military-grade encryption enabled. <br /> Access restricted.
                        </p>
                        <button className="mt-auto w-full py-1.5 bg-[#f4afab] text-black text-[10px] font-bold rounded hover:bg-[#c98e8b] transition-colors">
                            Access Vault
                        </button>
                    </GlassCard>

                    {/* 3. Profile (Bottom Left) */}
                    <GlassCard className="absolute left-0 top-[392px] w-[240px] h-[108px]" delay={0.2}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-gray-400">Optimization</span>
                            <span className="text-[#f4afab] text-xs font-bold">98%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
                            <motion.div
                                className="h-full bg-[#f4afab]"
                                initial={{ width: 0 }} animate={{ width: "98%" }} transition={{ delay: 0.5, duration: 1 }}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] text-gray-300">
                                <CheckCircle2 size={8} className="text-[#f4afab]" /> Validated
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] text-gray-300">
                                <CheckCircle2 size={8} className="text-[#f4afab]" /> Pro
                            </div>
                        </div>
                    </GlassCard>


                    {/* === COLUMN 2 (CENTER) === */}

                    {/* 4. Date (Top Center Left) */}
                    <GlassCard className="absolute left-[256px] top-0 w-[152px] h-[100px] flex items-center justify-center text-center" delay={0.3}>
                        <div>
                            <span className="text-3xl font-bold text-white block">12</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Oct, 2025</span>
                        </div>
                    </GlassCard>

                    {/* 5. Dots (Top Center Right) */}
                    <GlassCard className="absolute left-[424px] top-0 w-[152px] h-[100px]" delay={0.35}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] text-gray-400">Log Stream</span>
                            <MoreHorizontal size={12} className="text-gray-600" />
                        </div>
                        <div className="flex flex-wrap gap-1.5 content-start">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className={cn("w-2 h-2 rounded-full transition-colors duration-500", i < 9 ? "bg-[#f4afab] animate-pulse" : "bg-gray-800")} />
                            ))}
                        </div>
                    </GlassCard>

                    {/* 6. Total Income (Middle Center) */}
                    <GlassCard className="absolute left-[256px] top-[116px] w-[320px] h-[104px]" delay={0.4}>
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-white/5 rounded-lg text-[#f4afab]"><Wallet size={18} /></div>
                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Net Revenue</span>
                                    <span className="text-xl font-bold text-white">$ 124,392.00</span>
                                </div>
                            </div>
                            <span className="px-2 py-1 rounded bg-[#f4afab]/10 text-[#f4afab] text-[10px] font-mono">+18.2%</span>
                        </div>
                    </GlassCard>

                    {/* 7. Credit Card (Lower Center) */}
                    <GlassCard className="absolute left-[256px] top-[236px] w-[320px] h-[160px] bg-gradient-to-br from-[#1a1a1a] to-black border-white/5" delay={0.5}>
                        <div className="flex justify-between items-start mb-6">
                            <CreditCard className="text-[#f4afab]" size={24} />
                            <span className="text-lg font-bold italic text-white/10 font-serif">MASTER</span>
                        </div>
                        <div className="mt-auto">
                            <span className="block text-gray-500 text-[9px] uppercase tracking-wider mb-1">Total Liquidity</span>
                            <span className="text-2xl font-mono text-white tracking-tight">$ 890,450.00</span>
                            <div className="flex justify-between items-end mt-3 border-t border-white/10 pt-2">
                                <span className="text-[10px] text-gray-400 font-mono">**** **** **** 8821</span>
                                <span className="text-[10px] text-[#f4afab]">Active</span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* 10. System Health (Bottom Center) */}
                    <GlassCard className="absolute left-[256px] top-[412px] w-[320px] h-[88px]" delay={0.8}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity className="text-[#f4afab] animate-pulse" size={18} />
                                <div>
                                    <span className="text-xs text-white font-bold block">Core Status</span>
                                    <span className="text-[9px] text-gray-500">Systems nominal</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[#f4afab] text-sm font-mono block">99.99%</span>
                                <span className="text-[8px] text-gray-500">UPTIME</span>
                            </div>
                        </div>
                        <div className="flex gap-1 mt-3 h-1.5 w-full">
                            <div className="flex-1 bg-[#f4afab] rounded-full opacity-80" />
                            <div className="flex-1 bg-[#f4afab] rounded-full opacity-60" />
                            <div className="flex-1 bg-[#f4afab] rounded-full opacity-40" />
                        </div>
                    </GlassCard>

                    {/* === COLUMN 3 (RIGHT) === */}

                    {/* 8. Traffic Score (Tall Right) */}
                    <GlassCard className="absolute left-[592px] top-0 w-[208px] h-[280px] bg-[#f4afab] text-black border-none" delay={0.6}>
                        <div className="mb-4">
                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">User Flow</span>
                            <h3 className="text-5xl font-black mt-1 tracking-tighter">2,841</h3>
                            <span className="text-[10px] font-bold opacity-60">+412 today</span>
                        </div>
                        <div className="mt-auto flex items-end gap-1 h-32 opacity-80">
                            {[30, 50, 25, 60, 40, 90, 65, 35].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.8 + (i * 0.05), duration: 0.5 }}
                                    className="flex-1 bg-black rounded-t-sm"
                                />
                            ))}
                        </div>
                    </GlassCard>

                    {/* 9. Help Chat (Lower Right) */}
                    <GlassCard className="absolute left-[592px] top-[296px] w-[208px] h-[100px]" delay={0.7}>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <MessageSquare size={14} className="text-[#f4afab]" />
                            </div>
                            <div>
                                <h4 className="text-white text-xs font-bold mb-1">Support</h4>
                                <p className="text-[9px] text-gray-400 leading-tight">AI agents active.</p>
                            </div>
                        </div>
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#f4afab] animate-pulse" />
                    </GlassCard>

                    {/* 11. Active Users (Bottom Right) */}
                    <GlassCard className="absolute left-[592px] top-[412px] w-[208px] h-[88px] bg-white/5" delay={0.9}>
                        <div className="flex justify-between items-center mb-2">
                            <Users size={16} className="text-blue-400" />
                            <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 rounded">LIVE</span>
                        </div>
                        <div className="flex -space-x-2 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-gray-700 border border-black flex items-center justify-center text-[8px] text-white">
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] text-gray-400">+240 active now</span>
                    </GlassCard>

                </>
            )}

            {/* Background Glow behind Grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#f4afab]/10 blur-[100px] -z-10 pointer-events-none" />

        </div>
    );
};


// --- 5. MAIN HERO COMPONENT ---
export default function InteractiveHero() {
    return (
        <section className="relative w-full min-h-screen bg-transparent text-white font-sans overflow-hidden selection:bg-[#f4afab]/30">

            {/* HERO TEXT SECTION */}
            <div className="relative z-10 flex flex-col items-center pt-32 mb-10 pointer-events-auto">
                <div className="text-center max-w-5xl px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f4afab]/30 bg-[#f4afab]/10 text-[#f4afab] text-[10px] tracking-widest font-mono mb-6"
                    >
                        <Cpu size={12} /> PROTOCOL INITIALIZED
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]"
                    >
                        <span className="text-white">UNLEASH YOUR </span>
                        <br className="hidden md:block" />
                        <TypewriterText />
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-gray-400 max-w-2xl mx-auto mb-10"
                    >
                        The centralized neural core for your entire digital ecosystem.
                        Zero latency, infinite scalability.
                    </motion.p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-3 bg-[#f4afab] text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(244,175,171,0.4)]">
                            Deploy System
                        </button>
                        <button className="px-8 py-3 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group">
                            Watch Demo <PlayCircle size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- DASHBOARD ANIMATION --- */}
            <DashboardAnimation />

        </section>
    );
}