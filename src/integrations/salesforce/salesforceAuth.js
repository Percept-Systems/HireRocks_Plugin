export function loginToSalesforce() {
  console.log("Starting Salesforce OAuth...");

  const clientId = process.env.REACT_APP_SF_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_SF_REDIRECT_URI;
  const domain = process.env.REACT_APP_SF_AUTH_DOMAIN;
  const hireRocksOrgId = localStorage.getItem("hireRocksOrgId");

  if (!clientId || !redirectUri || !domain || !hireRocksOrgId) {
    console.error("Missing Salesforce OAuth configuration.");
    alert("Salesforce configuration missing.");
    return;
  }

  // save CRM tab URL
  localStorage.setItem("sf_original_crm_url", window.location.href);

  const authUrl = `${domain}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&access_type=offline&prompt=consent&state=${hireRocksOrgId}`;

  // OPEN OAUTH IN POPUP, NOT SAME WINDOW
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
    if (event.origin !== window.location.origin) return;

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
