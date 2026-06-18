import express from 'express';
import { loginUser,registerUser,checkTokenCorrect,logoutUser} from '../controllers/userController.js';
import { authRateLimiter } from "../middleware/rateLimiters.js";

const userRouter = express.Router();

userRouter.post("/register", authRateLimiter, registerUser);
userRouter.post("/login", authRateLimiter, loginUser);
userRouter.post("/checkTokenCorrect",checkTokenCorrect);
userRouter.post("/logout",logoutUser);

export default userRouter;
