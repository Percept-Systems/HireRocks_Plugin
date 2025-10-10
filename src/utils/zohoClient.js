// src/utils/zohoClient.js

export const initZohoClient = () => {
  if (!window.Logger || !window.Client) {
    throw new Error(
      "❌ Zoho SDK not loaded. Make sure you included it in index.html"
    );
  }

  const logger = window.Logger.getInstance(window.Levels.ALL);
  const environment = window.DataCenter.US.PRODUCTION();
  const token = new window.OAuthBuilder()
    .clientId("1000.KXXJLCEMMNFIVWIJXJHVXM7PA6945F")
    .scope("ZohoCRM.modules.ALL")
    .redirectURL("https://hire-rocks-plugin-eight.vercel.app/callback")
    .build();
  const sdkConfig = new window.SDKConfigBuilder()
    .autoRefreshFields(true)
    .build();

  return new window.Client.Builder()
    .logger(logger)
    .environment(environment)
    .token(token)
    .sdkConfig(sdkConfig)
    .build();
};

export const fetchLeads = async (client) => {
  try {
    return await client.record.get({ module: "Leads" });
  } catch (err) {
    console.error("Error fetching Leads:", err);
    throw err;
  }
};
