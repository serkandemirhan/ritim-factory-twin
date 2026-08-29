import { useFrame } from "@react-three/fiber";
import { Billboard, Html, Text } from "@react-three/drei";
import { Group } from "three";
import { useRef } from "react";
import { objectLibrary } from "../../data/objectLibrary";
import { useFactoryStore } from "../../store/factoryStore";
import type { FactoryObject } from "../../types/factory";
import { InfrastructurePlaceholder } from "../library/InfrastructurePlaceholder";
import { LogisticsPlaceholder } from "../library/LogisticsPlaceholder";
import { MachinePlaceholder } from "../library/MachinePlaceholder";
import { PalletPlaceholder } from "../library/PalletPlaceholder";
import { QualityPlaceholder } from "../library/QualityPlaceholder";
import { RackPlaceholder } from "../library/RackPlaceholder";

type StockStage = "raw" | "wip" | "finished";

interface FactoryObject3DProps {
  object: FactoryObject;
  selected: boolean;
  onSelect: () => void;
  onContextMenu: (x: number, y: number) => void;
  onMoveStart: (screenX: number, screenY: number) => void;
  onMove: (screenX: number, screenY: number) => void;
  onMoveEnd: () => void;
  isDirectMoveEnabled: boolean;
  onRefChange: (instance: Group | null) => void;
}

function activityLabelHeight(assetType: FactoryObject["assetType"]): number {
  if (assetType === "RACK") {
    return 4.8;
  }

  if (assetType === "MACHINE" || assetType === "QUALITY_STATION") {
    return 3.5;
  }

  return 2.1;
}

function getMachineLabel(name: string): string | null {
  const number = name.match(/\d+/)?.[0];

  return number ? `CNC${number.padStart(2, "0")} · MAZAK VCN` : null;
}

function getStockStage(name: string): StockStage {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("raw") || normalizedName.includes("input")) {
    return "raw";
  }

  if (
    normalizedName.includes("finished") ||
    normalizedName.includes("shipment") ||
    normalizedName.includes("output")
  ) {
    return "finished";
  }

  return "wip";
}

export function FactoryObject3D({
  object,
  selected,
  onSelect,
  onContextMenu,
  onMoveStart,
  onMove,
  onMoveEnd,
  isDirectMoveEnabled,
  onRefChange,
}: FactoryObject3DProps) {
  const groupRef = useRef<Group>(null);
  const cargoRef = useRef<Group>(null);
  const definition = objectLibrary.find((item) => item.id === object.libraryObjectId);
  const activity = useFactoryStore((state) =>
    state.activities.find(
      (item) =>
        item.objectId === object.id && Date.now() - new Date(item.createdAt).getTime() < 7000,
    ),
  );
  const machineStatus = useFactoryStore((state) => state.machineStatuses[object.id] ?? "running");
  const applicationMode = useFactoryStore((state) => state.applicationMode);
  const openActivityDetail = useFactoryStore((state) => state.openActivityDetail);
  const isOperator = object.libraryObjectId === "operator";
  const isTruck = object.libraryObjectId === "delivery-truck";
  const animationOffset = Array.from(object.id).reduce((total, character) => total + character.charCodeAt(0), 0) % 11;

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    if (applicationMode !== "operations") {
      groupRef.current.position.set(object.position.x, object.position.y, object.position.z);
      groupRef.current.rotation.y = object.rotation.y;
      groupRef.current.visible = true;
      if (cargoRef.current) {
        cargoRef.current.visible = true;
      }
      return;
    }

    const elapsed = clock.getElapsedTime() + animationOffset;

    if (isOperator) {
      // Operators pace within their assigned cell instead of walking through equipment.
      const stride = Math.sin(elapsed * 1.8) * 0.48;
      groupRef.current.position.set(
        object.position.x + Math.cos(object.rotation.y) * stride,
        object.position.y + Math.abs(Math.sin(elapsed * 3.6)) * 0.035,
        object.position.z - Math.sin(object.rotation.y) * stride,
      );
      groupRef.current.rotation.y = object.rotation.y + (Math.cos(elapsed * 1.8) < 0 ? Math.PI : 0);
      return;
    }

    if (isTruck) {
      const phase = (elapsed % 18) / 18;
      const direction = object.position.x >= 0 ? 1 : -1;
      const approaching = phase < 0.25;
      const departing = phase >= 0.66 && phase < 0.9;
      const parked = phase >= 0.25 && phase < 0.66;
      const distanceFromDock = approaching
        ? 7 * (1 - phase / 0.25)
        : departing
          ? 7 * ((phase - 0.66) / 0.24)
          : phase >= 0.9
            ? 7
            : 0;

      groupRef.current.position.set(
        object.position.x + direction * distanceFromDock,
        object.position.y,
        object.position.z,
      );
      groupRef.current.visible = phase < 0.96;

      if (cargoRef.current) {
        cargoRef.current.visible = parked;
        const loadingProgress = Math.min(1, Math.max(0, (phase - 0.25) / 0.18));
        cargoRef.current.position.z = 0.7 - (1 - loadingProgress) * 1.3;
      }
    }
  });

  if (!definition) {
    return null;
  }

  return (
    <group
      ref={(instance) => {
        groupRef.current = instance;
        onRefChange(instance);
      }}
      position={[object.position.x, object.position.y, object.position.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
        if (applicationMode === "operations" && activity) {
          openActivityDetail(activity.id);
        }
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();

        if (isDirectMoveEnabled) {
          const pointerTarget = event.target as unknown as {
            setPointerCapture?: (pointerId: number) => void;
          };
          pointerTarget.setPointerCapture?.(event.pointerId);
          onMoveStart(event.nativeEvent.clientX, event.nativeEvent.clientY);
        }
      }}
      onPointerMove={(event) => {
        if (isDirectMoveEnabled) {
          event.stopPropagation();
          onMove(event.nativeEvent.clientX, event.nativeEvent.clientY);
        }
      }}
      onPointerUp={(event) => {
        if (isDirectMoveEnabled) {
          const pointerTarget = event.target as unknown as {
            releasePointerCapture?: (pointerId: number) => void;
          };
          pointerTarget.releasePointerCapture?.(event.pointerId);
          onMoveEnd();
        }
      }}
      onContextMenu={(event) => {
        event.stopPropagation();
        event.nativeEvent.preventDefault();
        onContextMenu(event.nativeEvent.clientX, event.nativeEvent.clientY);
      }}
    >
      {definition.category === "Machines" && (
        <MachinePlaceholder selected={selected} status={machineStatus} />
      )}
      {definition.category === "Machines" && getMachineLabel(object.name) && (
        <Billboard position={[0, 4.25, 0]}>
          <Text
            fontSize={0.44}
            color="#101820"
            outlineWidth={0.025}
            outlineColor="#f8fafc"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.04}
          >
            {getMachineLabel(object.name)}
          </Text>
        </Billboard>
      )}
      {definition.category === "Quality" && (
        <QualityPlaceholder modelKey={definition.modelKey} selected={selected} />
      )}
      {definition.id === "rack" && (
        <RackPlaceholder selected={selected} stockStage={getStockStage(object.name)} />
      )}
      {definition.id === "pallet" && (
        <PalletPlaceholder selected={selected} stockStage={getStockStage(object.name)} />
      )}
      {definition.category === "Logistics" && (
        <LogisticsPlaceholder modelKey={definition.modelKey} selected={selected} />
      )}
      {isTruck && (
        <group ref={cargoRef} position={[0, 2.12, 0.7]}>
          {[-0.48, 0.48].map((x) => (
            <mesh key={x} castShadow position={[x, 0, 0]}>
              <boxGeometry args={[0.72, 0.52, 0.9]} />
              <meshStandardMaterial color="#eab308" roughness={0.58} />
            </mesh>
          ))}
        </group>
      )}
      {definition.category === "Infrastructure" && (
        <InfrastructurePlaceholder modelKey={definition.modelKey} selected={selected} />
      )}
      {definition.id === "material-bin" && (
        <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[1.2, 0.7, 1]} />
          <meshStandardMaterial color={selected ? "#fb923c" : "#7c8b9d"} />
        </mesh>
      )}
      {activity && (
        <Html
          position={[0, activityLabelHeight(object.assetType), 0]}
          center
          distanceFactor={12}
          style={{ pointerEvents: "auto" }}
        >
          <button
            className={`activity-label activity-label-${activity.tone}`}
            onClick={(event) => {
              event.stopPropagation();
              openActivityDetail(activity.id);
            }}
            type="button"
          >
            <strong>{activity.source}</strong>
            <span>{activity.message}</span>
          </button>
        </Html>
      )}
    </group>
  );
}
