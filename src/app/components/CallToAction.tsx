"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, X, Send, ArrowRight } from "lucide-react";
import gsap from "gsap";

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface CallToActionProps {
  themeColor?: string;
}

export default function CallToAction({ themeColor = "#00F0FF" }: CallToActionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(0); // 0: Idle, 1: Sending, 2: Sent
  const [isHovered, setIsHovered] = useState(false); // For button hover state
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetic Effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isFormOpen) return;
    const { clientX, clientY } = e;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);

    gsap.to(".magnetic-btn", { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: "power3.out" });
    gsap.to(".magnetic-text", { x: x * 0.15, y: y * 0.15, duration: 0.5, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isFormOpen) return;
    gsap.to(".magnetic-btn", { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    gsap.to(".magnetic-text", { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep(1); // Sending
    setTimeout(() => {
      setFormStep(2); // Success
      setTimeout(() => {
        setIsFormOpen(false);
        setFormStep(0);
      }, 3000);
    }, 2000);
  };

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center z-20 overflow-hidden">

      {/* Dynamic Background Glow for CTA */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[150px] transition-all duration-1000 ${isFormOpen ? 'opacity-10 scale-150' : 'opacity-20 scale-100'}`}
        style={{ backgroundColor: themeColor }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">

        <AnimatePresence mode="wait">
          {!isFormOpen ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Status Badge */}
              <div
                className="inline-flex items-center gap-2 mb-8 border px-4 py-1.5 rounded-full backdrop-blur-md"
                style={{
                  borderColor: hexToRgba(themeColor, 0.3),
                  backgroundColor: hexToRgba(themeColor, 0.05)
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: themeColor }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: themeColor }}></span>
                </span>
                <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: themeColor }}>System Online</span>
              </div>

              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 mix-blend-overlay">
                Future <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: `linear-gradient(to right, white, ${themeColor})` }}
                >
                  Awaits
                </span>
              </h2>

              <p className="text-gray-400 max-w-xl text-lg font-light mb-12 font-mono">
                Initialize the protocol. Connect with the grid.
              </p>

              {/* THE BUTTON */}
              <div
                className="relative group cursor-pointer p-4"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onClick={() => setIsFormOpen(true)}
              >
                <div
                  className="magnetic-btn w-40 h-40 md:w-56 md:h-56 rounded-full border bg-black/40 backdrop-blur-xl flex items-center justify-center relative transition-all duration-500"
                  style={{
                    borderColor: isHovered ? themeColor : 'rgba(255,255,255,0.2)',
                    backgroundColor: isHovered ? hexToRgba(themeColor, 0.2) : 'rgba(0,0,0,0.4)',
                    boxShadow: isHovered ? `0 0 60px ${hexToRgba(themeColor, 0.4)}` : 'none'
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full border border-dashed animate-[spin_10s_linear_infinite]"
                    style={{ borderColor: hexToRgba(themeColor, 0.3) }}
                  />
                  <div className="magnetic-text flex flex-col items-center gap-2">
                    <Mail
                      className="w-8 h-8 transition-colors"
                      style={{ color: isHovered ? themeColor : 'white' }}
                    />
                    <span
                      className="font-mono text-sm tracking-widest transition-colors"
                      style={{ color: isHovered ? themeColor : 'white' }}
                    >
                      CONNECT
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-full max-w-lg mx-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Form Container */}
              <div
                className="bg-black/40 backdrop-blur-2xl border p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                style={{ borderColor: hexToRgba(themeColor, 0.3) }}
              >

                {/* Decoration Lines */}
                <div
                  className="absolute top-0 left-0 w-full h-1 opacity-50"
                  style={{ backgroundImage: `linear-gradient(to right, transparent, ${themeColor}, transparent)` }}
                />

                {formStep === 2 ? (
                  <div className="py-20 flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ backgroundColor: hexToRgba(themeColor, 0.2), color: themeColor }}
                    >
                      <CheckCircle className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Transmission Received</h3>
                    <p className="text-gray-400 font-mono text-sm">Our agents will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                    <h3 className="text-3xl font-bold text-white mb-2">Establish Uplink</h3>

                    <div className="group">
                      <label className="text-xs font-mono uppercase tracking-wider mb-2 block" style={{ color: themeColor }}>Identity</label>
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-all placeholder:text-white/20"
                        style={{
                          "--focus-color": themeColor,
                          "--focus-bg": hexToRgba(themeColor, 0.05)
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = themeColor;
                          e.currentTarget.style.backgroundColor = hexToRgba(themeColor, 0.05);
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                        }}
                      />
                    </div>

                    <div className="group">
                      <label className="text-xs font-mono uppercase tracking-wider mb-2 block" style={{ color: themeColor }}>Frequency (Email)</label>
                      <input
                        required
                        type="email"
                        placeholder="email@domain.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-all placeholder:text-white/20"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = themeColor;
                          e.currentTarget.style.backgroundColor = hexToRgba(themeColor, 0.05);
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                        }}
                      />
                    </div>

                    <div className="group">
                      <label className="text-xs font-mono uppercase tracking-wider mb-2 block" style={{ color: themeColor }}>Data Packet</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about your project..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none transition-all placeholder:text-white/20 resize-none"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = themeColor;
                          e.currentTarget.style.backgroundColor = hexToRgba(themeColor, 0.05);
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                        }}
                      />
                    </div>

                    <button
                      disabled={formStep === 1}
                      className="mt-4 w-full text-black font-bold py-4 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: themeColor }}
                    >
                      {formStep === 1 ? (
                        <span className="animate-pulse">TRANSMITTING...</span>
                      ) : (
                        <>
                          <span>INITIATE SEQUENCE</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}