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
    [-24, -18], [-12, -18], [0, -18], [12, -18], [24, -18],
    [-24, -6], [-12, -6], [0, -6], [12, -6], [24, -6],
    [-24, 6], [-12, 6], [0, 6], [12, 6], [24, 6],
    [-12, 18], [0, 18],
  ];
  const cncCells = cellPositions.flatMap(([x, z], index) => createCncCell(index + 1, x, z));
  const rawSections = [-30, -19, -8].flatMap((x, index) => [
    createDemoObject("rack", `Raw Rack-A${index + 1}-01`, x - 2, 29),
    createDemoObject("rack", `Raw Rack-A${index + 1}-02`, x + 2, 29),
    createDemoObject("operator", `Raw Stock Operator-${index + 1}`, x - 4.8, 29, Math.PI / 2),
  ]);
  const wipSections = [5, 14, 23, 32].flatMap((x, index) => [
    createDemoObject("rack", `WIP Rack-B${index + 1}-01`, x - 1.7, 29),
    createDemoObject("rack", `WIP Rack-B${index + 1}-02`, x + 1.7, 29),
    createDemoObject("operator", `WIP Stock Operator-${index + 1}`, x - 4.2, 29, Math.PI / 2),
  ]);
  const shipmentRows = [-20, -9, 2, 13].flatMap((z, index) => [
    createDemoObject("shipping-dock", `Dock-${index + 1}`, 35, z, Math.PI),
    createDemoObject("delivery-truck", `Truck-${index + 1}`, 45, z, -Math.PI / 2),
    createDemoObject("pallet", `Finished Goods-${index + 1}-A`, 25.5, z - 1, 0),
    createDemoObject("pallet", `Finished Goods-${index + 1}-B`, 25.5, z + 1, 0),
  ]);

  return [
    ...cncCells,
    createDemoObject("cmm", "CMM Quality Lab", 22, 18, 0),
    createDemoObject("operator", "CMM Operator", 22, 20.2, Math.PI),
    ...rawSections,
    ...wipSections,
    createDemoObject("shipping-dock", "Raw Material Inbound Dock", -35, 29, 0),
    createDemoObject("delivery-truck", "Raw Material Truck", -45, 29, Math.PI / 2),
    createDemoObject("pallet", "Raw Inbound Pallet-01", -31.5, 26, 0),
    createDemoObject("pallet", "Raw Inbound Pallet-02", -29, 26, 0),
    createDemoObject("forklift", "Forklift-01", -34, -1, Math.PI / 2),
    createDemoObject("agv", "AGV-01", 18, 23, 0),
    ...shipmentRows,
    createDemoObject("safety-barrier", "Safety Barrier-A", -8, -29, 0),
    createDemoObject("safety-barrier", "Safety Barrier-B", 2, -29, 0),
    createDemoObject("office-desk", "Management Desk-01", -31, -28, 0),
    createDemoObject("office-desk", "Management Desk-02", -24.5, -28, 0),
    createDemoObject("office-worker", "Office Worker-01", -31, -29.2, 0),
    createDemoObject("office-worker", "Office Worker-02", -29.7, -29.2, 0),
    createDemoObject("office-worker", "Office Worker-03", -24.5, -29.2, 0),
    createDemoObject("office-worker", "Office Worker-04", -23.2, -29.2, 0),
  ];
}
