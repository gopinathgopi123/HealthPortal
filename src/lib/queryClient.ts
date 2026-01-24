import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { buildApiUrl, API_CONFIG } from "./apiConfig";
import { getCookie, setCookie, removeCookie } from "./cookies";

async function throwIfResNotOk(res: Response) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(text);
    }
}

// Store token globally (will be set by auth provider)
let globalAuthToken: string | null = null;

// Store navigation function globally
let globalNavigate: ((path: string) => void) | null = null;

export function setGlobalAuthToken(token: string | null) {
    globalAuthToken = token;
}

export function getGlobalAuthToken(): string | null {
    if (globalAuthToken) return globalAuthToken;
    const token = getCookie("auth_token");
    if (token) {
        globalAuthToken = token;
        return token;
    }
    return null;
}

export function setGlobalNavigate(navigate: (path: string) => void) {
    globalNavigate = navigate;
}

function getHeaders(url: string, data?: unknown): HeadersInit {
    const headers: HeadersInit = {
        "X-Application-Name": API_CONFIG.APP_NAME,
    };

    const token = getGlobalAuthToken();
    const isPublicEndpoint = url.includes("/login/") || url.includes("/register/");

    if (token && !isPublicEndpoint) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (data && typeof data === "object") {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

export async function apiRequest(
    method: string,
    url: string,
    data?: unknown | undefined,
    isRetry: boolean = false
): Promise<Response> {
    const upperMethod = method.toUpperCase();
    const headers = getHeaders(url, data);

    const fetchOptions: RequestInit = {
        method: upperMethod,
        headers,
        credentials: "include",
    };

    if (data && !["GET", "HEAD"].includes(upperMethod)) {
        fetchOptions.body = JSON.stringify(data);
    }

    const fullUrl = buildApiUrl(url);
    const res = await fetch(fullUrl, fetchOptions);

    const isPublicEndpoint = url.includes("/login/") || url.includes("/register/");
    if (res.status === 401 && !isRetry && !isPublicEndpoint) {
        try {
            const refreshToken = getCookie("refresh_token");
            if (refreshToken) {
                const refreshResponse = await fetch(
                    buildApiUrl("/auth/refresh-token"),
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refreshToken }),
                        credentials: "include",
                    }
                );

                if (refreshResponse.ok) {
                    const result = await refreshResponse.json();
                    if (result.success && result.data) {
                        setCookie("auth_token", result.data.token);
                        setCookie("refresh_token", result.data.refreshToken);
                        setGlobalAuthToken(result.data.token);
                        return apiRequest(method, url, data, true);
                    }
                }
            }

            removeCookie("auth_token");
            removeCookie("refresh_token");
            setGlobalAuthToken(null);
            queryClient.clear();
            if (globalNavigate) {
                globalNavigate("/login");
            } else {
                window.location.href = "/login";
            }
        } catch (error) {
            console.error("Token refresh error:", error);
            removeCookie("auth_token");
            removeCookie("refresh_token");
            setGlobalAuthToken(null);
            queryClient.clear();
            if (globalNavigate) {
                globalNavigate("/login");
            } else {
                window.location.href = "/login";
            }
        }
    }

    await throwIfResNotOk(res);
    return res;
}

export function getQueryFn<T = any>(options: {
    on401: "returnNull" | "throw";
    showToastOnError?: boolean;
}): QueryFunction<T> {
    const { on401: unauthorizedBehavior, showToastOnError = true } = options;
    return async ({ queryKey }) => {
        const endpoint = queryKey.join("/") as string;
        const headers = getHeaders(endpoint);
        const fullUrl = buildApiUrl(endpoint);

        try {
            const res = await fetch(fullUrl, {
                credentials: "include",
                headers,
            });

            if (unauthorizedBehavior === "returnNull" && res.status === 401) {
                return null as unknown as T;
            }

            await throwIfResNotOk(res);
            return await res.json();
        } catch (error) {
            if (showToastOnError) {
                console.error("API Error:", error);
            }
            throw error;
        }
    };
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: getQueryFn({ on401: "throw", showToastOnError: true }),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
