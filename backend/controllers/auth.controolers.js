import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.modals.js";
import { ErrorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password, profilePicUrl, adminJoinCode } = req.body || {};

    if (!name || !email || !password) {
      return next(ErrorHandler(400, "Name, email and password are required"));
    }

    const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (exists) return next(ErrorHandler(409, "User with this email already exists"));

    const role = adminJoinCode === process.env.ADMIN_JOIN_CODE ? "admin" : "user";
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      email: String(email).toLowerCase().trim(),
      password: hashedPassword,
      profilePicUrl,
      role,
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("signUp error:", err);
    return next(ErrorHandler(500, "Internal server error"));
  }
};

export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return next(ErrorHandler(400, "Email and password are required"));

    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) return next(ErrorHandler(404, "User not found"));

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return next(ErrorHandler(400, "Incorrect credentials"));

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return next(ErrorHandler(500, "JWT secret not configured"));

    const payload = { id: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // Debug: log token snippet (remove in production)
    console.log("SignIn -> token (prefix):", token.slice(0, 40));

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const safe = user.toObject();
    delete safe.password;

    // Set cookie name token_access to match existing requests/logs
    return res.status(200).cookie("token_access", token, cookieOptions).json({
      success: true,
      message: "SignIn successful",
      user: safe,
    });
  } catch (err) {
    console.error("SignIn error:", err);
    return next(ErrorHandler(500, "Internal server error"));
  }
};

export const userProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(ErrorHandler(401, "Unauthorized"));

    const user = await User.findById(userId).select("-password");
    if (!user) return next(ErrorHandler(404, "User not found"));

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("userProfile error:", err);
    return next(ErrorHandler(500, "Internal server error"));
  }
};