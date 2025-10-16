import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  window.Sfdc.canvas.onReady(function () {
    console.log("Salesforce sdk init.....");
    // Extract signed request
    const sr = JSON.parse(window.name.split("=")[1]);
    console.log("Signed Request:", sr);

    // Extract OAuth token & instance URL
    const { client, context } = sr;
    const { instance_url, oauthToken } = client;
    const { user, organization } = context;

    console.log("Org ID:", organization.orgId);
    console.log("User ID:", user.userId);

    // Example: Fetch Salesforce users
    fetch(
      `${instance_url}/services/data/v61.0/query?q=SELECT+Id,Name+FROM+User+LIMIT+10`,
      {
        headers: { Authorization: `Bearer ${oauthToken}` },
      }
    )
      .then((r) => r.json())
      .then((data) => console.log(data));
  });

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
