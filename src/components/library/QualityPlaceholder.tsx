import { getBaseColor } from "./PlaceholderMaterials";

interface QualityPlaceholderProps {
  modelKey: string;
  selected: boolean;
}

export function QualityPlaceholder({ modelKey, selected }: QualityPlaceholderProps) {
  const bodyColor = getBaseColor("#d2dbdd", selected);
  const railColor = selected ? "#fde68a" : "#31515b";

  if (modelKey === "quality-cmm") {
    return (
      <group>
        <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[3.5, 0.44, 2.55]} />
          <meshStandardMaterial color="#607078" metalness={0.2} roughness={0.58} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.52, 0]}>
          <boxGeometry args={[3.15, 0.22, 2.2]} />
          <meshStandardMaterial color="#9caeb1" roughness={0.82} />
        </mesh>
        {[-1.28, 1.28].map((x) => (
          <mesh key={x} castShadow position={[x, 1.65, 0]}>
            <boxGeometry args={[0.3, 2.45, 0.38]} />
            <meshStandardMaterial color={bodyColor} metalness={0.2} roughness={0.48} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 2.72, 0]}>
          <boxGeometry args={[3.05, 0.32, 0.52]} />
          <meshStandardMaterial color={railColor} metalness={0.38} roughness={0.35} />
        </mesh>
        <mesh castShadow position={[0.18, 2.18, 0]}>
          <boxGeometry args={[0.26, 1.05, 0.26]} />
          <meshStandardMaterial color="#45626c" metalness={0.45} roughness={0.32} />
        </mesh>
        <mesh castShadow position={[0.18, 1.54, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.7, 18]} />
          <meshStandardMaterial color="#7d9298" metalness={0.58} roughness={0.24} />
        </mesh>
        <mesh castShadow position={[0.18, 1.15, 0]}>
          <sphereGeometry args={[0.14, 18, 12]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.35} roughness={0.3} />
        </mesh>
        <mesh castShadow position={[-1.72, 1.05, 0.72]}>
          <boxGeometry args={[0.42, 1.35, 0.38]} />
          <meshStandardMaterial color="#4c6870" />
        </mesh>
        <mesh castShadow position={[-1.72, 1.4, 0.94]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[0.3, 0.36, 0.03]} />
          <meshStandardMaterial color="#77c8ca" emissive="#0f766e" emissiveIntensity={0.45} />
        </mesh>
        <pointLight color="#5eead4" intensity={1.4} distance={3} position={[0, 2.45, 0]} />
      </group>
    );
  }

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2.4, 1, 1.6]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]}>
        <boxGeometry args={[1.6, 0.14, 1.1]} />
        <meshStandardMaterial color={railColor} />
      </mesh>
      <mesh castShadow position={[0.65, 1.85, 0]}>
        <boxGeometry args={[0.14, 1, 0.14]} />
        <meshStandardMaterial color={railColor} />
      </mesh>
    </group>
  );
}
