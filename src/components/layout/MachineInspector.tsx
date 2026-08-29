import { useState } from "react";
import { useFactoryStore } from "../../store/factoryStore";

export function MachineInspector() {
  const [activeTab, setActiveTab] = useState<"stok" | "kalite">("stok");
  const selectedId = useFactoryStore((state) => state.selectedObjectId);
  const object = useFactoryStore((state) => state.objects.find((item) => item.id === state.selectedObjectId));
  const status = useFactoryStore((state) => selectedId ? state.machineStatuses[selectedId] ?? "running" : "running");
  const select = useFactoryStore((state) => state.selectObject);
  const isPallet = object?.libraryObjectId === "pallet";
  if (!object || (object.assetType !== "MACHINE" && !isPallet)) return <aside className="machine-inspector panel is-empty"><div className="inspector-kicker">İNCELEME</div><h2>Nesne seçilmedi</h2><p>Canlı çalışma verilerini görmek için 3B fabrikada bir CNC makinesi veya stok paleti seçin.</p></aside>;
  if (isPallet) {
    const isInput = /girdi|input|hammadde|raw/i.test(object.name);
    const material = isInput ? "Alüminyum Blok 6082" : "İşlenmiş Gövde A12";
    const quantity = isInput ? 18 : 12;
    const qualityChecked = isInput ? 14 : 12;
    const qualityPending = quantity - qualityChecked;
    const measuredAt = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(Date.now() - 3 * 60 * 60 * 1000));
    return <aside className="machine-inspector panel"><div className="inspector-top"><div><div className="inspector-kicker">STOK KONUMU</div><h2>{object.name}</h2><span className="machine-state running">● STOKTA</span></div><button onClick={() => select(null)} type="button">×</button></div><div className="inspector-tabs"><button className={activeTab === "stok" ? "is-active" : ""} onClick={() => setActiveTab("stok")} type="button">Stok Detayı</button><button className={activeTab === "kalite" ? "is-active" : ""} onClick={() => setActiveTab("kalite")} type="button">Kalite</button></div>{activeTab === "stok" ? <dl className="machine-metrics"><div><dt>Malzeme</dt><dd>{material}</dd></div><div><dt>Palet tipi</dt><dd>{isInput ? "Makine girdi paleti" : "Makine çıktı paleti"}</dd></div><div><dt>Mevcut miktar</dt><dd>{quantity} adet</dd></div><div><dt>Kapasite</dt><dd>24 adet</dd></div><div><dt>Doluluk</dt><dd>{Math.round((quantity / 24) * 100)}%</dd></div><div><dt>Son ölçüm</dt><dd>{measuredAt}</dd></div><div><dt>Ölçüm sonucu</dt><dd>UYGUN</dd></div><div><dt>Son hareket</dt><dd>2 dk önce</dd></div></dl> : <dl className="machine-metrics"><div><dt>Ölçülen numune</dt><dd>2 adet</dd></div><div><dt>Kalite kontrolü tamamlanan</dt><dd>{qualityChecked} adet</dd></div><div><dt>Kalite kontrolü bekleyen</dt><dd>{qualityPending} adet</dd></div><div><dt>Reddedilen</dt><dd>0 adet</dd></div><div><dt>Sonuç</dt><dd>UYGUN</dd></div></dl>}<p className="last-update">Stok bilgisi: Ritim Stok ve Kalite simülasyonu</p></aside>;
  }
  const stateLabel = status === "stopped" ? "BOŞTA" : status === "running" ? "ÇALIŞIYOR" : "ALARM";
  return <aside className="machine-inspector panel"><div className="inspector-top"><div><div className="inspector-kicker">MAKİNE İNCELEME</div><h2>{object.name}</h2><span className={`machine-state ${status}`}>● {stateLabel}</span></div><button onClick={() => select(null)} type="button">×</button></div><div className="inspector-tabs"><b>Genel Bakış</b><span>Üretim</span><span>Kalite</span><span>Geçmiş</span></div><dl className="machine-metrics"><div><dt>Kullanım</dt><dd>87%</dd></div><div><dt>Mevcut program</dt><dd>O1234</dd></div><div><dt>İş emri</dt><dd>WO-2026-1842</dd></div><div><dt>Parça</dt><dd>Gövde A12</dd></div><div><dt>Üretim</dt><dd>42 / 50</dd></div><div><dt>Çevrim süresi</dt><dd>21:42</dd></div></dl><p className="last-update">Son güncelleme: canlı simülasyon</p></aside>;
}
