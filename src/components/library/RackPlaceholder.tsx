import { getBaseColor } from "./PlaceholderMaterials";

interface RackPlaceholderProps {
  selected: boolean;
  stockStage: "raw" | "wip" | "finished";
}

const rackStockColors = {
  raw: "#e5a529",
  wip: "#35a99d",
  finished: "#2d6eaf",
};

export function RackPlaceholder({ selected, stockStage }: RackPlaceholderProps) {
  const frameColor = getBaseColor("#0f766e", selected);
  const shelfColor = selected ? "#fde68a" : "#d9e4e5";

  return (
    <group>
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} castShadow position={[x, 2, -0.8]}>
          <boxGeometry args={[0.18, 4, 0.18]} />
          <meshStandardMaterial color={frameColor} metalness={0.15} roughness={0.5} />
        </mesh>
      ))}
      {[-1.2, 1.2].map((x) => (
        <mesh key={`${x}-rear`} castShadow position={[x, 2, 0.8]}>
          <boxGeometry args={[0.18, 4, 0.18]} />
          <meshStandardMaterial color={frameColor} metalness={0.15} roughness={0.5} />
        </mesh>
      ))}
      {[0.8, 2.1, 3.4].map((y) => (
        <mesh key={y} castShadow receiveShadow position={[0, y, 0]}>
          <boxGeometry args={[2.7, 0.14, 1.8]} />
          <meshStandardMaterial color={shelfColor} />
        </mesh>
      ))}
      {[-0.85, 0, 0.85].flatMap((x) => [0.48, 1.78, 3.08].map((y) => (
        <mesh key={`${x}-${y}`} castShadow position={[x, y, 0]}>
          <boxGeometry args={[0.65, 0.48, 1.2]} />
          <meshStandardMaterial color={selected ? "#f59e0b" : rackStockColors[stockStage]} />
        </mesh>
      )))}
    </group>
  );
}
