import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  const [SignedRequest, setSignedRequest] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.client) {
        console.log("Received signed request:", event.data);
        setSignedRequest(event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  window.Sfdc.canvas(function () {
    window.Sfdc.canvas.client.refreshSignedRequest(function (data) {
      if (data.status === 200) {
        var signedRequest = data.payload.response;
        var part = signedRequest.split(".")[1];
        var sr = JSON.parse(Sfdc.canvas.decode(part));

        // Example: Query Salesforce data
        var queryUrl =
          sr.client.instanceUrl +
          "/services/data/v65.0/query?q=SELECT+Id,Name+FROM+Account+LIMIT+10";

        window.Sfdc.canvas.client.ajax(queryUrl, {
          client: sr.client,
          method: "GET",
          success: function (data) {
            console.log("Accounts:", data.payload.records);
          },
          error: function (data) {
            console.error("Error:", data);
          },
        });
      }
    });
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
