import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import {
    clearAuthCookie,
    readAuthTokenFromCookies,
    setAuthCookie,
} from "../utils/authCookie.js";

const getAdminEmails = () => {
    return [
        process.env.ADMIN_EMAIL,
        ...(process.env.ADMIN_EMAILS?.split(",") || [])
    ]
        .map((email) => email?.trim().toLowerCase())
        .filter(Boolean);
};

const resolveRoleForEmail = (email) => {
    return getAdminEmails().includes(email.trim().toLowerCase()) ? "admin" : "user";
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (!validator.isEmail(String(email))) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const normalizedEmail = String(email).trim();
        const user = await userModel.findOne({
            email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" }
        });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.role) {
            user.role = resolveRoleForEmail(user.email);
            await user.save();
        }

        const token = createToken(user._id);
        setAuthCookie(res, token);
        res.json({ success: true, message: "User logged in successfully", role: user.role });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to login user" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h' 
    });
};

// resgister user
const registerUser = async (req, res) => {
    const { name, email, password, registerKey } = req.body;
    try {

        if (registerKey !== process.env.REGISTER_SECRET_KEY) {
            return res.status(403).json({
                success: false,
                message: "Invalid Registration Key"
            });
        }
        // checking is user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        //validate email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be atleast 8 characters" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            role: resolveRoleForEmail(email)
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        setAuthCookie(res, token);
        res.json({ success: true, message: "User registered successfully", role: user.role });

    } catch (error) {
       
        res.json({ success: false, message: "Failed to register user" });
    }
}

const checkTokenCorrect = async (req, res) => {
    const authHeader = req.headers.authorization;
    const cookieToken = readAuthTokenFromCookies(req);
    const token = authHeader?.split(" ")[1] || cookieToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        if (!user.role) {
            user.role = resolveRoleForEmail(user.email);
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Token valid",
            userId: user._id,
            userName: user.name,
            role: user.role
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });
    }
};

const logoutUser = async (req, res) => {
    clearAuthCookie(res);
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export { loginUser, registerUser, checkTokenCorrect, logoutUser };
