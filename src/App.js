import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  const [sfData, setSfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesforceData = async () => {
      try {
        // Wait for Salesforce Canvas SDK to be available
        if (!window.Sfdc || !window.Sfdc.canvas) {
          console.log("Waiting for Salesforce Canvas SDK...");
          setTimeout(fetchSalesforceData, 100);
          return;
        }

        // Get the signed request from Salesforce
        window.Sfdc.canvas.client.ctx(async (msg) => {
          if (msg.status === 200) {
            const signedRequest = msg.payload;
            const instanceUrl = signedRequest.client.instanceUrl;
            const accessToken = signedRequest.client.oauthToken;

            console.log("Salesforce Context:", {
              instanceUrl,
              userId: signedRequest.context.user.userId,
              orgId: signedRequest.context.organization.organizationId,
            });

            // Fetch data from Salesforce
            try {
              const response = await fetch(
                `${instanceUrl}/services/data/v59.0/query/?q=SELECT Id, Name FROM Account LIMIT 10`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              console.log("Salesforce Data:", data);
              setSfData(data.records);
              setLoading(false);
            } catch (fetchError) {
              console.error("Error fetching Salesforce data:", fetchError);
              setError(fetchError.message);
              setLoading(false);
            }
          } else {
            console.error("Failed to get signed request:", msg);
            setError("Failed to authenticate with Salesforce");
            setLoading(false);
          }
        }, window.Sfdc.canvas.oauth.token);
      } catch (err) {
        console.error("Error initializing Canvas:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSalesforceData();
  }, []);

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
