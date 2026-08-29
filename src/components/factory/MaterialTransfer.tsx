import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import type { FactoryActivity, Vector3State } from "../../types/factory";

interface MaterialTransferProps {
  activity: FactoryActivity;
}

const TRANSFER_DURATION_MS = 4000;

function getRoutePosition(
  route: Vector3State[],
  progress: number,
) {
  const segments = route.slice(1).map((point, index) => {
    const previous = route[index];
    return Math.hypot(point.x - previous.x, point.z - previous.z);
  });
  const totalDistance = segments.reduce((total, length) => total + length, 0);
  let remainingDistance = totalDistance * progress;

  for (let index = 0; index < segments.length; index += 1) {
    const segmentLength = segments[index];
    const start = route[index];
    const end = route[index + 1];

    if (remainingDistance <= segmentLength || index === segments.length - 1) {
      const segmentProgress = segmentLength === 0 ? 1 : remainingDistance / segmentLength;
      return {
        x: start.x + (end.x - start.x) * segmentProgress,
        z: start.z + (end.z - start.z) * segmentProgress,
        rotationY: Math.atan2(end.x - start.x, end.z - start.z),
      };
    }

    remainingDistance -= segmentLength;
  }

  return { x: route[0].x, z: route[0].z, rotationY: 0 };
}

export function MaterialTransfer({ activity }: MaterialTransferProps) {
  const groupRef = useRef<Group>(null);
  const [isVisible, setIsVisible] = useState(true);
  const startedAt = new Date(activity.createdAt).getTime();

  useEffect(() => {
    setIsVisible(true);
  }, [activity.id]);

  useFrame(() => {
    if (!activity.transfer || !groupRef.current) {
      return;
    }

    const elapsed = Date.now() - startedAt;
    const progress = Math.min(1, Math.max(0, elapsed / TRANSFER_DURATION_MS));
    const { from, to } = activity.transfer;
    const route = [from, ...activity.transfer.waypoints, to];
    const nextPosition = getRoutePosition(route, progress);
    groupRef.current.position.set(nextPosition.x, 0, nextPosition.z);
    groupRef.current.rotation.y = nextPosition.rotationY;

    if (progress >= 1 && isVisible) {
      setIsVisible(false);
    }
  });

  if (!activity.transfer || !isVisible) {
    return null;
  }

  return (
    <group ref={groupRef} position={[activity.transfer.from.x, 0, activity.transfer.from.z]}>
      <mesh castShadow receiveShadow position={[0, 0.14, 0]}>
        <boxGeometry args={[1.45, 0.28, 1.15]} />
        <meshStandardMaterial color="#805a3b" roughness={0.8} />
      </mesh>
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} castShadow position={[x, 0.48, 0]}>
          <boxGeometry args={[0.52, 0.42, 0.78]} />
          <meshStandardMaterial color="#2aa89b" metalness={0.05} roughness={0.55} />
        </mesh>
      ))}
      <group position={[0, 0, -1.25]}>
        <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[0.8, 0.5, 1]} />
          <meshStandardMaterial color="#eab308" roughness={0.55} />
        </mesh>
        <mesh castShadow position={[0, 0.88, -0.12]}>
          <boxGeometry args={[0.48, 0.65, 0.48]} />
          <meshStandardMaterial color="#174e63" />
        </mesh>
        <mesh castShadow position={[0, 1.25, 0.26]}>
          <boxGeometry args={[0.1, 1.3, 0.08]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
      <pointLight color="#5eead4" intensity={2.2} distance={3.2} position={[0, 1.3, 0]} />
    </group>
  );
}
