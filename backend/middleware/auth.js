import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { readAuthTokenFromCookies } from "../utils/authCookie.js";

const getAdminEmails = () => {
    return [
        process.env.ADMIN_EMAIL,
        ...(process.env.ADMIN_EMAILS?.split(",") || [])
    ]
        .map((email) => email?.trim().toLowerCase())
        .filter(Boolean);
};

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || readAuthTokenFromCookies(req);
   
    if (!token) {
        // 401 Unauthorized: The client failed to provide credentials
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(token_decode.id).select("_id name email role");

        if (!user) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }

        if (!user.role) {
            user.role = getAdminEmails().includes(user.email.trim().toLowerCase()) ? "admin" : "user";
            await user.save();
        }

        req.user = user;
        req.userId = user._id.toString();
        
        next();
    } catch (error) {
        // 403 Forbidden: The token is invalid or expired
     
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

export default authMiddleware;
