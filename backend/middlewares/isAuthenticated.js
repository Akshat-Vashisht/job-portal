import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken) {
      res.status(401).json({
        message: "Invalid Token",
      });
    }

    req.id = decodedToken.userId;
    next();
  } catch (error) {
    console.error(error);
  }
};

export default isAuthenticated;
