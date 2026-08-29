import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MOUSE, PerspectiveCamera } from "three";
import { useFactoryStore } from "../../store/factoryStore";
import { FactoryFloor } from "./FactoryFloor";
import { FactoryObject3D } from "./FactoryObject3D";
import { MaterialTransfer } from "./MaterialTransfer";

interface FactorySceneProps {
  onObjectContextMenu: (objectId: string, x: number, y: number) => void;
}

export function FactoryScene({ onObjectContextMenu }: FactorySceneProps) {
  const objects = useFactoryStore((state) => state.objects);
  const selectedObjectId = useFactoryStore((state) => state.selectedObjectId);
  const activeTransformMode = useFactoryStore((state) => state.activeTransformMode);
  const applicationMode = useFactoryStore((state) => state.applicationMode);
  const updateObjectPlacement = useFactoryStore((state) => state.updateObjectPlacement);
  const selectObject = useFactoryStore((state) => state.selectObject);
  const activities = useFactoryStore((state) => state.activities);
  const orbitControlsRef = useRef<any>(null);
  const dragStateRef = useRef<{
    objectId: string;
    startScreenX: number;
    startScreenY: number;
    startX: number;
    startZ: number;
  } | null>(null);
  const [isDraggingObject, setIsDraggingObject] = useState(false);
  const { gl, camera, size } = useThree();

  useEffect(() => {
    gl.shadowMap.enabled = true;
  }, [gl]);

  useEffect(() => {
    if (applicationMode === "operations") {
      camera.position.set(38, 56, 38);
      camera.lookAt(0, 0, 0);
      orbitControlsRef.current?.target.set(0, 0, 0);
      orbitControlsRef.current?.update();
      return;
    }

    camera.position.set(0, 68, 0);
    camera.lookAt(0, 0, 0);
    orbitControlsRef.current?.target.set(0, 0, 0);
    orbitControlsRef.current?.update();
  }, [applicationMode, camera]);

  const isDesignMove = applicationMode === "design" && activeTransformMode === "move";

  const startDirectMove = (objectId: string, screenX: number, screenY: number) => {
    const object = objects.find((item) => item.id === objectId);

    if (!object) {
      return;
    }

    dragStateRef.current = {
      objectId,
      startScreenX: screenX,
      startScreenY: screenY,
      startX: object.position.x,
      startZ: object.position.z,
    };
    setIsDraggingObject(true);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }
  };

  const moveDirectObject = (screenX: number, screenY: number) => {
    const dragState = dragStateRef.current;

    if (!dragState) {
      return;
    }

    const worldPerPixel =
      camera instanceof PerspectiveCamera
        ? (2 * camera.position.y * Math.tan((camera.fov * Math.PI) / 360)) / size.height
        : 0.05;

    updateObjectPlacement(
      dragState.objectId,
      dragState.startX + (screenX - dragState.startScreenX) * worldPerPixel,
      dragState.startZ + (screenY - dragState.startScreenY) * worldPerPixel,
      objects.find((item) => item.id === dragState.objectId)?.rotation.y ?? 0,
    );
  };

  const finishDirectMove = () => {
    dragStateRef.current = null;
    setIsDraggingObject(false);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true;
    }
  };

  useEffect(() => {
    if (!isDesignMove || !selectedObjectId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.matches("input, select, textarea")) {
        return;
      }

      const object = objects.find((item) => item.id === selectedObjectId);

      if (!object) {
        return;
      }

      const step = event.shiftKey ? 1 : 0.35;
      const offsets: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      const offset = offsets[event.key];

      if (!offset) {
        return;
      }

      event.preventDefault();
      updateObjectPlacement(
        selectedObjectId,
        object.position.x + offset[0],
        object.position.z + offset[1],
        object.rotation.y,
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDesignMove, objects, selectedObjectId, updateObjectPlacement]);

  return (
    <>
      <color attach="background" args={["#eef3f6"]} />
      <ambientLight intensity={1.1} />
      <directionalLight
        castShadow
        intensity={1.5}
        position={[12, 18, 8]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight intensity={0.6} color="#ffffff" groundColor="#cbd5e1" />
      <FactoryFloor />
      <gridHelper args={[64, 64, "#94a3b8", "#cbd5e1"]} position={[0, 0.001, 0]} />

      {objects.map((object) => (
        <FactoryObject3D
          key={object.id}
          object={object}
          selected={object.id === selectedObjectId}
          onSelect={() => selectObject(object.id)}
          onContextMenu={(x, y) => {
            selectObject(object.id);
            if (applicationMode === "design") {
              onObjectContextMenu(object.id, x, y);
            }
          }}
          isDirectMoveEnabled={isDesignMove && object.id === selectedObjectId}
          onMoveStart={(x, z) => startDirectMove(object.id, x, z)}
          onMove={moveDirectObject}
          onMoveEnd={finishDirectMove}
          onRefChange={() => undefined}
        />
      ))}

      {activities[0]?.transfer && <MaterialTransfer key={activities[0].id} activity={activities[0]} />}

      <OrbitControls
        ref={orbitControlsRef}
        makeDefault
        enabled={!isDraggingObject}
        enableRotate={applicationMode === "operations"}
        enableZoom
        enablePan
        screenSpacePanning
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={applicationMode === "design" ? 0.01 : Math.PI / 4}
        minPolarAngle={applicationMode === "design" ? 0.01 : 0}
        minDistance={8}
        maxDistance={90}
        target={[0, 0, 0]}
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.PAN,
        }}
      />
    </>
  );
}
