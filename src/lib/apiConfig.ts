export const API_CONFIG = {
    BASE_URL: "/api",
    AUTH_BASE_URL: "",
    LABS_BASE_URL: "/labs/api",
    TIMEOUT: 30000,
    APP_NAME: "healthportal",
};

/**
 * Consolidate logic for detecting authentication-related endpoints.
 */
export function isAuthEndpoint(endpoint: string): boolean {
    return (
        endpoint.includes("/login/") ||
        endpoint.includes("/auth/") ||
        endpoint.includes("/register/") ||
        endpoint.includes("/countries/") ||
        endpoint.includes("/states/") ||
        endpoint.startsWith("/users") ||
        endpoint.includes("profile") ||
        endpoint.includes("forgot-password") ||
        endpoint.includes("/logout/") ||
        endpoint.includes("/change-password/") ||
        endpoint.includes("/token/refresh/") ||
        endpoint.includes("/public/register/")
    );
}

export function isLabsEndpoint(endpoint: string): boolean {
    return (
        endpoint.includes("/tests/") ||
        endpoint.includes("/packageshome/") ||
        endpoint.includes("/mappings/") ||
        endpoint.includes("/availability/") ||
        endpoint.includes("/orders/") ||
        endpoint.includes("/vendors/")
    );
}

export function buildApiUrl(endpoint: string): string {
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
        return endpoint;
    }

    // Determine which base URL to use
    const isLabs = isLabsEndpoint(endpoint);
    const isAuth = isAuthEndpoint(endpoint);

    const baseUrl = isLabs
        ? API_CONFIG.LABS_BASE_URL
        : (isAuth ? API_CONFIG.AUTH_BASE_URL : API_CONFIG.BASE_URL);
    console.log(baseUrl);

    if (!baseUrl) {
        return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    }

    let cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

    // If using AUTH_BASE_URL and the endpoint already starts with 'auth/', 
    // strip it to avoid duplication since AUTH_BASE_URL often already ends with '/auth'
    if (isAuth && cleanEndpoint.startsWith("auth/")) {
        cleanEndpoint = cleanEndpoint.slice(5);
    }

    // Ensure double slashes are avoided
    const finalBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const finalEndpoint = cleanEndpoint.startsWith("/") ? cleanEndpoint.slice(1) : cleanEndpoint;

    return `${finalBaseUrl}/${finalEndpoint}`;
}
