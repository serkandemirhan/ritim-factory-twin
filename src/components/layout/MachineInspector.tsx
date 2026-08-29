import { useFactoryStore } from "../../store/factoryStore";

export function MachineInspector() {
  const selectedId = useFactoryStore((state) => state.selectedObjectId);
  const object = useFactoryStore((state) => state.objects.find((item) => item.id === state.selectedObjectId));
  const status = useFactoryStore((state) => selectedId ? state.machineStatuses[selectedId] ?? "running" : "running");
  const select = useFactoryStore((state) => state.selectObject);
  if (!object || object.assetType !== "MACHINE") return <aside className="machine-inspector panel is-empty"><div className="inspector-kicker">MAKİNE İNCELEME</div><h2>Makine seçilmedi</h2><p>Canlı çalışma verilerini görmek için 3B fabrikada bir CNC makinesi seçin.</p></aside>;
  const stateLabel = status === "stopped" ? "BOŞTA" : status === "running" ? "ÇALIŞIYOR" : "ALARM";
  return <aside className="machine-inspector panel"><div className="inspector-top"><div><div className="inspector-kicker">MAKİNE İNCELEME</div><h2>{object.name}</h2><span className={`machine-state ${status}`}>● {stateLabel}</span></div><button onClick={() => select(null)} type="button">×</button></div><div className="inspector-tabs"><b>Genel Bakış</b><span>Üretim</span><span>Kalite</span><span>Geçmiş</span></div><dl className="machine-metrics"><div><dt>Kullanım</dt><dd>87%</dd></div><div><dt>Mevcut program</dt><dd>O1234</dd></div><div><dt>İş emri</dt><dd>WO-2026-1842</dd></div><div><dt>Parça</dt><dd>Gövde A12</dd></div><div><dt>Üretim</dt><dd>42 / 50</dd></div><div><dt>Çevrim süresi</dt><dd>21:42</dd></div></dl><p className="last-update">Son güncelleme: canlı simülasyon</p></aside>;
}
