import rateLimit from "express-rate-limit";

const standardRateLimitConfig = {
    standardHeaders: true,
    legacyHeaders: false,
};

export const authRateLimiter = rateLimit({
    ...standardRateLimitConfig,
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    },
});

export const checkoutRateLimiter = rateLimit({
    ...standardRateLimitConfig,
    windowMs: 10 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many checkout attempts. Please try again later."
    },
});
