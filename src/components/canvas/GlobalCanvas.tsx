'use client';

import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]} // Slightly lower DPR for better performance on large areas
        gl={{ antialias: false, alpha: false, stencil: false, depth: false }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Very light ambient glow */}
        <ambientLight intensity={0.2} />
        
        {/* Sparse, large floating dots across the whole page */}
        <Sparkles 
          count={150} 
          scale={25} 
          size={2} 
          speed={0.4} 
          color="#10b981" 
          opacity={0.15}
        />

        {/* Small, fast dots */}
        <Sparkles 
          count={200} 
          scale={30} 
          size={1} 
          speed={0.8} 
          color="#34d399" 
          opacity={0.1}
        />

        {/* Larger floating "bokeh" dots */}
        <Sparkles 
          count={50} 
          scale={20} 
          size={8} 
          speed={0.2} 
          color="#10b981" 
          opacity={0.1}
        />
      </Canvas>
      
      {/* Subtle vignette for the whole page */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
}
