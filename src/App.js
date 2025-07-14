import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import MapGallery from "./Pages/MapGallery";
import Documentation from "./Pages/Documentation";
import { MapProvider } from "./Contexts/MapContext";


function App() {
  return (

<MapProvider> 
 <Router>
      <div className="app-container">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mapgallery" element={<MapGallery />} />

            <Route path="/documentation" element={<Documentation />} />
          </Routes>
        </div>
      </div>
    </Router>
    </MapProvider>

  );
}

export default App;
