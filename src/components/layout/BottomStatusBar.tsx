import { useFactoryStore } from "../../store/factoryStore";

export function BottomStatusBar() {
  const objects = useFactoryStore((state) => state.objects);
  const statuses = useFactoryStore((state) => state.machineStatuses);
  const machines = objects.filter((item) => item.assetType === "MACHINE");
  const counts = machines.reduce((result, machine) => { const status = statuses[machine.id] ?? "running"; result[status] += 1; return result; }, { running: 0, stopped: 0, alarm: 0 });
  return <footer className="bottom-status"><strong>{machines.length} Machines</strong><span className="status-running">● {counts.running} Running</span><span className="status-idle">● {counts.stopped} Idle</span><span className="status-alarm">● {counts.alarm} Alarm</span><span>Utilization <b>{machines.length ? 82 : 0}%</b></span></footer>;
}
