// Navigation with enhanced hover states
export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="logo">
          <span className="logo-text">SJ</span>
          <div className="logo-dot" />
        </div>
        <nav>
          <ul className="nav-links">
            <li><a className="nav-link" href="#about">about</a></li>
            <li><a className="nav-link" href="#projects">projects</a></li>
            <li><a className="nav-link" href="#experience">experience</a></li>
            <li><a className="nav-link" href="#community">community</a></li>
            <li><a className="nav-link" href="#blog">blog</a></li>
            <li><a className="nav-link" href="#contact">contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}