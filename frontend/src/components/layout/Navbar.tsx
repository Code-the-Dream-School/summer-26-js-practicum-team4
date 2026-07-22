function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">X-Stich</a>
      </div>
      
      <ul className="navbar-menu">
        <li><a href="/generate">Generate</a></li>
        <li><a href="/mypatterns">My Patterns</a></li>
        <li><a href="/gallery">Gallery</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Signup</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;