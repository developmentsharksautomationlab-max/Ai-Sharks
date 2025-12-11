"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CallToAction from "../components/CallToAction";

// --- CONTACT PARTICLES (VORTEX TUNNEL) ---
// Extracted and simplified from the main page's HyperParticles
const ContactParticles = () => {
    const count = 4000; // Slightly less dense for cleaner look
    const mesh = useRef<THREE.Points>(null);
    const { mouse, viewport } = useThree();

    const initialPositions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, []);

    const randomness = useMemo(() => new Float32Array(count).map(() => Math.random()), []);
    const currentPositions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);

    const getTargetPosition = (i: number, time: number) => {
        const t = i / count;
        const rnd = randomness[i];

        // VORTEX TUNNEL SHAPE
        const tunnelRadius = 2 + (1 - t) * 8;
        const tunnelAngle = t * Math.PI * 20 + time * 0.5;
        const tunnelDepth = (t - 0.5) * 20;

        let x = Math.cos(tunnelAngle) * tunnelRadius;
        let y = Math.sin(tunnelAngle) * tunnelRadius;
        let z = tunnelDepth;

        if (z > 0) {
            x *= (1 + Math.sin(time * 5) * 0.05);
            y *= (1 + Math.cos(time * 5) * 0.05);
        }

        return [x, y, z];
    };

    useFrame((state) => {
        if (!mesh.current) return;
        const time = state.clock.elapsedTime;

        // Color - Fixed Cyan for Contact
        (mesh.current.material as THREE.PointsMaterial).color.lerp(new THREE.Color("#00F0FF"), 0.05);

        const hoverX = (mouse.x * viewport.width) / 2;
        const hoverY = (mouse.y * viewport.height) / 2;

        for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const [tx, ty, tz] = getTargetPosition(i, time);
            const speed = 0.04;

            // Simple Lerp
            currentPositions[idx] += (tx - currentPositions[idx]) * speed;
            currentPositions[idx + 1] += (ty - currentPositions[idx + 1]) * speed;
            currentPositions[idx + 2] += (tz - currentPositions[idx + 2]) * speed;

            // Mouse Repulsion
            const dx = currentPositions[idx] - hoverX;
            const dy = currentPositions[idx + 1] - hoverY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 4) {
                // Vortex Tunnel specific interaction
                currentPositions[idx] -= dx * 0.01;
                currentPositions[idx + 1] -= dy * 0.01;
            }
        }

        mesh.current.geometry.attributes.position.needsUpdate = true;

        // Vortex Rotation
        mesh.current.rotation.z -= 0.002;
        mesh.current.rotation.y = mouse.x * 0.2;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[currentPositions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.04}
                color="#00F0FF"
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default function ContactPage() {
    return (
        <div className="relative w-full min-h-screen bg-black text-white selection:bg-[#00F0FF] selection:text-black overflow-hidden">
            <Header activeColor="#00F0FF" />

            {/* 3D Background */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
                <Canvas gl={{ antialias: false, powerPreference: "high-performance" }} dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 45 }}>
                    <Suspense fallback={null}>
                        <ContactParticles />
                        {/* @ts-ignore */}
                        <EffectComposer disableNormalPass>
                            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                            <Noise opacity={0.05} />
                            <Vignette eskil={false} offset={0.1} darkness={1.0} />
                        </EffectComposer>
                    </Suspense>
                </Canvas>
            </div>

            {/* Main Content */}
            <main className="relative z-10 w-full min-h-screen flex flex-col pt-20">
                <div className="flex-grow flex items-center justify-center">
                    <CallToAction />
                </div>
                <Footer />
            </main>
        </div>
    );
}
