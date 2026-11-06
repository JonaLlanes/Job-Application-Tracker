async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function listApplications() {
  return request("/api/applications");
}

export function createApplication(application) {
  return request("/api/applications", {
    method: "POST",
    body: JSON.stringify(application),
  });
}

export function updateApplication(id, application) {
  return request(`/api/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(application),
  });
}

export function deleteApplication(id) {
  return request(`/api/applications/${id}`, {
    method: "DELETE",
  });
}
