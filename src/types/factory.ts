export type AssetType =
  | "MACHINE"
  | "QUALITY_STATION"
  | "RACK"
  | "PALLET"
  | "BIN"
  | "AGV"
  | "FORKLIFT"
  | "CAMERA"
  | "INFRASTRUCTURE";

export type ObjectCategory =
  | "Machines"
  | "Quality"
  | "Inventory"
  | "Logistics"
  | "Infrastructure";

export type TransformMode = "select" | "move" | "rotate";
export type ApplicationMode = "design" | "operations";

export interface Vector3State {
  x: number;
  y: number;
  z: number;
}

export interface LibraryObjectDefinition {
  id: string;
  name: string;
  category: ObjectCategory;
  assetType: AssetType;
  modelKey: string;
  defaultScale: [number, number, number];
}

export interface FactoryObject {
  id: string;
  libraryObjectId: string;
  name: string;
  assetType: AssetType;
  position: Vector3State;
  rotation: Vector3State;
  scale: Vector3State;
  ritimAssetId?: string;
  metadata?: Record<string, unknown>;
}

export interface FactoryLayoutSnapshot {
  version: 1;
  savedAt: string;
  objects: FactoryObject[];
}

export type ActivitySource =
  | "Ritim CNC"
  | "Ritim Quality"
  | "Ritim Inventory"
  | "Ritim Workforce";
export type ActivityTone = "info" | "success" | "warning";
export type MachineStatus = "running" | "stopped" | "alarm";

export interface FactoryActivity {
  id: string;
  objectId: string;
  source: ActivitySource;
  message: string;
  tone: ActivityTone;
  createdAt: string;
  machineStatus?: MachineStatus;
  transfer?: {
    from: Vector3State;
    to: Vector3State;
    waypoints: Vector3State[];
  };
}
