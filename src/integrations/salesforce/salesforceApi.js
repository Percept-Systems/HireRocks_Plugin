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

export async function sendSalesforceUsersToHireRocks(selectedIds) {
  const token = localStorage.getItem("access_token");
  const hireRocksOrgId = localStorage.getItem("hireRocksOrgId");

  if (!token || !hireRocksOrgId) {
    throw new Error("Missing HireRocks auth token or org id.");
  }

  const url = `${BASE_URL}/create_hirerocks_users`;

  const res = await axios.post(
    url,
    { SalesforceUserIds: selectedIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        hireRocksOrgId,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

