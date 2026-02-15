"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Center, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useContentStore } from '@/store/contentStore';

function HeartModel(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // subtle pulse
        const scale = active ? 1.2 : 1 + Math.sin(t * 3) * 0.05;
        meshRef.current.scale.set(scale, scale, scale);
    });

    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const geometryConfig = {
        depth: 0.4,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.1,
        bevelThickness: 0.1,
    };

    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            rotation={[0, 0, Math.PI]} // Rotate 180 deg to be upright
        >
            <extrudeGeometry args={[heartShape, geometryConfig]} />
            {/* "Melted" look achieved with high distort and speed */}
            <MeshDistortMaterial
                color={hovered ? "#ff1493" : "#800020"} // Deep burgundy to hot pink
                speed={3}
                distort={0.6} // High distortion for liquid effect
                radius={1}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
    );
}

export default function Heart3D() {
    const hero = useContentStore((state) => state.hero);

    return (
        <Canvas style={{ height: '100%', width: '100%' }} camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={1} />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Center>
                    <HeartModel />
                </Center>
            </Float>
            <Environment preset="sunset" />
        </Canvas>
    );
}
