import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  useEffect(() => {
    if (window.Sfdc && window.Sfdc.canvas) {
      // Initialize Canvas SDK
      window.Sfdc.canvas.client.init({
        clientId:
          "3MVG9dAEux2v1sLv74wmstLn5H85DDTFSVwKdawt2XI2.c5Ciav_Zrmxocvsflb83iL6CrTAFDLkjwe.5ACIk",
        oauthCallback: "https://hire-rocks-plugin-eight.vercel.app/callback",
      });

      // Subscribe to signed request
      window.Sfdc.canvas.client.subscribe(
        window,
        "signedRequest",
        function (signedRequest) {
          console.log("Signed Request:", signedRequest);
          console.log("Signed Request:", signedRequest.client.oauthToken);
          // You now have the OAuth token and org info
        }
      );
    } else {
      console.error("Canvas SDK not loaded");
    }
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
