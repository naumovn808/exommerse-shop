import jwt, { decode } from "jsonwebtoken"


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.header?.authorization?.split(" ")[1]  /// Bearer token

        if (!token) {
            return res.status(401).json({
                message: "You are not logged in. Please log in to cintinue",
                error: true,
                success: false
            })
        }

        const decoded = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized access!!!",
                error: true,
                success: false
            })
        }

        req.userId = decoded.id;

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        })
    }
}

export default authMiddleware