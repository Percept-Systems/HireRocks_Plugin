// zohoClient.js
export const initZohoClient = () => {
  const logger = Logger.getInstance(Levels.ALL);
  const environment = DataCenter.US.PRODUCTION();
  const token = new OAuthBuilder()
    .clientId("1000.KXXJLCEMMNFIVWIJXJHVXM7PA6945F")
    .scope("ZohoCRM.modules.ALL")
    .redirectURL("https://hire-rocks-plugin-eight.vercel.app/callback")
    .build();
  const sdkConfig = new SDKConfigBuilder().autoRefreshFields(true).build();

  return new Client.Builder()
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
