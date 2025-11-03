import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PMTSchedule from './pages/PMTSchedule';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pmt-schedule" element={<PMTSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
