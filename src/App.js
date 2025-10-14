import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Organization from "./pages/Organisation";
import DashboardEmp from "./pages/DashboardEmp";
import Tracker from "./pages/Tracker";
import EmployeeProfile from "./pages/EmployeeProfile";
import OrgProfile from "./pages/OrgProfile";

function App() {
  const [signedReq, setSignedReq] = useState(null);
  const [sfContext, setSfContext] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const decodeSignedRequest = (signedRequest) => {
    try {
      const parts = signedRequest.split(".");
      if (parts.length !== 2) {
        console.error("Invalid signed request format");
        return null;
      }
      const encodedContext = parts[1];
      const json = window.Sfdc.canvas.decode(encodedContext);
      return JSON.parse(json);
    } catch (e) {
      console.error("Failed to decode signed request:", e);
      return null;
    }
  };

  const fetchSignedRequest = (callback) => {
    if (!window.Sfdc || !window.Sfdc.canvas || !window.Sfdc.canvas.client) {
      console.error("Canvas SDK not available");
      return;
    }

    window.Sfdc.canvas.client.refreshSignedRequest(function (data) {
      if (data.status === 200) {
        const newSignedReq = data.payload.response;
        callback(newSignedReq);
      } else {
        console.error("refreshSignedRequest failed:", data);
      }
    });
  };

  const fetchCurrentUser = (sfContext) => {
    if (!sfContext || !sfContext.user || !sfContext.client) {
      console.error("Invalid Salesforce context");
      return;
    }

    const soql = `SELECT Id, Username, Name, Email FROM User WHERE Id='${sfContext.user.userId}'`;
    const url = `/services/data/v58.0/query?q=${encodeURIComponent(soql)}`;

    window.Sfdc.canvas.client.ajax(url, {
      client: sfContext.client, // Critical!
      method: "GET",
      success: function (data) {
        console.log("Canvas AJAX response:", data);
        // Response data is in data.payload
        if (
          data.payload &&
          data.payload.records &&
          data.payload.records.length > 0
        ) {
          setUserInfo(data.payload.records[0]);
        }
      },
      error: function (err) {
        console.error("Error fetching user via Canvas proxy:", err);
      },
    });
  };

  const tryInit = () => {
    if (window.Sfdc && window.Sfdc.canvas) {
      console.log("Canvas SDK available");

      window.Sfdc.canvas.onReady(function () {
        console.log("Canvas is ready");

        fetchSignedRequest((newSR) => {
          setSignedReq(newSR);
          const ctx = decodeSignedRequest(newSR);
          console.log("Decoded context:", ctx);
          setSfContext(ctx);

          if (ctx && ctx.user && ctx.client) {
            fetchCurrentUser(ctx);
          }
        });
      });
    } else {
      console.warn("Canvas SDK not loaded yet");
    }
  };

  if (window.Sfdc && window.Sfdc.canvas) {
    tryInit();
  } else {
    const iv = setInterval(() => {
      if (window.Sfdc && window.Sfdc.canvas) {
        clearInterval(iv);
        tryInit();
      }
    }, 300);

    // Cleanup
    return () => clearInterval(iv);
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
