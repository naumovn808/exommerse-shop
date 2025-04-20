import { hashPassword, comparePassword } from "../helper/passwordHashing.js"

import UserModel from "../models/user.model.js"
import generateAccessToken from "../utils/generateAccessToken.js"
import generateRefreshToken from "../utils/generateRefreshToken.js"
import verificationEmailTemplate from "../utils/verificationEmailTemplate.js"
import dotenv from "dotenv"

import jwt from "jsonwebtoken";


dotenv.config();

//register user
export const registerUserController = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({
                message: "Please fill the required fields",
                error: true,
                success: false
            })
        }

        const existingUser = await UserModel.findOne({ $or: [{ email }, { mobile }] })

        if (existingUser) {
            res.status(400).json({
                message: existingUser.email === email
                    ? "Email is already registered"
                    : "Mobile number is registered",
                error: true,
                success: false
            })
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            mobile
        })

        const savedUser = await newUser.save();

        const verifyEmailURL = `${process.env.CLIENT_URL}/verify-email?code=${savedUser._id}`;

        await sendMail({
            sendTo: email,
            subject: "Verification Email from Blinkit",
            html: verificationEmailTemplate({
                name: savedUser.name,
                url: verifyEmailURL
            })
        })

        const accessToken = await generateAccessToken(savedUser._id)
        const refreshToken = await generateRefreshToken(savedUser._id)

        const cookiesOption = {
            httpOnly: true,
            secure: false,
            sameSite: 'None'
        }

        res.cookie("accessToken", accessToken, cookiesOption)
        res.cookie("refreshToken", refreshToken, cookiesOption)

        return res.status(201).json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: {
                user: savedUser,
                accessToken,
                refreshToken
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: true, success: false

        })
    }
}

// verify user
export const verifyUserController = async (req, res) => {
    try {
        const { code } = req.body;

        const user = await UserModel.findOneAndUpdate(
            { _id: code },
            { $set: { verify_email: true } }
        );

        if (!user) {
            return res.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false
            })
        }

        return res.status(200).json({
            message: "Email verified successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//login user
export const loginUserController = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email or password are required",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                message: `Your account is ${user.status}, Please contact to admin`,
                error: true,
                success: false
            })
        }

        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid credentials! Please check your email or password",
                error: true,
                success: false
            })
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date(),
        })

        const cookiesOptions = {
            httpOnly: true,
            secure: false,
            sameSite: 'None'
        }

        res.cookie("accessToken", accessToken, cookiesOptions);
        res.cookie("refreshToken", refreshToken, cookiesOptions);

        return res.status(200).json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
                user: user
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Logout user

export const logoutUserController = async (req, res) => {
    try {

        const userId = req.userId;

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        res.clearCookie("accessToken", cookiesOptions);
        res.clearCookie("refreshToken", cookiesOptions);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,
            {
                refresh_token: ""
            }
        )

        return res.status(200).json({
            message: "Logged out successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}