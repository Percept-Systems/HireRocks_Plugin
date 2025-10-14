import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  const [signedRequest, setSignedRequest] = useState(null);

  useEffect(() => {
    // Wait until Canvas SDK is loaded
    const fetchSignedRequest = () => {
      if (!window.Sfdc || !window.Sfdc.canvas || !window.Sfdc.canvas.client) {
        console.log("Waiting for Canvas SDK...");
        setTimeout(fetchSignedRequest, 100);
        return;
      }

      console.log("Canvas SDK loaded, requesting signed request...");

      window.Sfdc.canvas.client.refreshSignedRequest(function (response) {
        console.log("refreshSignedRequest callback fired:", response);
        if (response && response.status === 200 && response.payload?.response) {
          setSignedRequest(response.payload.response);
        } else {
          console.error("Failed to get signed request:", response);
        }
      });
    };

    fetchSignedRequest();
  }, []);

  useEffect(() => {
    if (signedRequest) {
      // Decode signed request if needed or extract client info
      console.log("Signed request received:", signedRequest);
    }
  }, [signedRequest]);

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
