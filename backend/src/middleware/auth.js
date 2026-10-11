import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing or invalid.',
        data: null,
        error: 'UNAUTHORIZED',
      });
    }

    const secret = process.env.JWT_SECRET || 'medibridge_super_secret_jwt_key_2026_change_in_production';
    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        profile: true,
        pharmacy: true,
        ngo: true,
        hospital: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
        data: null,
        error: 'USER_NOT_FOUND',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired authentication token.',
      data: null,
      error: 'FORBIDDEN',
    });
  }
};

export const requireRole = (roles = []) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        data: null,
        error: 'UNAUTHORIZED',
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: ${allowedRoles.join(', ')}`,
        data: null,
        error: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    next();
  };
};
