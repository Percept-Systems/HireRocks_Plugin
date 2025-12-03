import axios from "axios";

const BASE_URL = "https://api.hirerocks.com/api/zoho";

// Get Zoho CRM Active Users
export async function fetchZohoUsers(accessToken, hireRocksOrgId) {
  if (!accessToken || !hireRocksOrgId) {
    throw new Error("Missing token or orgId in fetchZohoUsers()");
  }

  const url = `${BASE_URL}/active_users`;

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

// Create HireRocks Users from Selected Zoho Users
export async function sendZohoUsersToHireRocks(selectedIds) {
  const token = localStorage.getItem("access_token");
  const hireRocksOrgId = localStorage.getItem("hireRocksOrgId");

  if (!token || !hireRocksOrgId) {
    throw new Error("Missing HireRocks auth token or org id.");
  }

  const url = `${BASE_URL}/create_hirerocks_users`;

  const res = await axios.post(
    url,
    { ZohoUserIds: selectedIds },
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
