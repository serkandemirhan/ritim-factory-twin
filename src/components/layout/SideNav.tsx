const items = ["Fabrika", "Üretim", "Makineler", "Stok", "Kalite", "Analiz", "Uyarılar"];

interface SideNavProps { active: string; onChange: (value: string) => void; }

export function SideNav({ active, onChange }: SideNavProps) {
  return <nav className="side-nav" aria-label="Fabrika menüsü">
    {items.map((item, index) => <button key={item} className={active === item ? "nav-item is-active" : "nav-item"} onClick={() => onChange(item)} title={item} type="button">
      <span>{["⌂", "◫", "⚙", "▦", "◉", "⌁", "! "][index]}</span><small>{item}</small>
    </button>)}
  </nav>;
}
