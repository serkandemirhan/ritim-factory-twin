import { FactoryCanvas } from "../components/factory/FactoryCanvas";
import { useEffect, useRef, useState } from "react";
import { ActivityPanel } from "../components/layout/ActivityPanel";
import { SceneContextMenu } from "../components/layout/SceneContextMenu";
import { ObjectLibrary } from "../components/layout/ObjectLibrary";
import { PropertiesPanel } from "../components/layout/PropertiesPanel";
import { TopBar } from "../components/layout/TopBar";
import { useFactoryStore } from "../store/factoryStore";

export function App() {
  const viewportRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    objectId: string;
    x: number;
    y: number;
  } | null>(null);
  const applicationMode = useFactoryStore((state) => state.applicationMode);
  const activeTransformMode = useFactoryStore((state) => state.activeTransformMode);
  const lastSavedAt = useFactoryStore((state) => state.lastSavedAt);
  const addObjectFromLibrary = useFactoryStore((state) => state.addObjectFromLibrary);
  const loadLayout = useFactoryStore((state) => state.loadLayout);
  const resetDemoLayout = useFactoryStore((state) => state.resetDemoLayout);
  const saveLayout = useFactoryStore((state) => state.saveLayout);
  const setApplicationMode = useFactoryStore((state) => state.setApplicationMode);
  const setTransformMode = useFactoryStore((state) => state.setTransformMode);
  const generateActivity = useFactoryStore((state) => state.generateActivity);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobileState = () => {
      setIsMobile(mediaQuery.matches);
      setIsActivityOpen(!mediaQuery.matches);
    };

    updateMobileState();
    mediaQuery.addEventListener("change", updateMobileState);
    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, []);

  useEffect(() => {
    if (isMobile && applicationMode !== "operations") {
      setApplicationMode("operations");
    }
  }, [applicationMode, isMobile, setApplicationMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === viewportRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (applicationMode !== "operations") {
      return;
    }

    generateActivity();
    const intervalId = window.setInterval(generateActivity, 5000);
    return () => window.clearInterval(intervalId);
  }, [applicationMode, generateActivity]);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await viewportRef.current?.requestFullscreen();
  };

  return (
    <div className="app-shell">
      <TopBar
        applicationMode={applicationMode}
        activeTransformMode={activeTransformMode}
        onApplicationModeChange={setApplicationMode}
        onTransformModeChange={setTransformMode}
        onSave={saveLayout}
        onLoad={loadLayout}
        onReset={resetDemoLayout}
        lastSavedAt={lastSavedAt}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isLibraryOpen={isLibraryOpen}
        onLibraryToggle={() => setIsLibraryOpen((open) => !open)}
        isMobileOperationsOnly={isMobile}
        isActivityOpen={isActivityOpen}
        onActivityToggle={() => setIsActivityOpen((open) => !open)}
      />

      <main
        className={
          !isMobile && applicationMode === "design" && isLibraryOpen
            ? "workspace"
            : "workspace is-library-closed"
        }
      >
        {!isMobile && applicationMode === "design" && isLibraryOpen && (
          <ObjectLibrary onAddObject={addObjectFromLibrary} onClose={() => setIsLibraryOpen(false)} />
        )}

        <section ref={viewportRef} className="viewport-panel">
          <FactoryCanvas
            onObjectContextMenu={(objectId, x, y) => setContextMenu({ objectId, x, y })}
            onDismissContextMenu={() => setContextMenu(null)}
          />
        </section>

        {applicationMode === "operations" ? (
          <ActivityPanel
            isMobile={isMobile}
            isOpen={isActivityOpen}
            onToggle={() => setIsActivityOpen((open) => !open)}
          />
        ) : <PropertiesPanel />}
      </main>
      {contextMenu && (
        <SceneContextMenu
          objectId={contextMenu.objectId}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          onOpenProperties={() => setApplicationMode("design")}
        />
      )}
    </div>
  );
}
