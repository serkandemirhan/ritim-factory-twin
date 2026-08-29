import { useFactoryStore } from "../../store/factoryStore";

export function MachineInspector() {
  const selectedId = useFactoryStore((state) => state.selectedObjectId);
  const object = useFactoryStore((state) => state.objects.find((item) => item.id === state.selectedObjectId));
  const status = useFactoryStore((state) => selectedId ? state.machineStatuses[selectedId] ?? "running" : "running");
  const select = useFactoryStore((state) => state.selectObject);
  if (!object || object.assetType !== "MACHINE") return <aside className="machine-inspector panel is-empty"><div className="inspector-kicker">MACHINE INSPECTOR</div><h2>No machine selected</h2><p>Select a CNC machine in the 3D factory to view live operating data.</p></aside>;
  const stateLabel = status === "stopped" ? "IDLE" : status.toUpperCase();
  return <aside className="machine-inspector panel"><div className="inspector-top"><div><div className="inspector-kicker">MACHINE INSPECTOR</div><h2>{object.name}</h2><span className={`machine-state ${status}`}>● {stateLabel}</span></div><button onClick={() => select(null)} type="button">×</button></div><div className="inspector-tabs"><b>Overview</b><span>Production</span><span>Quality</span><span>History</span></div><dl className="machine-metrics"><div><dt>Utilization</dt><dd>87%</dd></div><div><dt>Current program</dt><dd>O1234</dd></div><div><dt>Work order</dt><dd>WO-2026-1842</dd></div><div><dt>Part</dt><dd>Housing A12</dd></div><div><dt>Production</dt><dd>42 / 50</dd></div><div><dt>Cycle time</dt><dd>21:42</dd></div></dl><p className="last-update">Last update: live simulation</p></aside>;
}
