import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, setGlobalAuthToken } from "@/lib/queryClient";
import { setCookie, getCookie, removeCookie } from "@/lib/cookies";
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";

// Helper function to decode JWT and get expiration time
function decodeJWT(token: string): { exp?: number } | null {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}

// User type based on the login response
export interface User {
    id: number;
    username: string;
    email: string;
    phone_number: string | null;
    first_name: string;
    last_name: string;
    date_joined: string;
    groups: string[];
    user_type?: number;
    permissions?: Record<string, any>;
}

export interface AuthData {
    user: User;
    token: string;
    refreshToken: string;
}

// Refresh token function
async function refreshAuthToken(
    refreshToken: string
): Promise<AuthData | null> {
    try {
        const response = await apiRequest("POST", "/token/refresh/", {
            refresh_token: refreshToken,
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        const result = await response.json();

        if (result.success && result.data && result.data.tokens) {
            const storedUser = getCookie("auth_user");
            const currentUser = storedUser ? JSON.parse(storedUser) : null;

            const newAuthData: AuthData = {
                user: result.data.user || currentUser,
                token: result.data.tokens.access,
                refreshToken: result.data.tokens.refresh,
            };

            console.log("newAuthData", newAuthData);

            // Update cookies and query cache
            setAuthData(newAuthData);
            return newAuthData;
        }

        return null;
    } catch (error) {
        console.error("Token refresh failed:", error);
        return null;
    }
}


// Try to get auth data from cookies
const getStoredAuth = (): AuthData | null => {
    try {
        const token = getCookie("auth_token");
        const refreshToken = getCookie("refresh_token");
        const storedUser = getCookie("auth_user");

        if (token && storedUser) {
            return {
                user: JSON.parse(storedUser),
                token,
                refreshToken: refreshToken || "",
            };
        }
        return null;
    } catch {
        return null;
    }
};

export function useAuth() {
    const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [, setLocation] = useLocation();

    const { data: authData, isLoading } = useQuery<AuthData | null>({
        queryKey: ["/auth/user"],
        queryFn: async () => {
            const stored = getStoredAuth();
            if (stored && stored.token) {
                return stored;
            }
            return null;
        },
        initialData: getStoredAuth,
        retry: false,
        staleTime: Infinity, // Don't refetch automatically
    });

    // Refresh token callback
    const refreshToken = useCallback(async () => {
        const currentAuth = getStoredAuth();
        if (!currentAuth?.refreshToken) {
            return false;
        }

        const newAuthData = await refreshAuthToken(currentAuth.refreshToken);
        if (newAuthData) {
            // Schedule next refresh
            scheduleTokenRefresh(newAuthData.token);
            return true;
        } else {
            // Refresh failed, logout
            clearAuthData();
            setTimeout(() => setLocation("/login"), 100);
            return false;
        }
    }, []);

    // Schedule token refresh before expiration
    const scheduleTokenRefresh = useCallback(
        (token: string) => {
            // Clear existing timeout
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }

            const decoded = decodeJWT(token);
            if (!decoded?.exp) return;

            const now = Math.floor(Date.now() / 1000);
            const expiresIn = decoded.exp - now;

            // Refresh 5 minutes before expiration (or halfway through if token expires in less than 10 minutes)
            const refreshIn = Math.max(expiresIn - 300, expiresIn / 2);

            if (refreshIn > 0) {
                refreshTimeoutRef.current = setTimeout(() => {
                    refreshToken();
                }, refreshIn * 1000);
            }
        },
        [refreshToken]
    );

    // Update global auth token and schedule refresh whenever authData changes
    useEffect(() => {
        if (authData?.token) {
            setGlobalAuthToken(authData.token);
            scheduleTokenRefresh(authData.token);
        } else {
            setGlobalAuthToken(null);
        }

        // Cleanup on unmount
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, [authData, scheduleTokenRefresh]);

    const logout = useMutation({
        mutationFn: async () => {
            const refreshToken = getCookie("refresh_token");

            // 1. Call logout endpoint first (optional, but good practice)
            try {
                if (refreshToken) {
                    await apiRequest("POST", "/logout/", {
                        refresh_token: refreshToken
                    });
                }
            } catch (error) {
                console.error("Logout API error:", error);
            } finally {
                // 2. ABSOLUTELY CLEAR EVERYTHING regardless of API success
                clearAuthData();
                queryClient.clear();

                // 3. Force full browser refresh to clear all JS memory state
                window.location.href = "/login";
            }
        },
    });

    return {
        user: authData?.user || null,
        token: authData?.token || null,
        refreshToken: authData?.refreshToken || null,
        isLoading,
        isAuthenticated: !!(authData?.user && authData?.token),
        logout: logout.mutate,
        refreshAuthToken: refreshToken,
    };
}

// Helper function to store auth data
export function setAuthData(data: AuthData) {
    setCookie("auth_token", data.token);
    setCookie("refresh_token", data.refreshToken);
    setCookie("auth_user", JSON.stringify(data.user)); // Store user in cookie

    // Update the query cache
    queryClient.setQueryData(["/auth/user"], data);
    // Update global auth token
    setGlobalAuthToken(data.token);
}

// Helper function to clear auth data
export function clearAuthData() {
    removeCookie("auth_token");
    removeCookie("refresh_token");
    removeCookie("auth_user"); // Remove user cookie

    queryClient.setQueryData(["/auth/user"], null);
    // Clear global auth token
    setGlobalAuthToken(null);
}
