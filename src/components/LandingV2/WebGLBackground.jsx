import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleGlobe() {
  const ref = useRef();
  
  // Create a sphere of particles
  const sphere = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const radius = 2;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.015} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function OrbitingPaths() {
  const groupRef = useRef();
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[2.2, 0.002, 16, 100]} />
        <meshBasicMaterial color="#FFB300" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[2.4, 0.002, 16, 100]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

export default function WebGLBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-brandDark opacity-60 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <fog attach="fog" args={['#05070d', 3, 8]} />
        <ParticleGlobe />
        <OrbitingPaths />
      </Canvas>
      {/* Noise overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay opacity-30" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}>
      </div>
    </div>
  );
}
