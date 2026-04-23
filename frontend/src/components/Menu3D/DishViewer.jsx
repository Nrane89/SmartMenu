import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei'
import * as THREE from 'three'

function PlaceholderDish({ color = '#f97316', scale = 1 }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })

  const baseColor = new THREE.Color(color)

  return (
    <group scale={scale}>
      {/* Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.2, 1.1, 0.08, 64]} />
        <meshStandardMaterial color="#f8f8f0" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Plate rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[1.15, 0.06, 16, 64]} />
        <meshStandardMaterial color="#e8e8e0" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Food item - main body */}
      <mesh
        ref={meshRef}
        position={[0, 0.25, 0]}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? baseColor.clone().offsetHSL(0, 0, 0.1) : baseColor}
          roughness={0.4}
          metalness={0.05}
          emissive={baseColor}
          emissiveIntensity={hovered ? 0.15 : 0.05}
        />
      </mesh>

      {/* Garnish dots */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.5,
              0.22,
              Math.sin(angle) * 0.5,
            ]}
            castShadow
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={baseColor.clone().offsetHSL(0.1, 0.2, 0.1)}
              roughness={0.3}
            />
          </mesh>
        )
      })}

      {/* Steam effect */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 0.2, 1.1, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color="white"
            transparent
            opacity={0.3}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{
        color: '#f97316',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 16,
          height: 16,
          border: '2px solid rgba(249,115,22,0.3)',
          borderTop: '2px solid #f97316',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Բեռնվում...
      </div>
    </Html>
  )
}

export default function DishViewer({ item, compact = false }) {
  return (
    <div style={{
      width: '100%',
      height: compact ? 220 : 380,
      background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.06) 0%, transparent 70%)',
      borderRadius: compact ? 12 : 20,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-3, 3, -3]} intensity={0.4} color="#a78bfa" />
        <pointLight position={[3, 1, 3]} intensity={0.3} color={item?.color || '#f97316'} />

        <Suspense fallback={<Loader />}>
          <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
            floatingRange={[-0.05, 0.05]}
          >
            <PlaceholderDish
              color={item?.color || '#f97316'}
              scale={compact ? 0.75 : 1}
            />
          </Float>
          <ContactShadows
            position={[0, -0.6, 0]}
            opacity={0.4}
            scale={4}
            blur={2}
            far={3}
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={false}
        />
      </Canvas>

      {!compact && (
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(148,163,184,0.6)',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          pointerEvents: 'none',
        }}>
          <span>↔</span> Պտտեք 3D-ը տեսնելու համար
        </div>
      )}
    </div>
  )
}
