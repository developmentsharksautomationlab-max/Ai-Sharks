'use client';

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Text, Preload, Stars, Sparkles, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, CheckCircle2, Users, Award, DollarSign, Network, Lightbulb, Building2 } from 'lucide-react';
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

// --- CONFIGURATION ---
const SECTIONS = [
    {
        id: "hero",
        title: "ARCHITECTS OF\nTOMORROW",
        subtitle: "System Online",
        color: new THREE.Color("#00f3ff"), // Cyan
        shape: "NEURAL_NEXUS"
    },
    {
        id: "values",
        title: "CORE\nFOUNDATION",
        subtitle: "The Code We Live By",
        color: new THREE.Color("#ffd700"), // Gold
        shape: "CRYSTALLINE_FORTRESS"
    },
    {
        id: "heritage",
        title: "TIMELINE\nEVOLUTION",
        subtitle: "Our Legacy",
        color: new THREE.Color("#bc13fe"), // Purple
        shape: "CHRONOS_HOURGLASS"
    },
    {
        id: "cta",
        title: "JOIN THE\nREVOLUTION",
        subtitle: "Initiate",
        color: new THREE.Color("#ffffff"), // White
        shape: "EVENT_HORIZON"
    }
];

// --- 1. THE ARCHITECT'S VOID (Background Depth) ---
const DeepSpaceBackground = () => {
    return (
        <group>
            {/* Infinite Stars for Depth */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Floating Energy Particles (Independent of the main shape) */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <Sparkles
                    count={300}
                    scale={12}
                    size={4}
                    speed={0.4}
                    opacity={0.4}
                    color="#ffffff"
                />
            </Float>
        </group>
    );
};

// --- 2. ADVANCED SHAPE SYSTEM (The Main Hero) ---
const ParticleBrain = ({ sectionIndex }: { sectionIndex: number }) => {
    const count = 12000; // Increased density for "Solid" look
    const mesh = useRef<THREE.Points>(null);
    const { mouse, viewport } = useThree();

    const initialPositions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 25;
        }
        return pos;
    }, []);

    const randomness = useMemo(() => new Float32Array(count).map(() => Math.random()), []);
    const currentPositions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);

    const getTargetPosition = (i: number, type: string, time: number) => {
        const t = i / count;
        const rnd = randomness[i];
        let x = 0, y = 0, z = 0;

        switch (type) {
            case "NEURAL_NEXUS":
                const phi = Math.acos(-1 + (2 * i) / count);
                const theta = Math.sqrt(count * Math.PI) * phi;
                const radius = 4 + Math.sin(phi * 20 + time) * 0.2 + Math.cos(theta * 10) * 0.2;
                x = radius * Math.cos(theta) * Math.sin(phi);
                y = radius * Math.sin(theta) * Math.sin(phi);
                z = radius * Math.cos(phi);
                if (rnd > 0.95) {
                    x *= 1.4 + Math.sin(time * 2) * 0.2;
                    y *= 1.4 + Math.cos(time * 2) * 0.2;
                    z *= 1.4;
                }
                break;

            case "CRYSTALLINE_FORTRESS":
                const angle = t * Math.PI * 2;
                const h = (rnd - 0.5) * 9;
                const w = (1 - Math.abs(h) / 4.5) * 5;
                x = Math.cos(angle * 4) * w;
                z = Math.sin(angle * 4) * w;
                y = h;
                break;

            case "CHRONOS_HOURGLASS":
                const flowSpeed = (time * 0.5 + rnd) % 2;
                let flowY = 6 - (flowSpeed * 6);
                let width = Math.abs(flowY) * 0.7 + 0.1;
                const spiral = t * Math.PI * 20 + time;
                x = Math.cos(spiral) * width;
                z = Math.sin(spiral) * width;
                y = flowY;
                if (i % 2 === 0) y = -y;
                break;

            case "EVENT_HORIZON":
                const tunnelR = 1.5 + Math.pow(rnd, 2) * 9;
                const tunnelA = t * Math.PI * 15 + time * 2;
                const depth = (rnd * 40) - 20;
                x = Math.cos(tunnelA) * tunnelR;
                y = Math.sin(tunnelA) * tunnelR;
                z = depth + (Math.sin(time * 5) * 2);
                break;
        }

        if (type !== "CRYSTALLINE_FORTRESS") {
            x += Math.sin(time * 2 + rnd * 10) * 0.05;
            y += Math.cos(time * 1.5 + rnd * 10) * 0.05;
        }
        return [x, y, z];
    };

    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.elapsedTime;
        const currentSection = SECTIONS[sectionIndex] || SECTIONS[0];

        (mesh.current.material as THREE.PointsMaterial).color.lerp(currentSection.color, 0.05);

        const hoverX = (mouse.x * viewport.width) / 2;
        const hoverY = (mouse.y * viewport.height) / 2;

        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const [tx, ty, tz] = getTargetPosition(i, currentSection.shape, time);
            const speed = 0.03 + (randomness[i] * 0.02);

            currentPositions[idx] += (tx - currentPositions[idx]) * speed;
            currentPositions[idx + 1] += (ty - currentPositions[idx + 1]) * speed;
            currentPositions[idx + 2] += (tz - currentPositions[idx + 2]) * speed;

            // Mouse Repulsion (Force Field)
            const dx = currentPositions[idx] - hoverX;
            const dy = currentPositions[idx + 1] - hoverY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 3.5 && Math.abs(currentPositions[idx + 2]) < 5) {
                const force = (3.5 - dist) * 0.8;
                const angle = Math.atan2(dy, dx);
                currentPositions[idx] += Math.cos(angle) * force * 0.15;
                currentPositions[idx + 1] += Math.sin(angle) * force * 0.15;
            }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
        mesh.current.rotation.y = time * 0.05;

        // Tilt effect based on section
        const targetRotZ = currentSection.shape === "EVENT_HORIZON" ? 0.02 * time : 0;
        mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, targetRotZ, 0.05);
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[currentPositions, 3]}
                />
            </bufferGeometry>
            {/* OPTIMIZED MATERIAL: Bigger, Brighter, Additive */}
            <pointsMaterial
                size={0.06}
                color="#00f3ff"
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

// --- 3. UI COMPONENTS ---

const GlassCard = ({ children, className = "", index }: { children: React.ReactNode; className?: string, index?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index ? index * 0.1 : 0, duration: 0.6 }}
        className={`p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/5 hover:border-[#00f3ff]/50 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] transition-all duration-500 group relative overflow-hidden ${className}`}
    >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        {children}
    </motion.div>
);

const SectionNumber = ({ number, title }: { number: string; title: string }) => (
    <div className="flex items-center gap-4 mb-6 opacity-60">
        <span className="font-mono text-xs tracking-[0.2em] text-[#00f3ff]">{number}</span>
        <div className="h-[1px] w-12 bg-white/20"></div>
        <span className="font-mono text-xs uppercase tracking-wider">{title}</span>
    </div>
);

// --- 4. MAIN PAGE ---

export default function AboutPage() {
    const [currentSection, setCurrentSection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        document.body.style.overflow = '';
    }, []);

    return (
        // IMPORTANT: Removed 'bg-black' to allow canvas to show through. Added bg-black to canvas container instead.
        <div ref={containerRef} className="relative w-full min-h-screen text-white cursor-none selection:bg-[#00f3ff] selection:text-black">

            <CustomCursor />
            <Header activeColor={SECTIONS[currentSection] ? '#' + SECTIONS[currentSection].color.getHexString() : '#00f3ff'} />

            {/* --- 3D BACKGROUND (FIXED POSITION) --- */}
            <div className="fixed top-0 left-0 w-full h-screen z-0 bg-black">
                <Canvas
                    dpr={[1, 1.5]}
                    gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5, powerPreference: "high-performance" }}
                    camera={{ position: [0, 0, 10], fov: 45 }}
                >
                    <Suspense fallback={null}>
                        {/* Background Layer */}
                        <DeepSpaceBackground />

                        {/* Main Shape */}
                        <ParticleBrain sectionIndex={currentSection} />

                        {/* Post Processing - Glow Effect */}
                        {/* @ts-ignore */}
                        <EffectComposer disableNormalPass>
                            <Bloom luminanceThreshold={0.1} mipmapBlur intensity={1.5} radius={0.5} />
                            <Noise opacity={0.05} />
                            <Vignette eskil={false} offset={0.1} darkness={1.0} />
                        </EffectComposer>

                        <ambientLight intensity={0.5} />
                    </Suspense>
                    <Preload all />
                </Canvas>
            </div>

            {/* --- CONTENT LAYERS (Z-10) --- */}
            <div className="relative z-10 w-full">

                {/* 1. HERO SECTION */}
                <section id="section-hero" className="w-full h-screen flex flex-col justify-center items-center relative px-6 pointer-events-none">
                    <div className="max-w-7xl w-full relative z-10 text-center pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse shadow-[0_0_10px_#00f3ff]" />
                            <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-[#00f3ff]">SYSTEM: ONLINE</span>
                        </motion.div>

                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-8 mix-blend-difference bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                            ABOUT US
                        </h1>

                        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-12 drop-shadow-xl">
                            We are the architects of the digital void. Operating as a strategic extension of your vision, we transform complex challenges into precision-engineered reality.
                        </p>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
                        >
                            <span className="text-[10px] uppercase tracking-widest font-mono">Explore</span>
                            <ArrowDown className="w-4 h-4" />
                        </motion.div>
                    </div>
                </section>

                {/* 2. CORE VALUES */}
                <section id="section-values" className="w-full min-h-screen py-24 flex items-center relative px-6 bg-gradient-to-b from-transparent via-black/80 to-transparent">
                    <div className="max-w-7xl w-full mx-auto">
                        <SectionNumber number="01" title="Core Ideology" />

                        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tighter">
                            OUR <span className="text-[#ffd700] drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]">VALUES</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: CheckCircle2,
                                    title: "One Stop Solution",
                                    desc: "Simplifying complexity. We integrate diverse business needs into a single, cohesive digital ecosystem."
                                },
                                {
                                    icon: Users,
                                    title: "Elite Expertise",
                                    desc: "A collective of veterans. Our team brings decades of high-stakes problem solving to your project."
                                },
                                {
                                    icon: Award,
                                    title: "Precision Quality",
                                    desc: "Beyond reliable. We deliver tangibility, assurance, and empathy with surgical consistency."
                                },
                                {
                                    icon: DollarSign,
                                    title: "Maximum Efficiency",
                                    desc: "Calibrated for results. We optimize resources to deliver exponential value for every unit invested."
                                }
                            ].map((item, i) => (
                                <GlassCard key={i} index={i}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#ffd700]/20 group-hover:border-[#ffd700] transition-colors duration-300">
                                            <item.icon className="w-6 h-6 text-white group-hover:text-[#ffd700] transition-colors" />
                                        </div>
                                        <span className="font-mono text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">0{i + 1}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[#ffd700] transition-colors">{item.title}</h3>
                                    <p className="text-gray-400 font-light leading-relaxed">{item.desc}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. HERITAGE (Timeline) */}
                <section id="section-heritage" className="w-full min-h-screen py-24 flex items-center relative px-6">
                    <div className="max-w-7xl w-full mx-auto">
                        <SectionNumber number="02" title="The Timeline" />

                        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-xl">
                                TWO DECADES OF <span className="text-[#bc13fe] drop-shadow-[0_0_25px_rgba(188,19,254,0.6)]">EVOLUTION</span>
                            </h2>
                            <p className="text-gray-400 max-w-sm text-sm md:text-base mt-6 md:mt-0 border-l border-[#bc13fe] pl-4">
                                From a B2B marketplace to a global outsourcing hub. We have consistently uplifted the heritage flag high.
                            </p>
                        </div>

                        <div className="relative mt-20">
                            <div className="absolute top-0 left-[19px] md:left-1/2 bottom-0 w-[2px] bg-white/10 origin-top"></div>

                            <div className="space-y-12 relative">
                                {[
                                    {
                                        year: "2005",
                                        end: "2016",
                                        title: "The Marketplace Era",
                                        icon: Network,
                                        desc: "Initialized as a B2B Nexus. Enabling companies to connect and conduct business in a unified digital space.",
                                        align: "left"
                                    },
                                    {
                                        year: "2017",
                                        end: "2019",
                                        title: "Digital Agency Shift",
                                        icon: Lightbulb,
                                        desc: "Transitioned to a full-service Digital Agency. Catering to thousands of global clients with bespoke solutions.",
                                        align: "right"
                                    },
                                    {
                                        year: "2020",
                                        end: "NOW",
                                        title: "Outsourcing Hub",
                                        icon: Building2,
                                        desc: "The current epoch. Providing high-end staff augmentation, web/app development, and marketing for IT giants.",
                                        align: "left"
                                    }
                                ].map((phase, i) => (
                                    <div key={i} className={`flex flex-col md:flex-row ${phase.align === 'right' ? 'md:flex-row-reverse' : ''} items-center w-full gap-8 group`}>

                                        <div className="w-full md:w-1/2 flex justify-start md:justify-center relative z-10 pl-1 md:pl-0">
                                            <div className="w-10 h-10 rounded-full bg-black border-2 border-[#bc13fe] shadow-[0_0_20px_rgba(188,19,254,0.4)] flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                            <div className={`hidden md:block absolute top-2 ${phase.align === 'left' ? 'right-12 text-right' : 'left-12 text-left'}`}>
                                                <span className="font-mono text-[#bc13fe] text-xl font-bold block">{phase.year}</span>
                                                <span className="font-mono text-gray-600 text-sm block">{phase.end}</span>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-1/2 pl-12 md:pl-0">
                                            <GlassCard className="border-l-4 border-l-[#bc13fe] md:border-l-white/10 md:group-hover:border-l-[#bc13fe]">
                                                <div className="md:hidden font-mono text-[#bc13fe] text-sm mb-2">{phase.year} - {phase.end}</div>

                                                <div className="flex items-center gap-3 mb-4">
                                                    <phase.icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                                                    <h3 className="text-xl md:text-2xl font-bold">{phase.title}</h3>
                                                </div>
                                                <p className="text-gray-400 text-sm leading-relaxed">{phase.desc}</p>
                                            </GlassCard>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="section-cta" className="relative z-20">
                    <CallToAction themeColor="#ffffff" />
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
        const down = () => { if (ring.current) gsap.to(ring.current, { scale: 1.5, borderColor: '#00f3ff', borderWidth: '2px' }); };
        const up = () => { if (ring.current) gsap.to(ring.current, { scale: 1, borderColor: 'rgba(255,255,255,0.3)', borderWidth: '1px' }); };
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
            <div ref={cursor} className="fixed top-0 left-0 w-2 h-2 bg-[#00f3ff] rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference" />
            <div ref={ring} className="fixed top-0 left-0 w-12 h-12 border border-white/30 rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform" />
        </>
    )
}