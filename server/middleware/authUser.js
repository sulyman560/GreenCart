import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Save user ID in a safe place on the request object
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authUser;
