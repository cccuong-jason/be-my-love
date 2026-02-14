"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function FloatingHearts() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            options={{
                background: {
                    color: { value: "transparent" },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: { enable: true, mode: "push" },
                        onHover: { enable: true, mode: "repulse" },
                    },
                    modes: {
                        push: { quantity: 4 },
                        repulse: { distance: 100, duration: 0.4 },
                    },
                },
                particles: {
                    color: { value: "#FF69B4" },
                    move: {
                        direction: "top",
                        enable: true,
                        outModes: { default: "out" },
                        random: true,
                        speed: 2,
                        straight: false,
                    },
                    number: {
                        density: { enable: true },
                        value: 30, // Adjust density
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "char",
                        options: {
                            char: {
                                value: ["❤", "💕", "💖"],
                                font: "Verdana",
                                style: "",
                                weight: "400",
                                fill: true,
                            },
                        },
                    },
                    size: {
                        value: { min: 10, max: 25 },
                    },
                    rotate: {
                        value: { min: 0, max: 360 },
                        animation: {
                            enable: true,
                            speed: 5,
                            sync: false,
                        },
                    },
                },
                detectRetina: true,
                fullScreen: { enable: true, zIndex: -1 }, // Background layer
            }}
        />
    );
}
