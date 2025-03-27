import jwt from "jsonwebtoken";
import userModal from "../models/user.model.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");


        if (!token) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModal.findById(decodedToken.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthentic user" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in middleware:", error);
    }
}

