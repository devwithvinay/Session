const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface ApiError {
  success: false;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

export class ApiRequestError extends Error {
  status: number;
  data?: ApiError;

  constructor(message: string, status: number, data?: ApiError) {
    super(message);

    this.name = "ApiRequestError";
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new ApiRequestError(
      "Unable to connect to the server. Please check your internet connection.",
      0,
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiRequestError(
        "Server returned an invalid response.",
        response.status,
      );
    }

    throw new ApiRequestError("Invalid response from server.", response.status);
  }

  if (!response.ok) {
    const errorData = data as Partial<ApiError>;

    let message = errorData.message || "Something went wrong.";

    // Authentication
    if (response.status === 401) {
      message =
        errorData.message || "Your session has expired. Please login again.";
    }

    // Forbidden
    if (response.status === 403) {
      message =
        errorData.message ||
        "You don't have permission to perform this action.";
    }

    // Not found
    if (response.status === 404) {
      message = errorData.message || "The requested resource was not found.";
    }

    // Duplicate data
    if (response.status === 409) {
      message = errorData.message || "This information already exists.";
    }

    // Validation
    if (response.status === 400) {
      message =
        errorData.message || "Please check the information you entered.";
    }

    // Rate limit
    if (response.status === 429) {
      message =
        errorData.message || "Too many requests. Please try again later.";
    }

    // Server error
    if (response.status >= 500) {
      message = "Something went wrong on our server. Please try again later.";
    }

    throw new ApiRequestError(message, response.status, errorData as ApiError);
  }

  return data as T;
}
