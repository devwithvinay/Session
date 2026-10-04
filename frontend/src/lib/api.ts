const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  console.log("API:", endpoint);
  console.log("Status:", response.status);
  console.log("Response:", data);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}
