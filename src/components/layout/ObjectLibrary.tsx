import { objectCategories, objectLibrary } from "../../data/objectLibrary";

interface ObjectLibraryProps {
  onAddObject: (libraryObjectId: string) => void;
  onClose: () => void;
}

export function ObjectLibrary({ onAddObject, onClose }: ObjectLibraryProps) {
  return (
    <aside className="panel library-panel">
      <div className="panel-header library-header">
        <div>
          <h2>Nesne Kütüphanesi</h2>
          <p>Hazır Ritim yerleşim bileşenleri</p>
        </div>
        <button className="panel-toggle" onClick={onClose} type="button">Kapat</button>
      </div>

      <div className="library-groups">
        {objectCategories.map((category) => (
          <section key={category} className="library-group">
            <h3>{category}</h3>
            <div className="library-items">
              {objectLibrary
                .filter((item) => item.category === category)
                .map((item) => (
                  <button
                    key={item.id}
                    className="library-item"
                    onClick={() => onAddObject(item.id)}
                    type="button"
                  >
                    <span>{item.name}</span>
                    <small>{item.assetType.replaceAll("_", " ")}</small>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
