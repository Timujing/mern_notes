import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.notes_token;
    if (!token) return res.status(401).json({ message: 'unauthorized request' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(error); //we want to throw UnauthenticatedError?
    }
};

export default authMiddleware;