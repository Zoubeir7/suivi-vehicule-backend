import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const authorizeRole = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Acces denied. You are not authorized.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export { authenticateToken, authorizeRole };
