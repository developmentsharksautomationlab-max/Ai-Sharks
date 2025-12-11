"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Zap, Send, Twitter, Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure GSAP is registered
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Local HackerText for Footer isolation
const HackerText = ({ text, active = true }: { text: string; active?: boolean }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_<>";
    const scramble = useCallback(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(text.split("").map((letter, index) => {
                if (index < iterations) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
    }, [text]);
    useEffect(() => { if (active) scramble(); }, [active, scramble]);
    return <span onMouseEnter={scramble} className="cursor-pointer inline-block">{display}</span>;
};

export default function Footer() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".footer-item",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={containerRef} className="relative w-full bg-white/[0.02] backdrop-blur-sm border-t border-white/10 pt-20 pb-10 overflow-hidden z-20 shadow-none pointer-events-auto">
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none">
                <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <div className="max-w-[1920px] mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">

                    {/* Brand Column */}
                    <div className="md:col-span-4 footer-item">
                        <div className="mb-6">
                            <Zap className="w-12 h-12 text-[#00F0FF] mb-4 animate-pulse" />
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-2 mix-blend-difference">
                                AI<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#0088ff]">SHARKS</span>
                            </h2>
                            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">
                                // System Architecture v4.0.1
                            </p>
                        </div>
                        <p className="text-gray-300 max-w-sm leading-relaxed text-sm">
                            Forging reality through quantum computation and high-fidelity rendering. We don't just build websites; we construct digital singularities.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-2 md:col-start-6 footer-item">
                        <h3 className="font-mono text-[#00F0FF] text-xs tracking-[0.2em] mb-8 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#00F0FF] rounded-sm" /> Navigation
                        </h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Services', path: '/service' },
                                { name: 'Contact', path: '/contact' }
                            ].map((item) => (
                                <li key={item.name} className="group relative">
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-0 h-[1px] bg-[#00F0FF] group-hover:w-3 transition-all duration-300" />
                                    <Link href={item.path} className="text-gray-300 hover:text-white transition-colors uppercase tracking-wider text-sm font-bold group-hover:pl-2 transition-all duration-300">
                                        <HackerText text={item.name} active={false} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Protocols */}
                    <div className="md:col-span-2 footer-item">
                        <h3 className="font-mono text-[#8A2BE2] text-xs tracking-[0.2em] mb-8 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#8A2BE2] rounded-sm" /> Protocols
                        </h3>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Matrix', 'Sitemap'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-300 hover:text-[#8A2BE2] transition-colors text-sm group flex items-center gap-2">
                                        <div className="w-1 h-1 bg-white/20 group-hover:bg-[#8A2BE2] transition-colors" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Data Uplink */}
                    <div className="md:col-span-3 footer-item">
                        <h3 className="font-mono text-[#ff0055] text-xs tracking-[0.2em] mb-8 uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#ff0055] rounded-sm" /> Data Uplink
                        </h3>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#ff0055] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                            <p className="text-xs text-gray-300 mb-4 font-mono">SUBSCRIBE TO THE NEURAL FEED</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="ENTER_EMAIL_ID..."
                                    className="bg-black/50 border border-white/20 text-white px-4 py-3 w-full text-xs font-mono focus:outline-none focus:border-[#ff0055] transition-colors placeholder:text-gray-600"
                                />
                                <button className="bg-[#ff0055] hover:bg-[#ff0055]/80 text-white px-4 transition-colors flex items-center justify-center">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:border-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all duration-300 group">
                                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 footer-item">
                    <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
                        </span>
                        ALL SYSTEMS NOMINAL // © 2024 AI SHARKS
                    </div>

                    <div className="hidden md:flex flex-1 mx-12 h-[1px] bg-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-[shimmer_3s_infinite]" />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <span className="block text-[10px] text-gray-500 font-mono tracking-widest">LATENCY</span>
                            <span className="block text-xs text-[#00F0FF] font-mono">12ms</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] text-gray-500 font-mono tracking-widest">ENCRYPTION</span>
                            <span className="block text-xs text-[#00F0FF] font-mono">AES-256</span>
                        </div>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-[#00F0FF] transition-colors"
                        >
                            <ArrowDown className="w-5 h-5 rotate-180" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(1000%); }
                }
            `}</style>
        </footer>
    );
}