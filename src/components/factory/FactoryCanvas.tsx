import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useFactoryStore } from "../../store/factoryStore";
import { FactoryScene } from "./FactoryScene";

interface FactoryCanvasProps {
  onObjectContextMenu: (objectId: string, x: number, y: number) => void;
  onDismissContextMenu: () => void;
}

export function FactoryCanvas({ onObjectContextMenu, onDismissContextMenu }: FactoryCanvasProps) {
  const clearSelection = useFactoryStore((state) => state.selectObject);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobileState = () => setIsMobile(mediaQuery.matches);

    updateMobileState();
    mediaQuery.addEventListener("change", updateMobileState);
    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, []);

  return (
    <div className="factory-canvas" onContextMenu={(event) => event.preventDefault()}>
      <Canvas
        camera={{ position: [0, 88, 0], fov: 42, near: 0.1, far: 180 }}
        shadows={!isMobile}
        dpr={[1, isMobile ? 1.25 : 2]}
        onPointerMissed={() => {
          clearSelection(null);
          onDismissContextMenu();
        }}
      >
        <Suspense fallback={null}>
          <FactoryScene onObjectContextMenu={onObjectContextMenu} />
        </Suspense>
      </Canvas>
    </div>
  );
}
