"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";
import { useState, useRef, Suspense } from "react";

function StarBackground(props: any) {
    const ref: any = useRef(null);
    const [sphere] = useState(() => {
        const arr = new Float32Array(15000);
        const points = random.inSphere(arr, { radius: 1.2 });
        // Emergency cleanup for any NaN values from the library
        for (let i = 0; i < points.length; i++) {
            if (isNaN(points[i])) points[i] = 0;
        }
        return points;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#3b82f6"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

const ThreeBackground = () => {
    return (
        <div className="w-full h-auto fixed inset-0 z-[-1] pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Suspense fallback={null}>
                    <StarBackground />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
