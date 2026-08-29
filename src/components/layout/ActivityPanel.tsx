import { useEffect } from "react";
import { useFactoryStore } from "../../store/factoryStore";

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

interface ActivityPanelProps {
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export function ActivityPanel({ isMobile, isOpen, onToggle }: ActivityPanelProps) {
  const activities = useFactoryStore((state) => state.activities);
  const selectedActivityId = useFactoryStore((state) => state.selectedActivityId);
  const objects = useFactoryStore((state) => state.objects);
  const openActivityDetail = useFactoryStore((state) => state.openActivityDetail);
  const closeActivityDetail = useFactoryStore((state) => state.closeActivityDetail);
  const selectedActivity = activities.find((activity) => activity.id === selectedActivityId) ?? null;

  useEffect(() => {
    if (!selectedActivity) {
      return;
    }

    const timeoutId = window.setTimeout(closeActivityDetail, 5000);
    return () => window.clearTimeout(timeoutId);
  }, [closeActivityDetail, selectedActivity]);

  return (
    <aside className={`panel activity-panel${isOpen ? "" : " is-collapsed"}${isMobile && !isOpen ? " is-mobile-hidden" : ""}`}>
      <div className="panel-header activity-header">
        <div>
          <h2>Operasyon Aktivitesi</h2>
          <p>Ritim canlı simülasyon</p>
        </div>
        {!isMobile && <button className="panel-toggle" onClick={onToggle} type="button">
          {isOpen ? "Gizle" : "Aç"}
        </button>}
      </div>

      {isOpen && (
        <>
          <div className="connection-list">
            <span>Ritim CNC</span>
            <span>Ritim Kalite</span>
            <span>Ritim Stok</span>
            <span>Ritim İş Gücü</span>
          </div>
          <div className="activity-list">
            {activities.length === 0 ? (
              <div className="empty-state activity-empty">
                <strong>Aktivite bekleniyor</strong>
                <span>İlk simülasyon olayı kısa süre içinde gelecektir.</span>
              </div>
            ) : (
              activities.map((activity) => {
                const object = objects.find((item) => item.id === activity.objectId);

                return (
                  <button
                    key={activity.id}
                    className={`activity-item activity-${activity.tone}`}
                    onClick={() => openActivityDetail(activity.id)}
                    type="button"
                  >
                    <div className="activity-meta">
                      <span>{activity.source}</span>
                      <time>{formatTime(activity.createdAt)}</time>
                    </div>
                    <strong>{object?.name ?? "Fabrika nesnesi"}</strong>
                    <p>{activity.message}</p>
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
      {selectedActivity && (
        <div className="activity-detail-backdrop" onClick={closeActivityDetail}>
          <section
            className={`activity-detail activity-${selectedActivity.tone}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="activity-detail-header">
              <span>{selectedActivity.source}</span>
              <button onClick={closeActivityDetail} type="button">Kapat</button>
            </div>
            <h2>{objects.find((item) => item.id === selectedActivity.objectId)?.name ?? "Fabrika nesnesi"}</h2>
            <p>{selectedActivity.message}</p>
            <time>{formatTime(selectedActivity.createdAt)} · Simüle edilmiş operasyon bildirimi</time>
            <small>Bu detay 5 saniye içinde otomatik kapanır.</small>
          </section>
        </div>
      )}
    </aside>
  );
}
