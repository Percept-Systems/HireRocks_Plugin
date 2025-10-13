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

  const decodeSignedRequest = (signedRequest) => {
    try {
      // Signed request = signature + "." + Base64-encoded JSON context
      const parts = signedRequest.split(".");
      if (parts.length !== 2) {
        console.error("Invalid signed request format");
        return null;
      }
      const encodedContext = parts[1];
      const json = window.Sfdc.canvas.decode(encodedContext); // SDK helper
      return JSON.parse(json);
    } catch (e) {
      console.error("Failed to decode signed request:", e);
      return null;
    }
  };

  // Request (or refresh) the signed request
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
        // Optionally fallback to repost()
        // window.Sfdc.canvas.client.repost({ refresh: true });
      }
    });
  };

  // Use the signed request to fetch current user (via Canvas proxy)
  const fetchCurrentUser = (sfContext) => {
    if (!sfContext || !sfContext.user) {
      console.error("Invalid Salesforce context");
      return;
    }

    // Use relative URL — let Canvas SDK handle proxy & auth
    const soql = `SELECT Id, Username, Name, Email FROM User WHERE Id='${sfContext.user.userId}'`;
    const url = `/services/data/v58.0/query?q=${encodeURIComponent(soql)}`;

    window.Sfdc.canvas.client.ajax(url, {
      method: "GET",
      success: function (resp) {
        console.log("User record:", resp);
        if (resp.records && resp.records.length > 0) {
          setUserInfo(resp.records[0]);
        }
      },
      error: function (err) {
        console.error("Error fetching user via Canvas proxy:", err);
      },
    });
  };

  useEffect(() => {
    const tryInit = () => {
      if (window.Sfdc && window.Sfdc.canvas) {
        console.log("Canvas SDK available");

        window.Sfdc.canvas.onReady(function () {
          console.log("Canvas is ready");

          // Fetch signed request
          fetchSignedRequest((newSR) => {
            setSignedReq(newSR);
            const ctx = decodeSignedRequest(newSR);
            setSfContext(ctx);

            // Fetch user through Canvas proxy
            if (ctx && ctx.user) {
              fetchCurrentUser(ctx);
            }
          });
        });
      } else {
        console.warn("Canvas SDK not loaded yet");
      }
    };

    // Poll until SDK loads
    if (window.Sfdc && window.Sfdc.canvas) {
      tryInit();
    } else {
      const iv = setInterval(() => {
        if (window.Sfdc && window.Sfdc.canvas) {
          clearInterval(iv);
          tryInit();
        }
      }, 300);
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
