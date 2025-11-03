import React from 'react';
import './Home.css';
import logo from '../assets/logo.png';
import background_home from '../assets/background_home.png';

function Home() {
  return (
    <div className="home-container">
      {/* Overlay added here for dark blur effect */}
      <div className="background-overlay"></div>

      <header className="home-header">
        <img src={logo} className="home-logo" alt="logo" />
        <h1 className="home-title">PMT Application</h1>
        <p className="home-subtitle">Dave & Buster’s – Johnson City</p>
        <a
          className="home-link"
          href="https://www.daveandbusters.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Dave & Buster’s
        </a>
      </header>
    </div>
  );
}

export default Home;
