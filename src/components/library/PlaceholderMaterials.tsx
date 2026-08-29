import { Color } from "three";

const selectedColor = new Color("#f97316");

export function getBaseColor(color: string, selected: boolean): string {
  if (!selected) {
    return color;
  }

  return `#${selectedColor.getHexString()}`;
}
