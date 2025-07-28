import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;

  if (!sellerToken) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (decoded.email === process.env.SELLER_EMAIL) {
        next();
    }else{
        res.status(401).json({ success: false, message: 'No token provided' });
    }
    //req.userId = decoded.id;

    
  } catch (error) {
    console.error("❌ JWT verification failed:", error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authSeller;
