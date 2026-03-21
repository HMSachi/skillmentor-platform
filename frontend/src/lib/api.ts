import type { Enrollment, Mentor } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 5,
  delay = 2000,
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        // Add a timeout signal to each attempt
        signal: AbortSignal.timeout(30000), // 30s timeout (Render cold starts)
      });
      if (response.ok) return response;
      
      // If server is starting up (502, 503, 504), wait and retry
      if (response.status >= 502 && response.status <= 504) {
        console.warn(`Server starting up (Status ${response.status}). Retrying... (${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(1.5, i))); // Exponential backoff
        continue;
      }
      
      return response; // Return other failures immediately
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Connection failed. Retrying... (${i + 1}/${retries})`, err);
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(1.5, i))); // Exponential backoff
    }
  }
  throw new Error("Max retries reached");
}

async function fetchWithAuth(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res;
}

// Ping the backend to wake it up (Render Free Tier)
export async function wakeUpBackend(): Promise<void> {
  try {
    // Just a head request or a simple ping to the root
    await fetch(`${API_BASE_URL}/`, { method: "HEAD", mode: 'no-cors' }).catch(() => {});
  } catch (e) {
    // Ignore errors for wake-up call
  }
}

// Public route without auth with stale-while-revalidate caching
export async function getPublicMentors(
  page = 0,
  size = 10,
): Promise<{ content: Mentor[]; totalElements: number; totalPages: number }> {
  const cacheKey = `mentors-cache-p${page}-s${size}`;

  // Try to get from cache first
  const cachedData = localStorage.getItem(cacheKey);
  let parsedCache = null;
  if (cachedData) {
    try {
      parsedCache = JSON.parse(cachedData);
    } catch (e) {
      console.error("Failed to parse mentors cache", e);
    }
  }

  // Trigger network fetch in background
  const networkFetch = (async () => {
    try {
      const res = await fetchWithRetry(
        `${API_BASE_URL}/api/v1/mentors?page=${page}&size=${size}`,
      );
      if (!res.ok) throw new Error("Failed to fetch mentors");
      const data = await res.json();
      
      // Update cache on success
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn("Background fetch failed", error);
      throw error;
    }
  })();

  // ALWAYS SHOW: If we have cached data, return it IMMEDIATELY.
  // The UI will show the stale data. The next time the user visits or if we added a listener, they'd see the update.
  // For most 'cold start' scenarios, this is exactly what's needed.
  if (parsedCache) {
    // We return the cached data immediately. 
    // The background fetch will still run and update the cache for the next reload.
    return parsedCache;
  }

  // If no cache, wait for the network
  return networkFetch;
}

// Enrollments
export async function enrollInSession(
  token: string,
  data: {
    mentorId: number;
    subjectId: number;
    sessionAt: string;
    durationMinutes?: number;
  },
): Promise<Enrollment> {
  const res = await fetchWithAuth("/api/v1/sessions/enroll", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMyEnrollments(token: string): Promise<Enrollment[]> {
  const res = await fetchWithAuth("/api/v1/sessions/my-sessions", token);
  return res.json();
}

// Mentors
export async function getMentorById(id: number, token?: string): Promise<Mentor> {
  const cacheKey = `mentor-cache-${id}`;

  // Try to get from cache first
  const cachedData = localStorage.getItem(cacheKey);
  let parsedCache = null;
  if (cachedData) {
    try {
      parsedCache = JSON.parse(cachedData);
    } catch (e) {
      console.error("Failed to parse mentor cache", e);
    }
  }

  // Network fetch in background
  const networkFetch = (async () => {
    try {
      let res;
      if (token) {
        res = await fetchWithAuth(`/api/v1/mentors/${id}`, token);
      } else {
        res = await fetchWithRetry(`${API_BASE_URL}/api/v1/mentors/${id}`);
      }

      if (!res.ok) throw new Error("Failed to fetch mentor details");
      const data = await res.json();
      
      // Update cache
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (error) {
      if (parsedCache) {
        console.warn("Fetch failed, using cached data", error);
        return parsedCache;
      }
      throw error;
    }
  })();

  // If we have cached data, return it immediately for instant UI
  if (parsedCache) {
    return parsedCache;
  }

  return networkFetch;
}
// Reviews
export async function leaveReview(
  token: string,
  data: { mentorId: number; rating: number; comment: string },
): Promise<any> {
  const res = await fetchWithAuth("/api/v1/reviews", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMentorReviews(mentorId: number): Promise<any[]> {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/v1/reviews/mentor/${mentorId}`);
  if (!res.ok) return [];
  return res.json();
}

// Payment Proof
export async function uploadPaymentProof(
  token: string,
  sessionId: number,
  paymentProofUrl: string,
): Promise<Enrollment> {
  const res = await fetchWithAuth(`/api/v1/sessions/${sessionId}/payment-proof`, token, {
    method: "PATCH",
    body: JSON.stringify({ paymentProofUrl }),
  });
  return res.json();
}

// Admin API
export async function adminGetBookings(token: string): Promise<Enrollment[]> {
  const res = await fetchWithAuth("/api/v1/admin/bookings", token);
  return res.json();
}

export async function adminApprovePayment(token: string, sessionId: number): Promise<Enrollment> {
  const res = await fetchWithAuth(`/api/v1/admin/bookings/${sessionId}/approve-payment`, token, {
    method: "PUT",
  });
  return res.json();
}

export async function adminUpdateSessionStatus(
  token: string,
  sessionId: number,
  status: string,
): Promise<Enrollment> {
  const res = await fetchWithAuth(
    `/api/v1/admin/bookings/${sessionId}/status?status=${status}`,
    token,
    { method: "PUT" },
  );
  return res.json();
}

export async function adminGetAnalytics(token: string): Promise<any> {
  const res = await fetchWithAuth("/api/v1/admin/analytics", token);
  return res.json();
}
