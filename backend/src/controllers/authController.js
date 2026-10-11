import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'medibridge_super_secret_jwt_key_2026_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'medibridge_super_secret_refresh_key_2026';

const generateTokens = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, phone, address, role, organizationData } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required.',
        data: null,
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.',
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = ['USER', 'DONOR', 'PHARMACY', 'NGO', 'HOSPITAL'].includes(role) ? role : 'USER';
    const autoVerify = ['USER', 'DONOR'].includes(assignedRole);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: assignedRole,
        isVerified: autoVerify,
        profile: {
          create: {
            fullName,
            phone: phone || null,
            address: address || null,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Create organization profiles if applicable
    if (assignedRole === 'PHARMACY' && organizationData) {
      await prisma.pharmacy.create({
        data: {
          userId: user.id,
          name: organizationData.name || fullName,
          licenseNumber: organizationData.licenseNumber || 'LIC-' + Date.now(),
          address: organizationData.address || '123 Health St',
          city: organizationData.city || 'Metro',
          state: organizationData.state || 'State',
          zipCode: organizationData.zipCode || '10001',
          latitude: parseFloat(organizationData.latitude || 28.6139),
          longitude: parseFloat(organizationData.longitude || 77.2090),
          phone: phone || '555-0199',
          openingHours: '08:00 AM - 10:00 PM',
          isVerified: false,
        },
      });
    } else if (assignedRole === 'NGO' && organizationData) {
      await prisma.nGO.create({
        data: {
          userId: user.id,
          name: organizationData.name || fullName,
          registrationNumber: organizationData.registrationNumber || 'NGO-' + Date.now(),
          address: organizationData.address || '45 NGO Way',
          city: organizationData.city || 'Metro',
          state: organizationData.state || 'State',
          zipCode: organizationData.zipCode || '10001',
          latitude: parseFloat(organizationData.latitude || 28.6139),
          longitude: parseFloat(organizationData.longitude || 77.2090),
          phone: phone || '555-0198',
          contactPerson: fullName,
          isVerified: false,
        },
      });
    } else if (assignedRole === 'HOSPITAL' && organizationData) {
      await prisma.hospital.create({
        data: {
          userId: user.id,
          name: organizationData.name || fullName,
          registrationNumber: organizationData.registrationNumber || 'HOSP-' + Date.now(),
          address: organizationData.address || '789 Care Ave',
          city: organizationData.city || 'Metro',
          state: organizationData.state || 'State',
          zipCode: organizationData.zipCode || '10001',
          latitude: parseFloat(organizationData.latitude || 28.6139),
          longitude: parseFloat(organizationData.longitude || 77.2090),
          phone: phone || '555-0197',
          hospitalType: organizationData.hospitalType || 'GENERAL',
          isVerified: false,
        },
      });
    }

    const tokens = generateTokens(user);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        entity: 'User',
        entityId: user.id,
        metadataJson: JSON.stringify({ role: assignedRole }),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.profile?.fullName,
          isVerified: user.isVerified,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, phone, address } = req.body;

    if (!email || !password || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, phone number, and address are required.',
        data: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
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
        message: 'Invalid email or password.',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        data: null,
      });
    }

    // Persist or update user profile with verified phone and address from login
    if (user.profile) {
      await prisma.userProfile.update({
        where: { userId: user.id },
        data: {
          phone: phone.trim(),
          address: address.trim(),
        },
      });
      user.profile.phone = phone.trim();
      user.profile.address = address.trim();
    } else {
      user.profile = await prisma.userProfile.create({
        data: {
          userId: user.id,
          fullName: user.email.split('@')[0],
          phone: phone.trim(),
          address: address.trim(),
        },
      });
    }

    const tokens = generateTokens(user);

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
      },
    });

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.profile?.fullName,
          phone: user.profile?.phone,
          address: user.profile?.address,
          isVerified: user.isVerified,
          pharmacy: user.pharmacy,
          ngo: user.ngo,
          hospital: user.hospital,
        },
        tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    message: 'User profile retrieved.',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
        profile: req.user.profile,
        pharmacy: req.user.pharmacy,
        ngo: req.user.ngo,
        hospital: req.user.hospital,
      },
    },
  });
};
