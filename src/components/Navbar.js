import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">PMT App</div>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li
          className={location.pathname === '/' ? 'active' : ''}
          onClick={closeMenu}
        >
          <Link to="/">Home</Link>
        </li>
        <li
          className={location.pathname === '/pmt-schedule' ? 'active' : ''}
          onClick={closeMenu}
        >
          <Link to="/pmt-schedule">PMT Schedule</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
