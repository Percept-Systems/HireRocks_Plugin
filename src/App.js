import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  // useEffect(() => {
  //   if (window.Sfdc && window.Sfdc.canvas) {
  //     // Initialize Canvas SDK
  //     window.Sfdc.canvas.client.init({
  //       clientId:
  //         "3MVG9dAEux2v1sLv74wmstLn5H85DDTFSVwKdawt2XI2.c5Ciav_Zrmxocvsflb83iL6CrTAFDLkjwe.5ACIk",
  //       oauthCallback: "https://hire-rocks-plugin-eight.vercel.app/callback",
  //     });

  //     // Subscribe to signed request
  //     window.Sfdc.canvas.client.subscribe(
  //       window,
  //       "signedRequest",
  //       function (signedRequest) {
  //         console.log("Signed Request:", signedRequest);
  //         console.log("Signed Request:", signedRequest.client.oauthToken);
  //         // You now have the OAuth token and org info
  //       }
  //     );
  //   } else {
  //     console.error("Canvas SDK not loaded");
  //   }
  // }, []);

  if (window.ZOHO && window.ZOHO.embeddedApp && window.ZOHO.CRM) {
    // Register PageLoad event
    window.ZOHO.embeddedApp.on("PageLoad", function (data) {
      console.log("PageLoad event data:", data);

      // Fetch Leads
      window.ZOHO.CRM.API.getAllRecords({
        Entity: "Leads",
        per_page: 15,
        page: 1,
        sort_order: "desc",
      })
        .then(function (response) {
          console.log("Fetched Leads data:", response.data);
        })
        .catch(function (error) {
          console.error("Failed to fetch Leads:", error);
        });
    });

    // Initialize embedded app
    window.ZOHO.embeddedApp.init();
  } else {
    console.warn("ZOHO SDK not loaded yet.");
  }

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
