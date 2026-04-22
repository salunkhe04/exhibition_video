// fetchAdapter.ts

type FetchAdapterOptions = RequestInit & {
  headers?: Record<string, string>;
};

type FetchAdapterResponse<T = unknown> = {
  data: T;
  code?: number;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
};

class FetchAdapterError extends Error {
  response?: unknown;

  constructor(message: string, response?: unknown) {
    super(message);
    this.name = "FetchAdapterError";
    this.response = response;
  }
}

const fetchAdapter = async <T = unknown>(
  url: string,
  options: FetchAdapterOptions = {}
): Promise<FetchAdapterResponse<T>> => {
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "x-platform": "web",
  };

  console.log("adapter");

  const updatedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: "include", // includes cookies
  };

  try {
    const response = await fetch(url, updatedOptions);
    const data = (await response.json()) as FetchAdapterResponse<T>;

    if (!response.ok) {
      throw new FetchAdapterError(data.message || "Request failed", data);
    }

    return data;
  } catch (error) {
    console.error("FetchAdapter Error:", error);
    if (error instanceof FetchAdapterError) {
      throw error;
    }
    throw new FetchAdapterError("Unexpected error occurred", error);
  }
};

export default fetchAdapter;
