export function loginToSalesforce() {
  console.log("Starting Salesforce OAuth...");

  const clientId = process.env.REACT_APP_SF_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SF_REDIRECT_URI;
  const domain = process.env.REACT_APP_SF_AUTH_DOMAIN;
  const hireRocksOrgId = localStorage.getItem("hireRocksOrgId");

  const targetOrigin = localStorage.getItem("salesforce_target_origin") || "*";

  if (!clientId || !redirectUri || !domain || !hireRocksOrgId) {
    console.error("Missing Salesforce OAuth configuration.");
    alert("Salesforce configuration missing.");
    return;
  }

  // Save CRM Tab URL
  localStorage.setItem("sf_original_crm_url", window.location.href);

  // Add origin to redirectUri
  const redirectWithOrigin = `${redirectUri}?origin=${encodeURIComponent(
    targetOrigin
  )}`;

  const authUrl = `${domain}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectWithOrigin
  )}&access_type=offline&prompt=consent&state=${hireRocksOrgId}`;

  const popup = window.open(
    authUrl,
    "salesforce_oauth",
    "width=600,height=700"
  );

  if (!popup) {
    alert("Popup blocked! Please enable popups for Salesforce login.");
  }
}

export function attachSalesforceTokenListener(onToken) {
  function handler(event) {
    const allowedOrigin =
      localStorage.getItem("salesforce_target_origin") ||
      window.location.origin;

    if (event.origin !== allowedOrigin) {
      console.warn("Blocked postMessage from:", event.origin);
      return;
    }

    if (event.data?.type === "SF_TOKEN") {
      onToken(event.data.token);
    }
  }

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

export function storeSalesforceAccessToken(token) {
  sessionStorage.setItem("sf_access_token", token);
}

export function getSalesforceAccessToken() {
  return sessionStorage.getItem("sf_access_token");
}
