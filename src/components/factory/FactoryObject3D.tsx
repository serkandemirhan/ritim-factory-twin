import { Group } from "three";
import { Html, Text } from "@react-three/drei";
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

  if (!definition) {
    return null;
  }

  return (
    <group
      ref={onRefChange}
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
        <Text
          position={[0, 0.035, -1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.34}
          color="#101820"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          {getMachineLabel(object.name)}
        </Text>
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
