import { create } from "zustand";
import { createDemoLayout } from "../data/demoLayout";
import { objectLibrary } from "../data/objectLibrary";
import type {
  ApplicationMode,
  FactoryLayoutSnapshot,
  FactoryObject,
  FactoryActivity,
  MachineStatus,
  TransformMode,
} from "../types/factory";
import { loadLayoutSnapshot, saveLayoutSnapshot } from "../utils/layoutPersistence";
import { createId } from "../utils/ids";

const FLOOR_LIMIT = 36;

function clampToFloor(value: number): number {
  return Math.max(-FLOOR_LIMIT, Math.min(FLOOR_LIMIT, value));
}

function buildSnapshot(objects: FactoryObject[]): FactoryLayoutSnapshot {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    objects,
  };
}

interface FactoryState {
  objects: FactoryObject[];
  selectedObjectId: string | null;
  activeTransformMode: TransformMode;
  applicationMode: ApplicationMode;
  lastSavedAt: string | null;
  activities: FactoryActivity[];
  selectedActivityId: string | null;
  machineStatuses: Record<string, MachineStatus>;
  addObjectFromLibrary: (libraryObjectId: string) => void;
  updateObject: (objectId: string, patch: Partial<FactoryObject>) => void;
  updateObjectPlacement: (objectId: string, x: number, z: number, rotationY: number) => void;
  selectObject: (objectId: string | null) => void;
  deleteSelectedObject: () => void;
  deleteObject: (objectId: string) => void;
  duplicateObject: (objectId: string) => void;
  setTransformMode: (mode: TransformMode) => void;
  setApplicationMode: (mode: ApplicationMode) => void;
  saveLayout: () => void;
  loadLayout: () => boolean;
  resetDemoLayout: () => void;
  generateActivity: () => void;
  openActivityDetail: (activityId: string) => void;
  closeActivityDetail: () => void;
}

export const useFactoryStore = create<FactoryState>((set, get) => ({
  objects: createDemoLayout(),
  selectedObjectId: null,
  activeTransformMode: "move",
  applicationMode: "design",
  lastSavedAt: null,
  activities: [],
  selectedActivityId: null,
  machineStatuses: {},
  addObjectFromLibrary: (libraryObjectId) => {
    const definition = objectLibrary.find((item) => item.id === libraryObjectId);

    if (!definition) {
      return;
    }

    const objects = get().objects;
    const count = objects.filter((item) => item.libraryObjectId === definition.id).length + 1;
    const name = `${definition.name} ${count.toString().padStart(2, "0")}`;
    const spreadIndex = objects.length % 5;
    const offsetX = -2 + spreadIndex * 2;
    const offsetZ = -1 + (objects.length % 3) * 1.6;

    const nextObject: FactoryObject = {
      id: createId("factory-object"),
      libraryObjectId: definition.id,
      name,
      assetType: definition.assetType,
      position: { x: offsetX, y: 0, z: offsetZ },
      rotation: { x: 0, y: 0, z: 0 },
      scale: {
        x: definition.defaultScale[0],
        y: definition.defaultScale[1],
        z: definition.defaultScale[2],
      },
    };

    set({
      objects: [...objects, nextObject],
      selectedObjectId: nextObject.id,
      activeTransformMode: "move",
    });
  },
  updateObject: (objectId, patch) =>
    set((state) => ({
      objects: state.objects.map((item) => {
        if (item.id !== objectId) {
          return item;
        }

        return {
          ...item,
          ...patch,
        };
      }),
    })),
  updateObjectPlacement: (objectId, x, z, rotationY) =>
    set((state) => ({
      objects: state.objects.map((item) => {
        if (item.id !== objectId) {
          return item;
        }

        return {
          ...item,
          position: {
            ...item.position,
            x: clampToFloor(x),
            y: 0,
            z: clampToFloor(z),
          },
          rotation: {
            x: 0,
            y: rotationY,
            z: 0,
          },
        };
      }),
    })),
  selectObject: (objectId) => set({ selectedObjectId: objectId }),
  deleteSelectedObject: () =>
    set((state) => {
      if (!state.selectedObjectId) {
        return state;
      }

      return {
        objects: state.objects.filter((item) => item.id !== state.selectedObjectId),
        selectedObjectId: null,
      };
    }),
  deleteObject: (objectId) =>
    set((state) => ({
      objects: state.objects.filter((item) => item.id !== objectId),
      selectedObjectId: state.selectedObjectId === objectId ? null : state.selectedObjectId,
    })),
  duplicateObject: (objectId) => {
    const source = get().objects.find((item) => item.id === objectId);

    if (!source) {
      return;
    }

    const copy: FactoryObject = {
      ...source,
      id: createId("factory-object"),
      name: `${source.name} Copy`,
      position: {
        ...source.position,
        x: clampToFloor(source.position.x + 1.2),
        z: clampToFloor(source.position.z + 1.2),
      },
    };

    set((state) => ({
      objects: [...state.objects, copy],
      selectedObjectId: copy.id,
      activeTransformMode: "move",
    }));
  },
  setTransformMode: (mode) => set({ activeTransformMode: mode }),
  setApplicationMode: (mode) =>
    set((state) => ({
      applicationMode: mode,
      activeTransformMode:
        mode === "design" && state.activeTransformMode === "rotate"
          ? "move"
          : state.activeTransformMode,
    })),
  saveLayout: () => {
    const snapshot = buildSnapshot(get().objects);
    saveLayoutSnapshot(snapshot);
    set({ lastSavedAt: snapshot.savedAt });
  },
  loadLayout: () => {
    const snapshot = loadLayoutSnapshot();

    if (!snapshot) {
      return false;
    }

    set({
      objects: snapshot.objects,
      selectedObjectId: snapshot.objects[0]?.id ?? null,
      lastSavedAt: snapshot.savedAt,
    });

    return true;
  },
  resetDemoLayout: () =>
    set({
      objects: createDemoLayout(),
      selectedObjectId: null,
      activeTransformMode: "move",
    }),
  generateActivity: () => {
    const eligibleObjects = get().objects.filter((object) =>
      ["MACHINE", "QUALITY_STATION", "RACK", "PALLET", "BIN"].includes(object.assetType) ||
      object.libraryObjectId === "operator",
    );

    if (eligibleObjects.length === 0) {
      return;
    }

    const machineObjects = eligibleObjects.filter((object) => object.assetType === "MACHINE");
    const selectionPool = machineObjects.length > 0 && Math.random() < 0.55 ? machineObjects : eligibleObjects;
    const object = selectionPool[Math.floor(Math.random() * selectionPool.length)];
    const machineMessages = [
      "Cycle completed. Part moved to WIP queue.",
      "New job started. Estimated cycle: 04:20.",
      "Tool life updated after completed batch.",
    ];
    const qualityMessages = [
      "Inspection passed. Measurement record synced.",
      "First article measurement is in progress.",
      "Quality result approved for next operation.",
    ];
    const inventoryMessages = [
      "Material moved to the next production stage.",
      "Stock quantity updated after pallet scan.",
      "Material reservation confirmed for work order.",
    ];
    const isMachine = object.assetType === "MACHINE";
    const isQuality = object.assetType === "QUALITY_STATION";
    const isOperator = object.libraryObjectId === "operator";
    const operatorMessages = [
      "Operator checked in to the assigned work cell.",
      "Material handling task was acknowledged.",
      "Work instruction confirmation received.",
    ];
    const messages = isMachine
      ? machineMessages
      : isQuality
        ? qualityMessages
        : isOperator
          ? operatorMessages
          : inventoryMessages;
    const source = isMachine
      ? "Ritim CNC"
      : isQuality
        ? "Ritim Quality"
        : isOperator
          ? "Ritim Workforce"
          : "Ritim Inventory";
    const tone = Math.random() > 0.82 ? "warning" : Math.random() > 0.35 ? "success" : "info";
    const machineStatus: MachineStatus | undefined = isMachine
      ? tone === "warning"
        ? "alarm"
        : tone === "success"
          ? "running"
          : "stopped"
      : undefined;
    const activity: FactoryActivity = {
      id: createId("activity"),
      objectId: object.id,
      source,
      message: messages[Math.floor(Math.random() * messages.length)],
      tone,
      createdAt: new Date().toISOString(),
      machineStatus,
    };

    const layoutObjects = get().objects;
    const objectName = object.name.toLowerCase();

    if (isMachine) {
      const wipRacks = get().objects.filter(
        (item) => item.libraryObjectId === "rack" && item.name.toLowerCase().includes("wip"),
      );
      const destination = wipRacks[Math.floor(Math.random() * wipRacks.length)];

      if (destination) {
        activity.message = "Finished material is being transferred to the WIP rack.";
        activity.transfer = {
          from: { x: object.position.x + 2.3, y: 0, z: object.position.z + 0.8 },
          to: { x: destination.position.x, y: 0, z: destination.position.z - 1.6 },
          // Keep transfers on the logistics corridors instead of cutting through work cells.
          waypoints: [
            { x: object.position.x + 2.3, y: 0, z: -27 },
            { x: 28, y: 0, z: -27 },
            { x: 28, y: 0, z: 23 },
            { x: destination.position.x, y: 0, z: 23 },
          ],
        };
      }
    } else if (isQuality) {
      const rawRacks = layoutObjects.filter(
        (item) => item.libraryObjectId === "rack" && item.name.toLowerCase().includes("raw"),
      );
      const destination = rawRacks[Math.floor(Math.random() * rawRacks.length)];

      if (destination) {
        activity.message = "Quality hold material is being returned to raw material storage.";
        activity.transfer = {
          from: { x: object.position.x, y: 0, z: object.position.z + 1.5 },
          to: { x: destination.position.x, y: 0, z: destination.position.z - 1.6 },
          waypoints: [
            { x: object.position.x, y: 0, z: 23 },
            { x: destination.position.x, y: 0, z: 23 },
          ],
        };
      }
    } else if (objectName.includes("raw")) {
      const machineInputs = layoutObjects.filter((item) => item.name.toLowerCase().includes("input pallet"));
      const destination = machineInputs[Math.floor(Math.random() * machineInputs.length)];

      if (destination) {
        activity.message = "Raw material is being delivered to the CNC input pallet.";
        activity.transfer = {
          from: { x: object.position.x, y: 0, z: object.position.z - 1.5 },
          to: { x: destination.position.x, y: 0, z: destination.position.z },
          waypoints: [
            { x: object.position.x, y: 0, z: 23 },
            { x: destination.position.x, y: 0, z: 23 },
          ],
        };
      }
    } else if (objectName.includes("finished goods")) {
      const docks = layoutObjects.filter((item) => item.libraryObjectId === "shipping-dock" && item.name.startsWith("Dock-"));
      const destination = docks[Math.floor(Math.random() * docks.length)];

      if (destination) {
        activity.message = "Finished goods are moving from storage to the shipping dock.";
        activity.transfer = {
          from: { x: object.position.x, y: 0, z: object.position.z },
          to: { x: destination.position.x - 2, y: 0, z: destination.position.z },
          waypoints: [
            { x: 28, y: 0, z: object.position.z },
            { x: 32, y: 0, z: destination.position.z },
          ],
        };
      }
    }

    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 24),
      machineStatuses: machineStatus
        ? { ...state.machineStatuses, [object.id]: machineStatus }
        : state.machineStatuses,
    }));
  },
  openActivityDetail: (activityId) => set({ selectedActivityId: activityId }),
  closeActivityDetail: () => set({ selectedActivityId: null }),
}));
