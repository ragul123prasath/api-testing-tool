// utils/apiClient.js

const BASE_URL = "http://localhost:5000"; // backend server URL

// ----------------------------
// Generic API Request
// ----------------------------
export async function apiRequest(url, options = {}) {
  try {
    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    // If backend sends text or empty, we capture it
    const rawText = await response.text();

    let json;
    try {
      json = JSON.parse(rawText);
    } catch {
      console.error("Non-JSON server response:", rawText);
      throw new Error("Server returned invalid JSON");
    }

    // Handle failed HTTP status
    if (!response.ok) {
      throw new Error(json.message || "API request failed");
    }

    // Normalize backend formats:
    // { data: {...} }
    // { collection: {...} }
    // { id, name }
    return (
      json?.data ||
      json?.collection ||
      json
    );

  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

// ----------------------------
// Collections API
// ----------------------------
export async function getCollections() {
  return await apiRequest(`${BASE_URL}/collections`, {
    method: "GET",
  });
}

export async function createCollection(name) {
  return await apiRequest(`${BASE_URL}/collections`, {
    method: "POST",
    body: { name },
  });
}
