export const loadZohoSDK = () => {
  return new Promise((resolve, reject) => {
    console.log("🌀 Checking if Zoho SDK is available...");

    if (window.ZOHO && window.ZOHO.embeddedApp) {
      console.log("✅ Zoho SDK is ready.");
      resolve();
    } else {
      reject(
        "❌ Zoho SDK not loaded. Make sure the script is included in index.html"
      );
    }
  });
};
