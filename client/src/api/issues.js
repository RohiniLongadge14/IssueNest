import API_URL from "./api";

export async function getIssues() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/issues`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch issues");
  }

  return data;
}