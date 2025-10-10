const ZOHO_SDK_URL =
  "https://static.zohocdn.com/zohocrm/v8.0/sdk/2.0.0/zohocrmsdk-8-0.js";

export const loadZohoSDK = () => {
  return new Promise((resolve, reject) => {
    console.log("Checking if Zoho SDK already available...");

    if (window.ZOHO && window.ZOHO.embeddedApp) {
      console.log("Zoho SDK already loaded.");
      return resolve();
    }

    // If script tag already exists, wait for it to finish loading
    if (document.querySelector(`script[src="${ZOHO_SDK_URL}"]`)) {
      console.log("SDK script already in DOM, waiting...");
      const interval = setInterval(() => {
        if (window.ZOHO && window.ZOHO.embeddedApp) {
          clearInterval(interval);
          console.log("Zoho SDK ready after wait.");
          resolve();
        }
      }, 300);
      setTimeout(() => reject("Zoho SDK load timeout"), 10000);
      return;
    }

    // Inject script dynamically
    console.log("Injecting Zoho SDK script...");
    const script = document.createElement("script");
    script.src = ZOHO_SDK_URL;
    script.async = true;
    script.onload = () => {
      console.log("Zoho SDK script loaded successfully.");
      resolve();
    };
    script.onerror = () => reject("Failed to load Zoho SDK script");
    document.body.appendChild(script);
  });
};
