import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      if (data && data.client) {
        console.log("Signed request received in React:", data);
        window.canvasContext = data.client;

        // Now you can fetch Salesforce data
        fetchData(data.client.instanceUrl, data.client.oauthToken);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const fetchData = async (instanceUrl, accessToken) => {
    const query = "SELECT Id, Name FROM Account LIMIT 10";
    const apiUrl = `${instanceUrl}/services/data/v59.0/query/?q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Salesforce data:", data);
  };

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
