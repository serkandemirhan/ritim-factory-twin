import { Text } from "@react-three/drei";
import type { ReactNode } from "react";

interface ZoneProps {
  position: [number, number, number];
  size: [number, number];
  color: string;
  children?: ReactNode;
}

function FloorZone({ position, size, color, children }: ZoneProps) {
  return (
    <group position={position}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial color={color} transparent opacity={0.22} />
      </mesh>
      {children}
    </group>
  );
}

function ZoneBorder({ size, color = "#52727a" }: { size: [number, number]; color?: string }) {
  const [width, depth] = size;
  const lines = [
    [0, depth / 2, width, 0.08], [0, -depth / 2, width, 0.08],
    [width / 2, 0, 0.08, depth], [-width / 2, 0, 0.08, depth],
  ];

  return (
    <group>
      {lines.map(([x, z, lineWidth, lineDepth], index) => (
        <mesh key={index} position={[x, 0.018, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[lineWidth, lineDepth]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function FloorLabel({ children, position, size = 0.62 }: { children: string; position: [number, number, number]; size?: number }) {
  return (
    <Text position={position} rotation={[-Math.PI / 2, 0, 0]} fontSize={size} color="#17212a" anchorX="center" anchorY="middle" letterSpacing={0.08}>
      {children}
    </Text>
  );
}

function DashedLane({ position, length, vertical = false }: { position: [number, number, number]; length: number; vertical?: boolean }) {
  return (
    <group position={position}>
      {Array.from({ length: Math.floor(length / 1.5) }, (_, index) => {
        const offset = -length / 2 + 0.72 + index * 1.5;
        return (
          <mesh key={index} position={vertical ? [0, 0.022, offset] : [offset, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={vertical ? [0.12, 0.74] : [0.74, 0.12]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        );
      })}
    </group>
  );
}

function PerimeterWalls() {
  const wallMaterial = <meshStandardMaterial color="#b8c4c6" roughness={0.8} />;

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.4, -35.8]}><boxGeometry args={[80, 0.8, 0.4]} />{wallMaterial}</mesh>
      <mesh castShadow receiveShadow position={[-39.8, 0.4, -6.9]}><boxGeometry args={[0.4, 0.8, 57.8]} />{wallMaterial}</mesh>
      <mesh castShadow receiveShadow position={[39.8, 0.4, 25]}><boxGeometry args={[0.4, 0.8, 21.6]} />{wallMaterial}</mesh>
      <mesh castShadow receiveShadow position={[39.8, 0.4, -30]}><boxGeometry args={[0.4, 0.8, 11.6]} />{wallMaterial}</mesh>
      <mesh castShadow receiveShadow position={[0, 0.4, 35.8]}><boxGeometry args={[80, 0.8, 0.4]} />{wallMaterial}</mesh>
    </group>
  );
}

export function FactoryFloor() {
  const rawZones = [-30, -19, -8];
  const wipZones = [5, 14, 23, 32];

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 72]} />
        <meshStandardMaterial color="#d7e0e0" roughness={0.92} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[50, -0.012, -4]}>
        <planeGeometry args={[20, 55]} />
        <meshStandardMaterial color="#aebdc1" roughness={0.9} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-50, -0.012, 29]}>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#aebdc1" roughness={0.9} />
      </mesh>

      <FloorZone position={[-2, 0.01, -1]} size={[62, 46]} color="#b6d8d6"><ZoneBorder size={[62, 46]} color="#5c8d8a" /></FloorZone>
      {rawZones.map((x, index) => (
        <FloorZone key={x} position={[x, 0.01, 29]} size={[9.6, 11]} color="#e8bd58">
          <ZoneBorder size={[9.6, 11]} color="#b7791f" />
          <FloorLabel position={[0, 0.035, 4.15]} size={0.39}>{`HAMMADDE ${index + 1}`}</FloorLabel>
        </FloorZone>
      ))}
      {wipZones.map((x, index) => (
        <FloorZone key={x} position={[x, 0.01, 29]} size={[7.6, 11]} color="#55c5ba">
          <ZoneBorder size={[7.6, 11]} color="#23857c" />
          <FloorLabel position={[0, 0.035, 4.15]} size={0.36}>{`WIP-${index + 1}`}</FloorLabel>
        </FloorZone>
      ))}
      <FloorZone position={[34, 0.01, -4]} size={[10, 51]} color="#d6e2e4"><ZoneBorder size={[10, 51]} color="#64748b" /></FloorZone>
      <FloorZone position={[-34, 0.01, 29]} size={[10, 12]} color="#e8bd58"><ZoneBorder size={[10, 12]} color="#b7791f" /></FloorZone>
      <FloorZone position={[-28, 0.01, -28]} size={[14, 11]} color="#a8c9d0"><ZoneBorder size={[14, 11]} color="#547580" /></FloorZone>

      <FloorLabel position={[-2, 0.035, -22]} size={0.82}>URETIM HATLARI</FloorLabel>
      <FloorLabel position={[34, 0.035, -30]} size={0.55}>SEVKIYAT VE YUKLEME</FloorLabel>
      <FloorLabel position={[50, 0.035, -30]} size={0.48}>DIS YUKLEME SAHASI</FloorLabel>
      <FloorLabel position={[-50, 0.035, 23]} size={0.45}>HAMMADDE GIRIS SAHASI</FloorLabel>
      <FloorLabel position={[-28, 0.035, -32.2]} size={0.56}>YONETIM OFISI</FloorLabel>
      <FloorLabel position={[18, 0.035, 22.2]} size={0.5}>KALITE VE LOJISTIK KORIDOR</FloorLabel>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.004, -27]}>
        <planeGeometry args={[62, 4]} />
        <meshStandardMaterial color="#bcc8c9" />
      </mesh>
      <DashedLane position={[-2, 0, -27]} length={61} />
      <DashedLane position={[28, 0, 0]} length={55} vertical />
      <DashedLane position={[-2, 0, 23]} length={62} />
      <DashedLane position={[50, 0, -4]} length={53} vertical />
      {[-31, -20, -9, 2, 13, 24].map((x) => (
        <mesh key={x} position={[x, 0.023, -25.8]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[7.8, 0.13]} /><meshBasicMaterial color="#fbbf24" /></mesh>
      ))}
      {[-20, -9, 2, 13].map((z) => (
        <mesh key={z} position={[34, 0.023, z - 2.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[7, 0.14]} /><meshBasicMaterial color="#fbbf24" /></mesh>
      ))}
      <PerimeterWalls />
    </group>
  );
}
