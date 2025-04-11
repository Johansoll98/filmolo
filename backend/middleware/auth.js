const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('--- Auth middleware START ---');

  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    console.log('No authHeader => 401');
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token);

  if (!token) {
    console.log('No token => 401');
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    // => { userId: "6432e5c36bf2a4c69c561fdb", iat: ..., exp: ... }
    req.user = { id: decoded.userId };
    console.log('req.user set to:', req.user);

    console.log('--- Auth middleware END ---\n');
    next();
  } catch (err) {
    console.log('JWT verify error => 401:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
