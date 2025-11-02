"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function CarModel() {
  const { scene } = useGLTF("/assets/car.glb");

  // Add emissive glow to car material
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = child.material.color.clone();
      child.material.emissiveIntensity = 0.3; // Subtle glow
    }
  });

  return (
    <primitive
      object={scene}
      scale={1.0}
      position={[0, -0.5, 0]}
      rotation={[0, Math.PI / 2.5, 0]}
    />
  );
}

export default function CarScene() {
  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [5, 2, 5], fov: 45 }} style={{ background: "transparent" }}>
        <Suspense fallback={null}>
          {/* Ambient and spotlights */}
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.4} penumbra={1} intensity={2.5} color="#00ffff" />
          <spotLight position={[-10, 10, -10]} angle={0.4} penumbra={1} intensity={2.5} color="#66ccff" />
          
          {/* Subtle light near car for reflection */}
          <pointLight position={[0, 1, 2]} intensity={1.5} color="#00bfff" />
          <pointLight position={[0, 1, -2]} intensity={1.5} color="#00bfff" />

          <Environment preset="city" />
          <CarModel />

          {/* Bloom for glow */}
          <EffectComposer>
            <Bloom intensity={1.2} luminanceThreshold={0.15} luminanceSmoothing={0.9} />
          </EffectComposer>

          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
