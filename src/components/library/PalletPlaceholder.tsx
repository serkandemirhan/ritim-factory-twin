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

  const palletFrame = <group>{[0.28, 0, -0.28].map((z) => (
    <mesh key={z} castShadow receiveShadow position={[0, 0.18, z]}><boxGeometry args={[1.5, 0.08, 0.14]} /><meshStandardMaterial color={wood} roughness={0.85} /></mesh>
  ))}{[0.5, 0, -0.5].map((x) => (
    <mesh key={x} castShadow receiveShadow position={[x, 0.08, 0]}><boxGeometry args={[0.12, 0.16, 0.7]} /><meshStandardMaterial color={shadow} roughness={0.85} /></mesh>
  ))}</group>;

  if (stockStage === "raw") return <group>{palletFrame}<mesh castShadow position={[0, 0.58, 0]}><boxGeometry args={[1.18, 0.72, 0.82]} /><meshStandardMaterial color={stockColor} metalness={0.18} roughness={0.62} /></mesh><mesh position={[0, 0.87, 0]}><boxGeometry args={[0.96, 0.02, 0.58]} /><meshStandardMaterial color={stockTopColor} roughness={0.7} /></mesh></group>;
  if (stockStage === "wip") return <group>{palletFrame}<mesh castShadow position={[0, 0.68, 0]}><boxGeometry args={[1.25, 0.92, 0.88]} /><meshStandardMaterial color={stockColor} metalness={0.48} roughness={0.48} /></mesh>{[-0.42, 0, 0.42].map((x) => <mesh key={x} position={[x, 0.7, 0.45]}><boxGeometry args={[0.025, 0.58, 0.025]} /><meshStandardMaterial color="#a5b1b3" metalness={0.6} roughness={0.35} /></mesh>)}</group>;
  return (
    <group>
      {palletFrame}
      <mesh castShadow position={[0, 0.55, 0]}><boxGeometry args={[1.18, 0.62, 0.82]} /><meshStandardMaterial color={stockColor} roughness={0.65} /></mesh>
      <mesh position={[0, 0.89, 0]}><boxGeometry args={[1.0, 0.035, 0.64]} /><meshStandardMaterial color={stockTopColor} roughness={0.7} /></mesh>
    </group>
  );
}
