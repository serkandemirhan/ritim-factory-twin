import { objectLibrary } from "./objectLibrary";
import type { FactoryObject } from "../types/factory";
import { createId } from "../utils/ids";

function lib(id: string) {
  const definition = objectLibrary.find((item) => item.id === id);

  if (!definition) {
    throw new Error(`Missing library definition: ${id}`);
  }

  return definition;
}

function createDemoObject(
  libraryObjectId: string,
  name: string,
  x: number,
  z: number,
  rotationY = 0,
): FactoryObject {
  const definition = lib(libraryObjectId);

  return {
    id: createId("factory-object"),
    libraryObjectId: definition.id,
    name,
    assetType: definition.assetType,
    position: { x, y: 0, z },
    rotation: { x: 0, y: rotationY, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  };
}

function createCncCell(index: number, x: number, z: number): FactoryObject[] {
  const code = index.toString().padStart(2, "0");

  return [
    createDemoObject("vertical-cnc", `CNC-${code}`, x, z),
    createDemoObject("pallet", `CNC-${code} Input Pallet`, x - 0.95, z + 2.65),
    createDemoObject("pallet", `CNC-${code} Output Pallet`, x + 0.95, z + 2.65),
    createDemoObject("operator", `Operator CNC-${code}`, x + 3.45, z, -Math.PI / 2),
  ];
}

export function createDemoLayout(): FactoryObject[] {
  const cellPositions: Array<[number, number]> = [
    [-16, -13], [-6, -13], [4, -13],
    [-16, -3], [-6, -3], [4, -3],
    [-16, 7], [-6, 7], [4, 7],
  ];
  const cncCells = cellPositions.flatMap(([x, z], index) => createCncCell(index + 1, x, z));
  const rawSections = [-25, -17, -9].flatMap((x, index) => [
    createDemoObject("rack", `Raw Rack-A${index + 1}-01`, x - 1.4, 23),
    createDemoObject("rack", `Raw Rack-A${index + 1}-02`, x + 1.4, 23),
    createDemoObject("operator", `Raw Stock Operator-${index + 1}`, x - 3.5, 23, Math.PI / 2),
  ]);
  const wipSections = [1, 9, 17, 25].flatMap((x, index) => [
    createDemoObject("rack", `WIP Rack-B${index + 1}-01`, x - 1.2, 23),
    createDemoObject("rack", `WIP Rack-B${index + 1}-02`, x + 1.2, 23),
    createDemoObject("operator", `WIP Stock Operator-${index + 1}`, x - 3.1, 23, Math.PI / 2),
  ]);
  const shipmentRows = [-15, -5, 5, 15].flatMap((z, index) => [
    createDemoObject("shipping-dock", `Dock-${index + 1}`, 28, z, Math.PI),
    createDemoObject("delivery-truck", `Truck-${index + 1}`, 37, z, -Math.PI / 2),
    createDemoObject("pallet", `Finished Goods-${index + 1}-A`, 20.5, z - 1, 0),
    createDemoObject("pallet", `Finished Goods-${index + 1}-B`, 20.5, z + 1, 0),
  ]);

  return [
    ...cncCells,
    createDemoObject("cmm", "CMM Quality Lab", 14, 9, 0),
    createDemoObject("operator", "CMM Operator", 14, 11.2, Math.PI),
    ...rawSections,
    ...wipSections,
    createDemoObject("shipping-dock", "Raw Material Inbound Dock", -28, 23, 0),
    createDemoObject("delivery-truck", "Raw Material Truck", -37, 23, Math.PI / 2),
    createDemoObject("pallet", "Raw Inbound Pallet-01", -25.5, 20, 0),
    createDemoObject("pallet", "Raw Inbound Pallet-02", -23, 20, 0),
    createDemoObject("forklift", "Forklift-01", -28, -1, Math.PI / 2),
    createDemoObject("agv", "AGV-01", 14, 16, 0),
    ...shipmentRows,
    createDemoObject("safety-barrier", "Safety Barrier-A", -7, -22, 0),
    createDemoObject("safety-barrier", "Safety Barrier-B", 2, -22, 0),
    createDemoObject("office-desk", "Management Desk-01", -24, -22, 0),
    createDemoObject("office-desk", "Management Desk-02", -18, -22, 0),
    createDemoObject("office-worker", "Office Worker-01", -24, -23.2, 0),
    createDemoObject("office-worker", "Office Worker-02", -22.7, -23.2, 0),
    createDemoObject("office-worker", "Office Worker-03", -18, -23.2, 0),
    createDemoObject("office-worker", "Office Worker-04", -16.7, -23.2, 0),
  ];
}
