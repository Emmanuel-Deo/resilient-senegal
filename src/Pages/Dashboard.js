import React from "react";
import "./Dashboard.css"; // We'll define the styles here
import MapPanel from "../Components/Dashboard/MapPanel"; // adjust relative path if needed
import Sidebar from "../Components/Dashboard/Items/SideBar";
import InfoPanel from "../Components/Dashboard/Items/InfoPanel";

// Then in your return block:
<MapPanel />


export default function Dashboard() {
  return (
    <div className="dashboard-container">
  
      <Sidebar/>
      
      {/* Info Panel */}
     <InfoPanel/>
      {/* Map Panel */}
      <MapPanel />
    </div>
  );
}
