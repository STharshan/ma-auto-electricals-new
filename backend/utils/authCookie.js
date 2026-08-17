export const ADMIN_AUTH_COOKIE = "ma_admin_token";

const parseCookieHeader = (cookieHeader = "") => {
    return cookieHeader
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .reduce((acc, part) => {
            const separatorIndex = part.indexOf("=");
            if (separatorIndex === -1) return acc;
            const key = part.slice(0, separatorIndex).trim();
            const value = part.slice(separatorIndex + 1).trim();
            if (key) acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
};

export const getAuthCookieOptions = () => ({
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
    path: "/",
});

export const setAuthCookie = (res, token) => {
    res.cookie(ADMIN_AUTH_COOKIE, token, getAuthCookieOptions());
};

export const clearAuthCookie = (res) => {
    res.clearCookie(ADMIN_AUTH_COOKIE, {
        ...getAuthCookieOptions(),
        maxAge: undefined,
    });
};

export const readAuthTokenFromCookies = (req) => {
    const cookies = parseCookieHeader(req.headers.cookie);
    return cookies[ADMIN_AUTH_COOKIE] || null;
};
