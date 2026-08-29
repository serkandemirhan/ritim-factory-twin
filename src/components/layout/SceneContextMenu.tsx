import { useFactoryStore } from "../../store/factoryStore";

interface SceneContextMenuProps {
  objectId: string;
  position: { x: number; y: number };
  onClose: () => void;
  onOpenProperties: () => void;
}

export function SceneContextMenu({
  objectId,
  position,
  onClose,
  onOpenProperties,
}: SceneContextMenuProps) {
  const object = useFactoryStore((state) => state.objects.find((item) => item.id === objectId));
  const updateObject = useFactoryStore((state) => state.updateObject);
  const duplicateObject = useFactoryStore((state) => state.duplicateObject);
  const deleteObject = useFactoryStore((state) => state.deleteObject);

  if (!object) {
    return null;
  }

  const renameObject = () => {
    const name = window.prompt("Object name", object.name)?.trim();

    if (name) {
      updateObject(objectId, { name });
    }

    onClose();
  };

  return (
    <div className="scene-context-menu" style={{ left: position.x, top: position.y }}>
      <div className="context-menu-title">{object.name}</div>
      <button onClick={renameObject} type="button">Rename</button>
      <button
        onClick={() => {
          duplicateObject(objectId);
          onClose();
        }}
        type="button"
      >
        Duplicate
      </button>
      <button
        onClick={() => {
          onOpenProperties();
          onClose();
        }}
        type="button"
      >
        Properties
      </button>
      <button
        className="context-delete"
        onClick={() => {
          deleteObject(objectId);
          onClose();
        }}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}
