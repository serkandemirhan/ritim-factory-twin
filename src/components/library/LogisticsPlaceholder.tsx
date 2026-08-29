import { getBaseColor } from "./PlaceholderMaterials";

interface LogisticsPlaceholderProps {
  modelKey: string;
  selected: boolean;
}

export function LogisticsPlaceholder({ modelKey, selected }: LogisticsPlaceholderProps) {
  const chassisColor = getBaseColor("#475569", selected);
  const accentColor = selected ? "#fde68a" : "#f59e0b";

  if (modelKey === "logistics-truck") {
    return (
      <group>
        <mesh castShadow receiveShadow position={[0, 0.95, 0.55]}>
          <boxGeometry args={[2.1, 1.9, 4.2]} />
          <meshStandardMaterial color={selected ? "#fde68a" : "#d9e4e5"} metalness={0.15} roughness={0.52} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.72, -2.05]}>
          <boxGeometry args={[2.1, 1.45, 1.15]} />
          <meshStandardMaterial color={selected ? "#fbbf24" : "#0f766e"} metalness={0.16} roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0, 1.05, -2.66]}>
          <boxGeometry args={[1.68, 0.66, 0.05]} />
          <meshStandardMaterial color="#78c7d0" emissive="#1d7580" emissiveIntensity={0.3} />
        </mesh>
        {[-0.95, 0.95].flatMap((x) => [-1.45, 1.55].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, 0.32, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.2, 18]} />
            <meshStandardMaterial color="#1f2937" roughness={0.65} />
          </mesh>
        )))}
        <mesh castShadow position={[0, 1.95, 1.25]}>
          <boxGeometry args={[1.55, 0.08, 0.1]} />
          <meshStandardMaterial color="#2563a8" />
        </mesh>
      </group>
    );
  }

  if (modelKey === "logistics-forklift") {
    return (
      <group>
        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[1.8, 0.9, 1.2]} />
          <meshStandardMaterial color={chassisColor} />
        </mesh>
        <mesh castShadow position={[0.45, 1.5, 0]}>
          <boxGeometry args={[0.18, 2.2, 1.1]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
        <mesh castShadow position={[0.95, 0.2, 0.25]}>
          <boxGeometry args={[0.7, 0.08, 0.12]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
        <mesh castShadow position={[0.95, 0.2, -0.25]}>
          <boxGeometry args={[0.7, 0.08, 0.12]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
        <boxGeometry args={[1.6, 0.56, 1]} />
        <meshStandardMaterial color={chassisColor} />
      </mesh>
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[1.1, 0.12, 0.7]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
    </group>
  );
}
