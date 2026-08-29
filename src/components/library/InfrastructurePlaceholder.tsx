import { getBaseColor } from "./PlaceholderMaterials";

interface InfrastructurePlaceholderProps {
  modelKey: string;
  selected: boolean;
}

export function InfrastructurePlaceholder({
  modelKey,
  selected,
}: InfrastructurePlaceholderProps) {
  const baseColor = getBaseColor("#64748b", selected);
  const accentColor = selected ? "#fde68a" : "#1e293b";

  if (modelKey === "infrastructure-camera") {
    return (
      <group>
        <mesh castShadow position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.6, 18]} />
          <meshStandardMaterial color={baseColor} />
        </mesh>
        <mesh castShadow position={[0, 3.15, 0]}>
          <boxGeometry args={[0.4, 0.24, 0.28]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
      </group>
    );
  }

  if (modelKey === "infrastructure-wall-block") {
    return (
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[3, 2.4, 0.4]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
    );
  }

  if (modelKey === "infrastructure-shipping-dock") {
    return (
      <group>
        <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[3.1, 0.8, 2.5]} />
          <meshStandardMaterial color="#53616c" />
        </mesh>
        <mesh castShadow position={[0, 1.15, -0.5]}>
          <boxGeometry args={[2.65, 0.75, 0.18]} />
          <meshStandardMaterial color={selected ? "#fde68a" : "#164e63"} />
        </mesh>
        {[-1.2, 1.2].map((x) => (
          <mesh key={x} castShadow position={[x, 0.9, 0.95]}>
            <boxGeometry args={[0.18, 1.8, 0.18]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        ))}
      </group>
    );
  }

  if (modelKey === "infrastructure-safety-barrier") {
    return (
      <group>
        {[-1.4, 0, 1.4].map((x) => (
          <mesh key={x} castShadow position={[x, 0.55, 0]}>
            <boxGeometry args={[0.1, 1.1, 0.1]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        ))}
        {[0.3, 0.75].map((y) => (
          <mesh key={y} castShadow position={[0, y, 0]}>
            <boxGeometry args={[3, 0.1, 0.1]} />
            <meshStandardMaterial color={selected ? "#fde68a" : "#0f766e"} />
          </mesh>
        ))}
      </group>
    );
  }

  if (modelKey === "infrastructure-operator") {
    const uniformColor = selected ? "#fde68a" : "#0f766e";

    return (
      <group>
        <mesh castShadow position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.28, 20, 16]} />
          <meshStandardMaterial color="#d7a276" />
        </mesh>
        <mesh castShadow position={[0, 1.08, 0]}>
          <capsuleGeometry args={[0.28, 0.78, 8, 16]} />
          <meshStandardMaterial color={uniformColor} />
        </mesh>
        {[-0.16, 0.16].map((x) => (
          <mesh key={x} castShadow position={[x, 0.32, 0]}>
            <boxGeometry args={[0.16, 0.62, 0.16]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
        {[-0.38, 0.38].map((x) => (
          <mesh key={x} castShadow position={[x, 1.12, 0]} rotation={[0, 0, x > 0 ? -0.3 : 0.3]}>
            <boxGeometry args={[0.13, 0.72, 0.13]} />
            <meshStandardMaterial color="#d7a276" />
          </mesh>
        ))}
        <mesh castShadow position={[0, 1.93, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.12, 20]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>
    );
  }

  if (modelKey === "infrastructure-office-desk") {
    return (
      <group>
        <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
          <boxGeometry args={[3.4, 0.16, 1.25]} />
          <meshStandardMaterial color={selected ? "#fde68a" : "#8a6244"} roughness={0.68} />
        </mesh>
        {[-1.45, 1.45].flatMap((x) => [-0.45, 0.45].map((z) => (
          <mesh key={`${x}-${z}`} castShadow position={[x, 0.4, z]}>
            <boxGeometry args={[0.12, 0.8, 0.12]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        )))}
        <mesh castShadow position={[0, 1.42, -0.18]}>
          <boxGeometry args={[1.05, 0.68, 0.08]} />
          <meshStandardMaterial color="#1f4352" emissive="#0f766e" emissiveIntensity={0.25} />
        </mesh>
        <mesh castShadow position={[0, 1.04, -0.18]}>
          <boxGeometry args={[0.12, 0.46, 0.12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh castShadow position={[0.95, 0.96, 0.15]}>
          <boxGeometry args={[0.68, 0.04, 0.32]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      </group>
    );
  }

  if (modelKey === "infrastructure-office-worker") {
    return (
      <group>
        <mesh castShadow position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.25, 18, 14]} />
          <meshStandardMaterial color="#d7a276" />
        </mesh>
        <mesh castShadow position={[0, 0.67, 0.05]}>
          <capsuleGeometry args={[0.25, 0.46, 8, 16]} />
          <meshStandardMaterial color={selected ? "#fde68a" : "#2563a8"} />
        </mesh>
        <mesh castShadow position={[0, 0.3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.5, 0.14, 0.48]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh castShadow position={[0, 0.42, -0.14]}>
          <boxGeometry args={[0.52, 0.1, 0.52]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh castShadow position={[0, 0.1, -0.14]}>
          <cylinderGeometry args={[0.08, 0.18, 0.32, 14]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[2.2, 0.18, 1]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} castShadow position={[x, 0.25, -0.3]}>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
      ))}
    </group>
  );
}
