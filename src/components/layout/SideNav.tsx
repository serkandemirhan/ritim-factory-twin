const items = ["Factory", "Production", "Machines", "Inventory", "Quality", "Analytics", "Alerts"];

interface SideNavProps { active: string; onChange: (value: string) => void; }

export function SideNav({ active, onChange }: SideNavProps) {
  return <nav className="side-nav" aria-label="Factory navigation">
    {items.map((item, index) => <button key={item} className={active === item ? "nav-item is-active" : "nav-item"} onClick={() => onChange(item)} title={item} type="button">
      <span>{["⌂", "◫", "⚙", "▦", "◉", "⌁", "! "][index]}</span><small>{item}</small>
    </button>)}
  </nav>;
}
