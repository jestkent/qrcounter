export default function Header({ view, onNavigate }) {
  const isActive = (v) =>
    v === view || (v === 'list' && view === 'detail') ? 'nav-btn active' : 'nav-btn'

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">Q</div>
        <span className="logo-text">QR Counter</span>
      </div>
      <nav className="nav">
        <button className={isActive('list')} onClick={() => onNavigate('list')}>
          Events
        </button>
        <button className={isActive('create')} onClick={() => onNavigate('create')}>
          Create
        </button>
        <button className={isActive('scan')} onClick={() => onNavigate('scan')}>
          Scan
        </button>
      </nav>
    </header>
  )
}
