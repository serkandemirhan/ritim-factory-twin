import type { MachineStatus } from "../../types/factory";

interface MachinePlaceholderProps {
  selected: boolean;
  status: MachineStatus;
}

const statusStyles: Record<MachineStatus, { color: string; glow: string }> = {
  running: { color: "#0f9b8e", glow: "#5eead4" },
  stopped: { color: "#eab308", glow: "#fde68a" },
  alarm: { color: "#dc2626", glow: "#fca5a5" },
};

export function MachinePlaceholder({ selected, status }: MachinePlaceholderProps) {
  const statusStyle = statusStyles[status];
  // The full enclosure is the status signal: green running, amber stopped, red alarm.
  const bodyColor = selected ? "#fbbf24" : statusStyle.color;
  const darkMetal = "#26343b";

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[3.9, 0.36, 2.7]} />
        <meshStandardMaterial color="#66757b" metalness={0.42} roughness={0.48} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[3.55, 2.65, 2.45]} />
        <meshStandardMaterial color={bodyColor} emissive={bodyColor} emissiveIntensity={0.08} metalness={0.22} roughness={0.52} />
      </mesh>

      <mesh castShadow position={[0, 1.54, 1.25]}>
        <boxGeometry args={[2.62, 1.72, 0.06]} />
        <meshStandardMaterial color="#1d2f38" metalness={0.25} roughness={0.28} />
      </mesh>
      {[-0.66, 0.66].map((x) => (
        <group key={x} position={[x, 1.55, 1.3]}>
          <mesh castShadow>
            <boxGeometry args={[1.15, 1.5, 0.08]} />
            <meshStandardMaterial color="#31515b" metalness={0.35} roughness={0.28} />
          </mesh>
          <mesh castShadow position={[0, 0.04, 0.05]}>
            <boxGeometry args={[0.82, 0.92, 0.03]} />
            <meshStandardMaterial color="#78c7d0" emissive="#1d7580" emissiveIntensity={0.35} />
          </mesh>
          <mesh castShadow position={[x > 0 ? -0.42 : 0.42, -0.04, 0.1]}>
            <boxGeometry args={[0.06, 1.12, 0.08]} />
            <meshStandardMaterial color="#d7e1e3" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      <mesh castShadow position={[0, 0.86, 1.4]}>
        <boxGeometry args={[3.35, 0.3, 0.16]} />
        <meshStandardMaterial color={statusStyle.color} emissive={statusStyle.color} emissiveIntensity={0.22} />
      </mesh>
      <pointLight color={statusStyle.glow} intensity={status === "alarm" ? 3 : 1.4} distance={3.5} position={[0, 2.65, 1.5]} />

      <group position={[-2.05, 0, 0.55]}>
        <mesh castShadow position={[0, 0.68, 0]}>
          <boxGeometry args={[0.62, 1.15, 0.65]} />
          <meshStandardMaterial color="#4e6871" metalness={0.25} roughness={0.46} />
        </mesh>
        <mesh castShadow position={[0, 1.24, 0.19]} rotation={[-0.22, 0, 0]}>
          <boxGeometry args={[0.45, 0.38, 0.04]} />
          <meshStandardMaterial color="#1d5f69" emissive="#0f766e" emissiveIntensity={0.42} />
        </mesh>
        <mesh castShadow position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.25, 0.32, 0.18, 20]} />
          <meshStandardMaterial color={darkMetal} />
        </mesh>
      </group>

      <mesh castShadow position={[1.48, 2.52, -0.78]}>
        <boxGeometry args={[0.16, 0.38, 1.05]} />
        <meshStandardMaterial color={darkMetal} />
      </mesh>
      {[-0.42, -0.14, 0.14, 0.42].map((z) => (
        <mesh key={z} castShadow position={[1.58, 2.52, z - 0.78]}>
          <boxGeometry args={[0.03, 0.18, 0.09]} />
          <meshStandardMaterial color="#9babb0" />
        </mesh>
      ))}

      <group position={[1.22, 2.93, 0.78]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 20]} />
          <meshStandardMaterial color={statusStyle.color} emissive={statusStyle.color} emissiveIntensity={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.14, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 20]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <mesh castShadow position={[0, -0.26, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 20]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>
    </group>
  );
}
