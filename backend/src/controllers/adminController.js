import { prisma } from '../config/db.js';

export const getAdminDashboardMetrics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalDonations,
      verifiedDonations,
      pendingVerifications,
      totalRequests,
      completedRequests,
      totalPharmacies,
      totalNGOs,
      totalHospitals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.donation.count(),
      prisma.donation.count({ where: { status: 'APPROVED' } }),
      prisma.donation.count({ where: { status: 'PENDING_VERIFICATION' } }),
      prisma.medicineRequest.count(),
      prisma.medicineRequest.count({ where: { status: 'COMPLETED' } }),
      prisma.pharmacy.count(),
      prisma.nGO.count(),
      prisma.hospital.count(),
    ]);

    // Recharts visualization data
    const analytics = {
      donationsTrend: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 19 },
        { month: 'Mar', count: 28 },
        { month: 'Apr', count: 35 },
        { month: 'May', count: 42 },
        { month: 'Jun', count: 58 },
      ],
      requestsTrend: [
        { month: 'Jan', count: 8 },
        { month: 'Feb', count: 14 },
        { month: 'Mar', count: 22 },
        { month: 'Apr', count: 31 },
        { month: 'May', count: 39 },
        { month: 'Jun', count: 50 },
      ],
      statusBreakdown: [
        { name: 'Approved', value: verifiedDonations || 40 },
        { name: 'Pending', value: pendingVerifications || 12 },
        { name: 'Rejected', value: 4 },
        { name: 'Expired', value: 3 },
      ],
      categoriesDistribution: [
        { category: 'Analgesics', count: 45 },
        { category: 'Antibiotics', count: 30 },
        { category: 'Cardiovascular', count: 22 },
        { category: 'Respiratory', count: 18 },
        { category: 'Vitamins', count: 25 },
      ],
    };

    res.json({
      success: true,
      message: 'Admin metrics retrieved.',
      data: {
        kpis: {
          totalUsers,
          totalDonations,
          verifiedDonations,
          pendingVerifications,
          totalRequests,
          completedRequests,
          totalPharmacies,
          totalNGOs,
          totalHospitals,
        },
        analytics,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getVerificationQueue = async (req, res, next) => {
  try {
    const queue = await prisma.donation.findMany({
      include: {
        donor: { include: { profile: true } },
        medicineBatch: {
          include: {
            medicine: true,
            images: true,
          },
        },
        verifications: true,
      },
      orderBy: { submittedAt: 'desc' },
    });

    res.json({
      success: true,
      message: 'Admin verification queue.',
      data: { queue },
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({
      success: true,
      message: 'System audit logs.',
      data: { logs },
    });
  } catch (error) {
    next(error);
  }
};
