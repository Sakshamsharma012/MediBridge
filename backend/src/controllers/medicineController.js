import { prisma } from '../config/db.js';
import { calculateDistance } from '../utils/locationUtils.js';

export const searchMedicines = async (req, res, next) => {
  try {
    const {
      query,
      category,
      prescriptionRequired,
      sourceType, // 'DONATION' | 'PHARMACY' | 'ALL'
      userLat,
      userLon,
      maxDistance = 50,
      page = 1,
      limit = 20,
    } = req.query;

    const whereClause = {};

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { genericName: { contains: query, mode: 'insensitive' } },
        { brandName: { contains: query, mode: 'insensitive' } },
        { activeIngredient: { contains: query, mode: 'insensitive' } },
        { manufacturer: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      whereClause.category = { equals: category, mode: 'insensitive' };
    }

    if (prescriptionRequired !== undefined && prescriptionRequired !== '') {
      whereClause.prescriptionRequired = prescriptionRequired === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where: whereClause,
        include: {
          batches: {
            where: {
              verificationStatus: 'VERIFIED',
              expiryDate: { gt: new Date() },
            },
            include: {
              donations: {
                where: { status: 'APPROVED' },
              },
              images: true,
            },
          },
          inventories: {
            where: { isAvailable: true },
            include: {
              pharmacy: true,
            },
          },
        },
        skip,
        take,
      }),
      prisma.medicine.count({ where: whereClause }),
    ]);

    // Format & calculate availability + location distance
    const formatted = medicines.map((med) => {
      const availableDonations = med.batches.flatMap((b) => b.donations);
      const donationStock = availableDonations.reduce((acc, d) => acc + d.quantity, 0);

      const pharmacyStock = med.inventories.reduce((acc, inv) => acc + inv.quantity, 0);

      // Distance calculation if userLat/userLon supplied
      let minDistance = null;
      if (userLat && userLon) {
        const distances = med.inventories
          .map((inv) => calculateDistance(parseFloat(userLat), parseFloat(userLon), inv.pharmacy.latitude, inv.pharmacy.longitude))
          .filter((d) => d !== null);

        if (distances.length > 0) {
          minDistance = Math.min(...distances);
        }
      }

      return {
        id: med.id,
        name: med.name,
        genericName: med.genericName,
        brandName: med.brandName,
        dosage: med.dosage,
        dosageForm: med.dosageForm,
        strength: med.strength,
        manufacturer: med.manufacturer,
        category: med.category,
        prescriptionRequired: med.prescriptionRequired,
        description: med.description,
        activeIngredient: med.activeIngredient,
        availability: {
          donatedCount: donationStock,
          pharmacyCount: pharmacyStock,
          totalAvailable: donationStock + pharmacyStock,
          isDonationAvailable: donationStock > 0,
          isPharmacyAvailable: pharmacyStock > 0,
        },
        minDistanceKm: minDistance,
        pharmacies: med.inventories.map((inv) => ({
          pharmacyId: inv.pharmacy.id,
          name: inv.pharmacy.name,
          price: inv.price,
          quantity: inv.quantity,
          address: `${inv.pharmacy.address}, ${inv.pharmacy.city}`,
          distanceKm: userLat && userLon ? calculateDistance(parseFloat(userLat), parseFloat(userLon), inv.pharmacy.latitude, inv.pharmacy.longitude) : null,
        })),
        images: med.batches.flatMap((b) => b.images).map((i) => i.imageUrl),
      };
    });

    res.json({
      success: true,
      message: 'Medicines search results.',
      data: {
        medicines: formatted,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMedicineById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: {
        batches: {
          include: {
            images: true,
            donations: {
              where: { status: 'APPROVED' },
            },
          },
        },
        inventories: {
          include: {
            pharmacy: true,
          },
        },
        genericAlternatives: true,
      },
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found.',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Medicine details retrieved.',
      data: { medicine },
    });
  } catch (error) {
    next(error);
  }
};
