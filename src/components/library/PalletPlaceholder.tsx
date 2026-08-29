interface PalletPlaceholderProps {
  selected: boolean;
  stockStage: "raw" | "wip" | "finished";
}

const stockColors = {
  raw: { base: "#6f7d80", top: "#8d999b" },
  wip: { base: "#4f6c6c", top: "#668080" },
  finished: { base: "#526779", top: "#6f8290" },
};

export function PalletPlaceholder({ selected, stockStage }: PalletPlaceholderProps) {
  const wood = selected ? "#19d3c5" : "#6b563f";
  const shadow = selected ? "#0f766e" : "#42372b";
  const stockColor = selected ? "#177f78" : stockColors[stockStage].base;
  const stockTopColor = selected ? "#2ba79d" : stockColors[stockStage].top;

  return (
    <group>
      {[0.28, 0, -0.28].map((z) => (
        <mesh key={z} castShadow receiveShadow position={[0, 0.18, z]}>
          <boxGeometry args={[1.5, 0.08, 0.14]} />
          <meshStandardMaterial color={wood} roughness={0.85} />
        </mesh>
      ))}
      {[0.5, 0, -0.5].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 0.08, 0]}>
          <boxGeometry args={[0.12, 0.16, 0.7]} />
          <meshStandardMaterial color={shadow} roughness={0.85} />
        </mesh>
      ))}
      {[-0.36, 0.36].flatMap((x) => [-0.2, 0.2].map((z) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh castShadow position={[0, 0.43, 0]}>
            <boxGeometry args={[0.58, 0.42, 0.32]} />
            <meshStandardMaterial color={stockColor} metalness={0.12} roughness={0.68} />
          </mesh>
          <mesh castShadow position={[0, 0.86, 0]}>
            <boxGeometry args={[0.58, 0.38, 0.32]} />
            <meshStandardMaterial color={stockTopColor} metalness={0.12} roughness={0.62} />
          </mesh>
        </group>
      )))}
    </group>
  );
}
