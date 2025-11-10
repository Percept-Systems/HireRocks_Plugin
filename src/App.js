import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-green-950 to-green-200 p-6 text-white">
        <Routes>
          <Route path="/" element={<Organization />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/dashboard" element={<DashboardEmp />} />
          <Route path="/employeeProfile" element={<EmployeeProfile />} />
          <Route path="/orgProfile" element={<OrgProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
