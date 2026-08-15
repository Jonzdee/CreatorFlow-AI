import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {

    try {

        const { name, email, password, niche } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            niche
        });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                niche: user.niche,
                onboardingCompleted: user.onboardingCompleted
            }
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }

        const token = generateToken(user._id);
        
        res.status(200).json({

            success: true,

            token,

            user: {

                id: user._id,
                name: user.name,
                email: user.email,
                niche: user.niche,
                onboardingCompleted: user.onboardingCompleted,
            }

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

export const getMe = async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.status(200).json({
            success:true,
            user,
        })

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}