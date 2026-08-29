import { objectLibrary } from "../../data/objectLibrary";
import { useFactoryStore } from "../../store/factoryStore";

const assetOptions = ["Not Connected", "CNC-001", "CNC-002", "CNC-003", "QUALITY-001", "RACK-A01"];

function formatNumber(value: number): string {
  return value.toFixed(2);
}

export function PropertiesPanel() {
  const selectedObjectId = useFactoryStore((state) => state.selectedObjectId);
  const selectedObject = useFactoryStore((state) =>
    state.objects.find((item) => item.id === state.selectedObjectId),
  );
  const updateObject = useFactoryStore((state) => state.updateObject);
  const updateObjectPlacement = useFactoryStore((state) => state.updateObjectPlacement);
  const deleteSelectedObject = useFactoryStore((state) => state.deleteSelectedObject);

  if (!selectedObjectId || !selectedObject) {
    return (
      <aside className="panel properties-panel">
        <div className="panel-header">
          <h2>Properties</h2>
          <p>Select an object in the 3D view or library</p>
        </div>
        <div className="empty-state">
          <strong>No object selected</strong>
          <span>Click an item in the scene to inspect and edit it.</span>
        </div>
      </aside>
    );
  }

  const definition = objectLibrary.find((item) => item.id === selectedObject.libraryObjectId);

  if (!definition) {
    return null;
  }

  return (
    <aside className="panel properties-panel">
      <div className="panel-header">
        <h2>Properties</h2>
        <p>Selected Object</p>
      </div>

      <div className="properties-grid">
        <label className="field">
          <span>Name</span>
          <input
            value={selectedObject.name}
            onChange={(event) =>
              updateObject(selectedObjectId, {
                name: event.target.value,
              })
            }
          />
        </label>

        <label className="field">
          <span>Asset Type</span>
          <input value={selectedObject.assetType} disabled />
        </label>

        <label className="field">
          <span>Library Model</span>
          <input value={definition.name} disabled />
        </label>

        <label className="field">
          <span>Position X</span>
          <input
            type="number"
            step="0.1"
            value={formatNumber(selectedObject.position.x)}
            onChange={(event) =>
              updateObjectPlacement(
                selectedObjectId,
                Number(event.target.value),
                selectedObject.position.z,
                selectedObject.rotation.y,
              )
            }
          />
        </label>

        <label className="field">
          <span>Plan Position Y</span>
          <input
            type="number"
            step="0.1"
            value={formatNumber(selectedObject.position.z)}
            onChange={(event) =>
              updateObjectPlacement(
                selectedObjectId,
                selectedObject.position.x,
                Number(event.target.value),
                selectedObject.rotation.y,
              )
            }
          />
        </label>

        <label className="field">
          <span>Rotation Y</span>
          <input
            type="number"
            step="0.05"
            value={formatNumber(selectedObject.rotation.y)}
            onChange={(event) =>
              updateObjectPlacement(
                selectedObjectId,
                selectedObject.position.x,
                selectedObject.position.z,
                Number(event.target.value),
              )
            }
          />
        </label>

        <label className="field">
          <span>Ritim Asset Binding</span>
          <select
            value={selectedObject.ritimAssetId ?? "Not Connected"}
            onChange={(event) =>
              updateObject(selectedObjectId, {
                ritimAssetId:
                  event.target.value === "Not Connected" ? undefined : event.target.value,
              })
            }
          >
            {assetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button className="delete-button" onClick={deleteSelectedObject} type="button">
        Delete Object
      </button>
    </aside>
  );
}
