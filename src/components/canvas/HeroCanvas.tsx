'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sparkles, Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AbstractShapes() {
  return (
    <group>
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-5, 2, -5]} rotation={[Math.PI / 4, 0, 0]}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#10b981"
            speed={2}
            distort={0.4}
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
        <mesh position={[6, -3, -8]} rotation={[0, Math.PI / 3, 0]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial
            color="#047857"
            transparent
            opacity={0.05}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  );
}

function LightBeams() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.1) * 0.3;
    group.current.rotation.z = Math.cos(t * 0.15) * 0.15;
  });

  return (
    <group ref={group}>
      {[...Array(6)].map((_, i) => (
        <mesh 
          key={i} 
          position={[Math.sin(i * 1.5) * 12, 0, -15]} 
          rotation={[0.5, 0, (i - 2.5) * 0.4]}
        >
          <cylinderGeometry args={[0.05, 5, 30, 32, 1, true]} />
          <meshBasicMaterial 
            color="#10b981" 
            transparent 
            opacity={0.03} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function MovingParticles({ count = 2000 }) {
  const points = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.getElapsedTime() * 0.01;
    points.current.rotation.x = state.clock.getElapsedTime() * 0.005;
  });

  return (
    <Points ref={points} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#10b981"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 1, mouse.y * 0.5, 12), 0.05);
    camera.lookAt(0, 0, 0);
  });
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 10]} intensity={1} color="#10b981" />
      
      {/* Volumetric light beams - very subtle */}
      <group>
        {[...Array(3)].map((_, i) => (
          <mesh 
            key={i} 
            position={[Math.sin(i * 3) * 15, 0, -20]} 
            rotation={[0, 0, (i - 1) * 0.3]}
          >
            <cylinderGeometry args={[0.01, 8, 40, 32, 1, true]} />
            <meshBasicMaterial 
              color="#10b981" 
              transparent 
              opacity={0.02} 
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      <MovingParticles count={1500} />
      
      {/* Large cinematic bokeh dots */}
      <Sparkles 
        count={30} 
        scale={20} 
        size={6} 
        speed={0.1} 
        color="#10b981" 
        opacity={0.3}
      />

      <Rig />
    </>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, stencil: false, depth: true }}
      >
        <Scene />
      </Canvas>
      {/* Heavy Cinematic Vignette to ensure dark corners */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,1)_90%)] pointer-events-none" />
    </div>
  );
}
