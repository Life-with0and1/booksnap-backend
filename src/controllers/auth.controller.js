import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const genToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
}

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must have atleast 6 character." });
        }

        const existingUserByEmail = await userModel.findOne({ email });

        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already taken." });
        }

        const existingUserByUsername = await userModel.findOne({ username });

        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username already taken." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const defaultProfileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const createdUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            profileImage: defaultProfileImage
        });

        const token = genToken(createdUser._id);

        return res.status(200).json({
            token,
            user: {
                id: createdUser._id,
                username: createdUser.username,
                email: createdUser.email,
                profileImage: createdUser.profileImage
            }
        });
    } catch (error) {
        console.log("Error while creating user");
        return res.status(500).json({ message: "Server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = genToken(user._id);

        return return  res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.log("Error while login", error);
        return res.status(500).json({ message: "Server error" });
    }
}
