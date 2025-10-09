export const initZohoSDK = async () => {
  return new Promise((resolve, reject) => {
    if (!window.ZOHO || !window.ZOHO.embeddedApp) {
      return reject("❌ Zoho SDK not loaded.");
    }

    // Initialize the embedded app
    window.ZOHO.embeddedApp.on("PageLoad", async function (data) {
      console.log("✅ Page loaded with data:", data);

      try {
        // Fetch current user details
        const userResponse = await window.ZOHO.CRM.API.getUser();
        console.log("👤 Zoho User:", userResponse);

        // Fetch organization details
        const orgResponse = await window.ZOHO.CRM.CONFIG.getCurrentOrg();
        console.log("🏢 Zoho Org:", orgResponse);

        resolve({
          user: userResponse,
          org: orgResponse,
          pageData: data,
        });
      } catch (err) {
        console.error("Error fetching Zoho data:", err);
        reject(err);
      }
    });

    // Must call init() to start SDK
    window.ZOHO.embeddedApp.init();
  });
};
