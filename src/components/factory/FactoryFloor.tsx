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
      <mesh castShadow receiveShadow position={[0, 0.4, -29.8]}><boxGeometry args={[64, 0.8, 0.4]} />{wallMaterial}</mesh>
      <mesh castShadow receiveShadow position={[-31.8, 0.4, -6.9]}><boxGeometry args={[0.4, 0.8, 45.8]} />{wallMaterial}</mesh>
      <mesh castShadow receiveShadow position={[31.8, 0.4, 24]}><boxGeometry args={[0.4, 0.8, 11.6]} />{wallMaterial}</mesh>
      <mesh castShadow receiveShadow position={[31.8, 0.4, -24]}><boxGeometry args={[0.4, 0.8, 11.6]} />{wallMaterial}</mesh>
      <mesh castShadow receiveShadow position={[0, 0.4, 29.8]}><boxGeometry args={[64, 0.8, 0.4]} />{wallMaterial}</mesh>
    </group>
  );
}

export function FactoryFloor() {
  const rawZones = [-25, -17, -9];
  const wipZones = [1, 9, 17, 25];

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[64, 60]} />
        <meshStandardMaterial color="#d7e0e0" roughness={0.92} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[42, -0.012, 0]}>
        <planeGeometry args={[20, 46]} />
        <meshStandardMaterial color="#aebdc1" roughness={0.9} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-42, -0.012, 23]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#aebdc1" roughness={0.9} />
      </mesh>

      <FloorZone position={[-4, 0.01, -3]} size={[46, 34]} color="#b6d8d6"><ZoneBorder size={[46, 34]} color="#5c8d8a" /></FloorZone>
      {rawZones.map((x, index) => (
        <FloorZone key={x} position={[x, 0.01, 23]} size={[7.2, 10]} color="#e8bd58">
          <ZoneBorder size={[7.2, 10]} color="#b7791f" />
          <FloorLabel position={[0, 0.035, 3.7]} size={0.34}>{`HAMMADDE ${index + 1}`}</FloorLabel>
        </FloorZone>
      ))}
      {wipZones.map((x, index) => (
        <FloorZone key={x} position={[x, 0.01, 23]} size={[5.8, 10]} color="#55c5ba">
          <ZoneBorder size={[5.8, 10]} color="#23857c" />
          <FloorLabel position={[0, 0.035, 3.7]} size={0.32}>{`WIP-${index + 1}`}</FloorLabel>
        </FloorZone>
      ))}
      <FloorZone position={[28, 0.01, 0]} size={[7, 46]} color="#d6e2e4"><ZoneBorder size={[7, 46]} color="#64748b" /></FloorZone>
      <FloorZone position={[-28, 0.01, 23]} size={[7, 10]} color="#e8bd58"><ZoneBorder size={[7, 10]} color="#b7791f" /></FloorZone>
      <FloorZone position={[-21, 0.01, -22]} size={[13, 10]} color="#a8c9d0"><ZoneBorder size={[13, 10]} color="#547580" /></FloorZone>

      <FloorLabel position={[-4, 0.035, -18.5]} size={0.7}>URETIM HATLARI</FloorLabel>
      <FloorLabel position={[28, 0.035, -22]} size={0.48}>SEVKIYAT VE YUKLEME</FloorLabel>
      <FloorLabel position={[42, 0.035, -22]} size={0.42}>DIS YUKLEME SAHASI</FloorLabel>
      <FloorLabel position={[-42, 0.035, 18]} size={0.4}>HAMMADDE GIRIS SAHASI</FloorLabel>
      <FloorLabel position={[-21, 0.035, -26]} size={0.48}>YONETIM OFISI</FloorLabel>
      <FloorLabel position={[14, 0.035, 15]} size={0.42}>KALITE VE LOJISTIK KORIDOR</FloorLabel>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.004, -22]}>
        <planeGeometry args={[46, 4]} />
        <meshStandardMaterial color="#bcc8c9" />
      </mesh>
      <DashedLane position={[-4, 0, -22]} length={45} />
      <DashedLane position={[22, 0, 0]} length={45} vertical />
      <DashedLane position={[-4, 0, 17]} length={46} />
      <DashedLane position={[42, 0, 0]} length={44} vertical />
      {[-25, -16, -7, 2, 11, 20].map((x) => (
        <mesh key={x} position={[x, 0.023, -20.8]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6.2, 0.13]} /><meshBasicMaterial color="#fbbf24" /></mesh>
      ))}
      {[-15, -5, 5, 15].map((z) => (
        <mesh key={z} position={[28, 0.023, z - 2.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5.2, 0.14]} /><meshBasicMaterial color="#fbbf24" /></mesh>
      ))}
      <PerimeterWalls />
    </group>
  );
}
