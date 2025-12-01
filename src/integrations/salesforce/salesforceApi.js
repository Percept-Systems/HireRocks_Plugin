import axios from "axios";

const BASE_URL = "https://api.hirerocks.com/api/salesforce";

// Get Zoho CRM Active Users
export async function fetchSalesforceUsers(accessToken, hireRocksOrgId) {
  if (!accessToken || !hireRocksOrgId) {
    throw new Error("Missing token or orgId in fetchSalesforceUsers()");
  }

  const url = `${BASE_URL}/users`;

  const res = await axios.get(url, {
    params: {
      accessToken,
      hireRocksOrgId,
    },
  });

  const data = res.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  return [];
}
