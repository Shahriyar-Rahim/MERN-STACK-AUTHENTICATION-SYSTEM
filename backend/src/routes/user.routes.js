import express from "express";
import { forgotPassword, getUser, login, logout, register, resetPassword, verifyOtp } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.js";


const router = express.Router();

// register router
router.post("/register", register);

// verification otp
router.post("/verify-otp", verifyOtp);

// login router
router.post("/login", login);

// logout router
router.get("/logout",isAuthenticated, logout);

// get user
router.get("/me", isAuthenticated, getUser);

// forgot password
router.post("/password/forgot", forgotPassword);

// reset password
router.put("/password/reset/:token", resetPassword);



export default router;