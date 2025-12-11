'use client';

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Text, Preload, Stars, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, Globe, Activity, Aperture, Hexagon, Component, ArrowRight, Database, Layers, Cpu } from 'lucide-react';
import * as THREE from 'three';
import dynamic from 'next/dynamic';

// Dynamic Imports
const CallToAction = dynamic(() => import('./CallToAction'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });
const Header = dynamic(() => import('./Header'), { ssr: false });

// Register GSAP
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// --- CONFIGURATION: NEW "ENGINEERING" SHAPES ---
const SECTIONS = [
    {
        id: "hero",
        title: "QUANTUM\nENGINEERING",
        subtitle: "System Online",
        color: new THREE.Color("#35c4dd"), // Cyan
        shape: "QUANTUM_GRID" // A breathing data landscape
    },
    {
        id: "services",
        title: "SYSTEM\nARCHITECTURE",
        subtitle: "Our Capabilities",
        color: new THREE.Color("#ffffff"), // White
        shape: "DNA_HELIX" // Represents code structure/evolution
    },
    {
        id: "tech",
        title: "GLOBAL\nMATRIX",
        subtitle: "The Stack",
        color: new THREE.Color("#bc13fe"), // Purple
        shape: "CYBER_SPHERE" // Connected world
    },
    {
        id: "cta",
        title: "INITIATE\nSEQUENCE",
        subtitle: "Deploy",
        color: new THREE.Color("#ffd700"), // Gold
        shape: "WARP_TUNNEL" // Speed/Launch
    }
];

// --- 1. THE DIGITAL FORGE (Advanced Particle System) ---
const ServiceParticleSystem = ({ sectionIndex }: { sectionIndex: number }) => {
    const count = 12000; // High density "Baap Level"
    const mesh = useRef<THREE.Points>(null);
    const { mouse, viewport } = useThree();

    // Initial Random Positions
    const initialPositions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 30;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        return pos;
    }, []);

    const randomness = useMemo(() => new Float32Array(count).map(() => Math.random()), []);
    const currentPositions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);

    // --- SHAPE MATHEMATICS ---
    const getTargetPosition = (i: number, type: string, time: number) => {
        const t = i / count;
        const rnd = randomness[i];
        let x = 0, y = 0, z = 0;

        switch (type) {
            case "QUANTUM_GRID": // A waving floor of data
                // Grid calculation
                const cols = 100; // sqrt of roughly 10000
                const row = Math.floor(i / cols);
                const col = i % cols;

                // Spread centered
                x = (col - 50) * 0.4;
                z = (row - 50) * 0.4;

                // Wave Math
                const dist = Math.sqrt(x * x + z * z);
                y = Math.sin(x * 0.2 + time) * 1.5 + Math.cos(z * 0.2 + time) * 1.5;

                // Add some floating bits above
                if (rnd > 0.9) y += 5 + Math.sin(time + rnd * 10);

                // Tilt the grid slightly
                const tiltAngle = 0.2;
                const y_tilt = y * Math.cos(tiltAngle) - z * Math.sin(tiltAngle);
                const z_tilt = y * Math.sin(tiltAngle) + z * Math.cos(tiltAngle);
                y = y_tilt - 5; // Move down
                z = z_tilt;
                break;

            case "DNA_HELIX": // Double Helix
                const strands = 2;
                const strandOffset = (i % strands) * Math.PI;
                const height = (t - 0.5) * 25; // Tall structure
                const radius = 4;
                const twist = height * 0.5 + time;

                x = Math.cos(twist + strandOffset) * radius;
                z = Math.sin(twist + strandOffset) * radius;
                y = height;

                // Fill volume inside randomly
                if (rnd > 0.7) {
                    x *= rnd;
                    z *= rnd;
                }
                break;

            case "CYBER_SPHERE": // A detailed sphere with orbital rings
                const phi = Math.acos(-1 + (2 * i) / count);
                const theta = Math.sqrt(count * Math.PI) * phi;
                let r = 5;

                // Add "Saturn Rings" effect for some particles
                if (i % 10 === 0) {
                    const ringAngle = t * Math.PI * 20;
                    r = 8 + Math.random();
                    x = Math.cos(ringAngle + time) * r;
                    z = Math.sin(ringAngle + time) * r;
                    y = (Math.random() - 0.5) * 0.5; // Flat ring
                } else {
                    // Main Sphere
                    x = r * Math.cos(theta) * Math.sin(phi);
                    y = r * Math.sin(theta) * Math.sin(phi);
                    z = r * Math.cos(phi);
                }

                // Rotation
                const rotX = x * Math.cos(time * 0.2) - z * Math.sin(time * 0.2);
                const rotZ = x * Math.sin(time * 0.2) + z * Math.cos(time * 0.2);
                x = rotX;
                z = rotZ;
                break;

            case "WARP_TUNNEL": // High speed tunnel
                const tunnelR = 2 + Math.pow(rnd, 3) * 15;
                const tunnelA = t * Math.PI * 20 + time * 3;
                const depth = (rnd * 60) - 30;

                x = Math.cos(tunnelA) * tunnelR;
                y = Math.sin(tunnelA) * tunnelR;
                z = depth + (Math.sin(time * 8) * 5); // Intense pulsing
                break;
        }

        // Add subtle noise
        if (type !== "QUANTUM_GRID") {
            x += Math.sin(time * 3 + rnd * 10) * 0.05;
            y += Math.cos(time * 2 + rnd * 10) * 0.05;
        }

        return [x, y, z];
    };

    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.elapsedTime;
        const currentSection = SECTIONS[sectionIndex] || SECTIONS[0];

        // Color Morphing
        (mesh.current.material as THREE.PointsMaterial).color.lerp(currentSection.color, 0.05);

        // Interaction
        const hoverX = (mouse.x * viewport.width) / 2;
        const hoverY = (mouse.y * viewport.height) / 2;

        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const [tx, ty, tz] = getTargetPosition(i, currentSection.shape, time);

            // Interpolation (Smooth morphing)
            const speed = 0.03 + (randomness[i] * 0.01);

            currentPositions[idx] += (tx - currentPositions[idx]) * speed;
            currentPositions[idx + 1] += (ty - currentPositions[idx + 1]) * speed;
            currentPositions[idx + 2] += (tz - currentPositions[idx + 2]) * speed;

            // Mouse Repulsion
            const dx = currentPositions[idx] - hoverX;
            const dy = currentPositions[idx + 1] - hoverY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 4 && Math.abs(currentPositions[idx + 2]) < 10) {
                const force = (4 - dist) * 0.5;
                const angle = Math.atan2(dy, dx);
                currentPositions[idx] += Math.cos(angle) * force * 0.2;
                currentPositions[idx + 1] += Math.sin(angle) * force * 0.2;
            }
        }

        mesh.current.geometry.attributes.position.needsUpdate = true;

        // Camera/Global rotation effects
        if (currentSection.shape === "WARP_TUNNEL") {
            mesh.current.rotation.z += 0.02;
        } else {
            mesh.current.rotation.y = time * 0.05;
            mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, 0, 0.1);
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={currentPositions}
                    itemSize={3}
                    args={[currentPositions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#35c4dd"
                transparent
                opacity={0.85}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

// --- 2. UI COMPONENTS ---

const GlassCard = ({ children, className = "", index }: { children: React.ReactNode; className?: string, index?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index ? index * 0.1 : 0, duration: 0.7 }}
        className={`p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 hover:border-[#35c4dd]/50 hover:shadow-[0_0_30px_rgba(53,196,221,0.2)] transition-all duration-500 group relative overflow-hidden ${className}`}
    >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        {children}
    </motion.div>
);

const SectionHeader = ({ title, subtitle, color }: { title: string; subtitle: string, color: string }) => (
    <div className="mb-16">
        <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            className="h-1 mb-4"
            style={{ backgroundColor: color }}
        />
        <span className="font-mono text-xs tracking-[0.3em] uppercase opacity-70 mb-2 block" style={{ color: color }}>
            {subtitle}
        </span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-none">
            {title}
        </h2>
    </div>
);

// --- 3. MAIN PAGE CONTENT ---

export default function ServicesPage() {
    const [currentSection, setCurrentSection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // GSAP Scroll Logic (Same as About Page)
    useEffect(() => {
        const ctx = gsap.context(() => {
            SECTIONS.forEach((section, i) => {
                ScrollTrigger.create({
                    trigger: `#section-${section.id}`,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => setCurrentSection(i),
                    onEnterBack: () => setCurrentSection(i),
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen text-white cursor-none selection:bg-[#35c4dd] selection:text-black">

            <CustomCursor />
            <Header activeColor={SECTIONS[currentSection] ? '#' + SECTIONS[currentSection].color.getHexString() : '#35c4dd'} />

            {/* --- 3D BACKGROUND --- */}
            <div className="fixed top-0 left-0 w-full h-screen z-0 bg-black">
                <Canvas
                    dpr={[1, 1.5]}
                    gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5, powerPreference: "high-performance" }}
                    camera={{ position: [0, 0, 14], fov: 45 }}
                >
                    <Suspense fallback={null}>
                        {/* Background Stars */}
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                        {/* THE PARTICLE ENGINE */}
                        <ServiceParticleSystem sectionIndex={currentSection} />

                        {/* Post Processing */}
                        <EffectComposer enableNormalPass={false}>
                            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                            <Noise opacity={0.05} />
                            <Vignette eskil={false} offset={0.1} darkness={1.0} />
                            <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
                        </EffectComposer>
                    </Suspense>
                    <Preload all />
                </Canvas>
            </div>

            {/* --- CONTENT LAYERS --- */}
            <div className="relative z-10 w-full">

                {/* 1. HERO SECTION */}
                <section id="section-hero" className="w-full h-screen flex flex-col justify-center items-center relative px-6">
                    <div className="max-w-7xl w-full text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#35c4dd]/30 bg-[#35c4dd]/10 backdrop-blur-md mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#35c4dd] animate-pulse" />
                            <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-[#35c4dd]">ARCHITECTURAL ENGINE V.2.0</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-8 mix-blend-screen text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-600">
                            DIGITAL<br />REALITY
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg text-gray-400 font-light leading-relaxed mb-12">
                            We don't just write code. We construct <span className="text-[#35c4dd]">high-velocity ecosystems</span> that adapt, evolve, and dominate.
                        </p>
                    </div>
                </section>

                {/* 2. SERVICES GRID */}
                <section id="section-services" className="w-full min-h-screen py-32 px-6 flex items-center bg-gradient-to-b from-transparent via-black/80 to-transparent">
                    <div className="max-w-7xl w-full mx-auto">
                        <SectionHeader title="CAPABILITIES" subtitle="Engineering" color="#ffffff" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "Quantum Development",
                                    desc: "Scalable React/Next.js architectures designed for infinite growth.",
                                    icon: Component,
                                    tags: ["NEXT.JS 15", "RUST", "WASM"]
                                },
                                {
                                    title: "Neural Security",
                                    desc: "AI-driven Zero Trust protocols that predict threats before they materialize.",
                                    icon: Shield,
                                    tags: ["CYBERSEC", "AI", "BLOCKCHAIN"]
                                },
                                {
                                    title: "Void Analytics",
                                    desc: "Turning raw chaos into crystal clear data visualization and foresight.",
                                    icon: Aperture,
                                    tags: ["BIG DATA", "PREDICTIVE", "D3.JS"]
                                },
                                {
                                    title: "Hyper SEO",
                                    desc: "Rewriting the algorithmic rules to position you at the apex.",
                                    icon: Globe,
                                    tags: ["SEMANTIC", "AUTHORITY", "RANKING"]
                                }
                            ].map((item, i) => (
                                <GlassCard key={i} index={i}>
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:bg-[#35c4dd] group-hover:text-black transition-all duration-300">
                                            <item.icon size={32} />
                                        </div>
                                        <ArrowRight className="text-gray-500 group-hover:text-[#35c4dd] -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed mb-8">{item.desc}</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {item.tags.map((tag, t) => (
                                            <span key={t} className="px-3 py-1 text-[10px] font-mono border border-white/10 rounded-full text-gray-500">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. TECH STACK (Global Matrix) */}
                <section id="section-tech" className="w-full min-h-screen py-32 px-6 flex items-center">
                    <div className="max-w-7xl w-full mx-auto">
                        <SectionHeader title="THE STACK" subtitle="Infrastructure" color="#bc13fe" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            {[
                                { icon: Layers, label: "Frontend", val: "React Fiber" },
                                { icon: Database, label: "Backend", val: "Rust / Node" },
                                { icon: Cpu, label: "Core", val: "Neural AI" },
                            ].map((stat, i) => (
                                <GlassCard key={i} index={i} className="flex flex-col items-center justify-center py-16 border-[#bc13fe]/20 hover:border-[#bc13fe]">
                                    <stat.icon size={48} className="text-[#bc13fe] mb-6 opacity-80" />
                                    <h3 className="text-2xl font-bold text-white mb-2">{stat.val}</h3>
                                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                </GlassCard>
                            ))}
                        </div>

                        <div className="mt-20 border-t border-white/10 pt-10">
                            <p className="font-mono text-sm text-center text-gray-500">
                                POWERED BY <span className="text-[#bc13fe]">NVIDIA CUDA</span> CORES & <span className="text-[#bc13fe]">VERCEL EDGE</span> NETWORK
                            </p>
                        </div>
                    </div>
                </section>

                {/* 4. CTA */}
                <section id="section-cta" className="relative z-20">
                    <CallToAction themeColor="#ffd700" />
                </section>

                <Footer />
            </div>

            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}

// --- CUSTOM CURSOR ---
const CustomCursor = () => {
    const cursor = useRef<HTMLDivElement>(null);
    const ring = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const move = (e: MouseEvent) => {
            if (cursor.current) gsap.to(cursor.current, { x: e.clientX, y: e.clientY, duration: 0 });
            if (ring.current) gsap.to(ring.current, { x: e.clientX, y: e.clientY, duration: 0.15 });
        };
        const down = () => { if (ring.current) gsap.to(ring.current, { scale: 1.5, borderColor: '#35c4dd', borderWidth: '2px' }); };
        const up = () => { if (ring.current) gsap.to(ring.current, { scale: 1, borderColor: 'rgba(53, 196, 221, 0.3)', borderWidth: '1px' }); };
        window.addEventListener('mousemove', move);
        window.addEventListener('mousedown', down);
        window.addEventListener('mouseup', up);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mousedown', down);
            window.removeEventListener('mouseup', up);
        }
    }, []);
    return (
        <>
            <div ref={cursor} className="fixed top-0 left-0 w-2 h-2 bg-[#35c4dd] rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
            <div ref={ring} className="fixed top-0 left-0 w-12 h-12 border border-[#35c4dd]/30 rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform" />
        </>
    )
}