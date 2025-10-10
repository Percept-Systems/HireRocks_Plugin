export const initZohoSDK = async () => {
  return new Promise((resolve, reject) => {
    if (!window.ZOHO || !window.ZOHO.embeddedApp) {
      return reject("Zoho SDK not loaded.");
    }

    console.log("⚙️ Initializing Zoho Embedded App SDK...");

    window.ZOHO.embeddedApp.on("PageLoad", async (data) => {
      console.group("Zoho PageLoad Event");
      console.log("Page data received:", data);
      console.groupEnd();

      try {
        console.log("Fetching user details...");
        const userResponse = await window.ZOHO.CRM.API.getUser();
        console.log("User Data:", userResponse);

        console.log("Fetching organization details...");
        const orgResponse = await window.ZOHO.CRM.CONFIG.getCurrentOrg();
        console.log("Organization Data:", orgResponse);

        console.log("Zoho data fetched successfully!");
        resolve({ user: userResponse, org: orgResponse, pageData: data });
      } catch (err) {
        console.error("Error fetching Zoho data:", err);
        reject(err);
      }
    });

    // Start SDK
    window.ZOHO.embeddedApp.init();
  });
};
