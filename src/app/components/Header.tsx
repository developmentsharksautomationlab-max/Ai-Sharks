"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Globe, Menu, X, ChevronRight } from "lucide-react";
import gsap from "gsap";

// Local HackerText for Header isolation
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

export default function Header({ activeColor = "#00F0FF" }: { activeColor?: string }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(headerRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.5 }
        );

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Services", path: "/service" },
        { name: "Contact", path: "/contact" } // Link to CTA
    ];

    return (
        <>
            <header
                ref={headerRef}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${isScrolled
                    ? "py-4 border-white/10 bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30 shadow-lg"
                    : "py-6 border-transparent bg-transparent"
                    }`}
            >
                {/* Scroll Progress Line - Dynamic Color */}
                <div
                    className={`absolute bottom-0 left-0 w-full h-[1px] opacity-0 transition-opacity duration-500 ${isScrolled ? "opacity-50" : ""}`}
                    style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)` }}
                />

                <div className="max-w-[1920px] mx-auto px-6 md:px-12 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2 group cursor-pointer pointer-events-auto">
                        <div className="relative w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-sm overflow-hidden transition-colors" style={{ borderColor: isScrolled ? activeColor : 'rgba(255,255,255,0.1)' }}>
                            <Globe className="w-5 h-5 text-white animate-[spin_10s_linear_infinite]" style={{ color: activeColor }} />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: activeColor }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-white leading-none">
                                AI<span style={{ color: activeColor }} className="transition-colors duration-500">SHARKS</span>
                            </span>
                            <span className="text-[9px] font-mono tracking-[0.3em] text-gray-400 transition-colors duration-500" style={{ color: isScrolled ? activeColor : undefined }}>
                                STUDIO
                            </span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1 pointer-events-auto">
                        <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 px-2">
                            {navItems.map((item, i) => (
                                <Link key={i} href={item.path} className="relative px-6 py-2 rounded-full overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
                                    <span className="relative z-10 text-sm font-medium text-gray-300 group-hover:text-white transition-colors font-mono">
                                        <HackerText text={item.name} active={false} />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <button
                            className="hidden md:flex items-center gap-2 text-black px-6 py-2.5 rounded-sm font-bold text-xs tracking-widest hover:bg-white hover:scale-105 transition-all duration-300"
                            style={{
                                backgroundColor: activeColor,
                                boxShadow: `0 0 20px ${activeColor}50` // 50 = hex alpha
                            }}
                        >
                            INITIALIZE <ChevronRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white active:scale-90 transition-transform z-50 relative"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {navItems.map((item, i) => (
                        <Link
                            key={i}
                            href={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-4xl font-black text-white hover:text-[#00F0FF] transition-colors tracking-tighter"
                        >
                            <HackerText text={item.name} active={isMenuOpen} />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
} 