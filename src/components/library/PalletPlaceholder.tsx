interface PalletPlaceholderProps {
  selected: boolean;
  stockStage: "raw" | "wip" | "finished";
}

const stockColors = {
  raw: { base: "#e5a529", top: "#f6c94e" },
  wip: { base: "#2aa89b", top: "#4fc2b7" },
  finished: { base: "#2563a8", top: "#5b9bd5" },
};

export function PalletPlaceholder({ selected, stockStage }: PalletPlaceholderProps) {
  const wood = selected ? "#fb923c" : "#b77945";
  const shadow = selected ? "#fdba74" : "#8b5e34";
  const stockColor = selected ? "#fbbf24" : stockColors[stockStage].base;
  const stockTopColor = selected ? "#fde68a" : stockColors[stockStage].top;

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
            <meshStandardMaterial color={stockColor} roughness={0.55} />
          </mesh>
          <mesh castShadow position={[0, 0.86, 0]}>
            <boxGeometry args={[0.58, 0.38, 0.32]} />
            <meshStandardMaterial color={stockTopColor} roughness={0.5} />
          </mesh>
        </group>
      )))}
    </group>
  );
}
