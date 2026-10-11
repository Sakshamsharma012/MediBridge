import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MediBridge Database...');

  // Clean existing tables in order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.pharmacyInventory.deleteMany();
  await prisma.requestItem.deleteMany();
  await prisma.medicineRequest.deleteMany();
  await prisma.donationVerification.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.medicineImage.deleteMany();
  await prisma.medicineBatch.deleteMany();
  await prisma.genericAlternative.deleteMany();
  await prisma.firstAidContent.deleteMany();
  await prisma.selfCareContent.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.nGO.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@medibridge.org',
      password: defaultPassword,
      role: 'ADMIN',
      isVerified: true,
      profile: {
        create: {
          fullName: 'Chief Verification Officer',
          phone: '+1-555-0100',
          address: '100 Healthcare HQ Blvd',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10001',
          latitude: 28.6139,
          longitude: 77.2090,
        },
      },
    },
  });

  // 2. Create Donor User
  const donorUser = await prisma.user.create({
    data: {
      email: 'donor@medibridge.org',
      password: defaultPassword,
      role: 'DONOR',
      isVerified: true,
      profile: {
        create: {
          fullName: 'Jane Doe (Medicine Donor)',
          phone: '+1-555-0101',
          address: '12 Green Park Avenue',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10002',
          latitude: 28.6200,
          longitude: 77.2100,
        },
      },
    },
  });

  // 3. Create Normal Seeker User
  const normalUser = await prisma.user.create({
    data: {
      email: 'user@medibridge.org',
      password: defaultPassword,
      role: 'USER',
      isVerified: true,
      profile: {
        create: {
          fullName: 'John Smith (Recipient)',
          phone: '+1-555-0102',
          address: '45 Sunset Colony',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10003',
          latitude: 28.6100,
          longitude: 77.2150,
        },
      },
    },
  });

  // 4. Create 3 Pharmacies
  const pharmacy1User = await prisma.user.create({
    data: {
      email: 'pharmacy@medibridge.org',
      password: defaultPassword,
      role: 'PHARMACY',
      isVerified: true,
      profile: { create: { fullName: 'CityCare Pharmacy Admin' } },
      pharmacy: {
        create: {
          name: 'CityCare Pharmacy & Wellness',
          licenseNumber: 'PHARM-2026-001',
          address: '88 Commercial Street',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10001',
          latitude: 28.6150,
          longitude: 77.2080,
          phone: '+1-555-0103',
          isVerified: true,
          openingHours: '08:00 AM - 10:00 PM',
        },
      },
    },
    include: { pharmacy: true },
  });

  const pharmacy2User = await prisma.user.create({
    data: {
      email: 'apollo@medibridge.org',
      password: defaultPassword,
      role: 'PHARMACY',
      isVerified: true,
      profile: { create: { fullName: 'Apollo Pharmacy Admin' } },
      pharmacy: {
        create: {
          name: 'Apollo Super Pharmacy',
          licenseNumber: 'PHARM-2026-002',
          address: '104 Ring Road',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10004',
          latitude: 28.6300,
          longitude: 77.2200,
          phone: '+1-555-0104',
          isVerified: true,
          openingHours: '24 Hours',
        },
      },
    },
    include: { pharmacy: true },
  });

  const pharmacy3User = await prisma.user.create({
    data: {
      email: 'medplus@medibridge.org',
      password: defaultPassword,
      role: 'PHARMACY',
      isVerified: true,
      profile: { create: { fullName: 'MedPlus Express Manager' } },
      pharmacy: {
        create: {
          name: 'MedPlus Express Pharmacy',
          licenseNumber: 'PHARM-2026-003',
          address: '22 South Market',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10005',
          latitude: 28.6050,
          longitude: 77.1950,
          phone: '+1-555-0105',
          isVerified: true,
          openingHours: '09:00 AM - 09:00 PM',
        },
      },
    },
    include: { pharmacy: true },
  });

  // 5. Create 3 NGOs
  const ngo1User = await prisma.user.create({
    data: {
      email: 'ngo@medibridge.org',
      password: defaultPassword,
      role: 'NGO',
      isVerified: true,
      profile: { create: { fullName: 'HealthForRefugees NGO Lead' } },
      ngo: {
        create: {
          name: 'HealthForRefugees Global NGO',
          registrationNumber: 'NGO-REG-991',
          address: '50 NGO Complex',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10001',
          latitude: 28.6180,
          longitude: 77.2120,
          phone: '+1-555-0106',
          contactPerson: 'Sarah Jenkins',
          isVerified: true,
        },
      },
    },
    include: { ngo: true },
  });

  const ngo2User = await prisma.user.create({
    data: {
      email: 'redcross@medibridge.org',
      password: defaultPassword,
      role: 'NGO',
      isVerified: true,
      profile: { create: { fullName: 'Red Cross Relief Coordinator' } },
      ngo: {
        create: {
          name: 'Red Cross Community Care',
          registrationNumber: 'NGO-REG-992',
          address: '15 Humanitarian Way',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10006',
          latitude: 28.6250,
          longitude: 77.2050,
          phone: '+1-555-0107',
          contactPerson: 'David Miller',
          isVerified: true,
        },
      },
    },
    include: { ngo: true },
  });

  const ngo3User = await prisma.user.create({
    data: {
      email: 'carefoundation@medibridge.org',
      password: defaultPassword,
      role: 'NGO',
      isVerified: true,
      profile: { create: { fullName: 'Care Foundation Rep' } },
      ngo: {
        create: {
          name: 'Care Foundation India',
          registrationNumber: 'NGO-REG-993',
          address: '77 Hope Street',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10007',
          latitude: 28.5950,
          longitude: 77.2250,
          phone: '+1-555-0108',
          contactPerson: 'Anita Roy',
          isVerified: true,
        },
      },
    },
    include: { ngo: true },
  });

  // 6. Create 2 Hospitals
  const hospital1User = await prisma.user.create({
    data: {
      email: 'hospital@medibridge.org',
      password: defaultPassword,
      role: 'HOSPITAL',
      isVerified: true,
      profile: { create: { fullName: 'St. Jude General Hospital Procurement' } },
      hospital: {
        create: {
          name: 'St. Jude General Hospital',
          registrationNumber: 'HOSP-REG-501',
          address: '200 Medical Enclave',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10001',
          latitude: 28.6220,
          longitude: 77.2180,
          phone: '+1-555-0109',
          hospitalType: 'GENERAL',
          isVerified: true,
        },
      },
    },
    include: { hospital: true },
  });

  const hospital2User = await prisma.user.create({
    data: {
      email: 'citycarehospital@medibridge.org',
      password: defaultPassword,
      role: 'HOSPITAL',
      isVerified: true,
      profile: { create: { fullName: 'Metro SuperSpecialty Hospital' } },
      hospital: {
        create: {
          name: 'Metro SuperSpecialty Hospital',
          registrationNumber: 'HOSP-REG-502',
          address: '350 Outer Ring Rd',
          city: 'Metro City',
          state: 'State Central',
          zipCode: '10008',
          latitude: 28.6400,
          longitude: 77.2300,
          phone: '+1-555-0110',
          hospitalType: 'SPECIALTY',
          isVerified: true,
        },
      },
    },
    include: { hospital: true },
  });

  // 7. Seed 30+ Master Medicines
  const medicinesData = [
    { name: 'Paracetamol', genericName: 'Paracetamol', brandName: 'Crocin / Calpol', dosage: '500mg', dosageForm: 'Tablet', strength: '500 mg', manufacturer: 'GSK Healthcare', category: 'Analgesics', prescriptionRequired: false, activeIngredient: 'Paracetamol', description: 'Pain relief and fever reduction.' },
    { name: 'Amoxicillin', genericName: 'Amoxicillin', brandName: 'Mox 500', dosage: '500mg', dosageForm: 'Capsule', strength: '500 mg', manufacturer: 'Cipla Ltd', category: 'Antibiotics', prescriptionRequired: true, activeIngredient: 'Amoxicillin', description: 'Penicillin-type antibiotic for bacterial infections.' },
    { name: 'Metformin HCl', genericName: 'Metformin', brandName: 'Glycomet 500', dosage: '500mg', dosageForm: 'Tablet', strength: '500 mg', manufacturer: 'USV Ltd', category: 'Antidiabetic', prescriptionRequired: true, activeIngredient: 'Metformin', description: 'First-line medication for type 2 diabetes.' },
    { name: 'Cetirizine', genericName: 'Cetirizine', brandName: 'Cetzine', dosage: '10mg', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Dr Reddy Labs', category: 'Antihistamines', prescriptionRequired: false, activeIngredient: 'Cetirizine', description: 'Relief of allergy symptoms and hay fever.' },
    { name: 'Ibuprofen', genericName: 'Ibuprofen', brandName: 'Brufen 400', dosage: '400mg', dosageForm: 'Tablet', strength: '400 mg', manufacturer: 'Abbott', category: 'Analgesics', prescriptionRequired: false, activeIngredient: 'Ibuprofen', description: 'Nonsteroidal anti-inflammatory drug (NSAID).' },
    { name: 'Azithromycin', genericName: 'Azithromycin', brandName: 'Azee 500', dosage: '500mg', dosageForm: 'Tablet', strength: '500 mg', manufacturer: 'Cipla Ltd', category: 'Antibiotics', prescriptionRequired: true, activeIngredient: 'Azithromycin', description: 'Macrolide antibiotic for respiratory & skin infections.' },
    { name: 'Omeprazole', genericName: 'Omeprazole', brandName: 'Omez 20', dosage: '20mg', dosageForm: 'Capsule', strength: '20 mg', manufacturer: 'Dr Reddy Labs', category: 'Gastrointestinal', prescriptionRequired: false, activeIngredient: 'Omeprazole', description: 'Proton pump inhibitor reducing stomach acid.' },
    { name: 'Atorvastatin', genericName: 'Atorvastatin', brandName: 'Atorva 10', dosage: '10mg', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Zydus Cadila', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Atorvastatin', description: 'Statin medication to lower high cholesterol.' },
    { name: 'Losartan Potassium', genericName: 'Losartan', brandName: 'Repace 50', dosage: '50mg', dosageForm: 'Tablet', strength: '50 mg', manufacturer: 'Sun Pharma', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Losartan', description: 'Angiotensin II receptor blocker for hypertension.' },
    { name: 'Salbutamol Inhaler', genericName: 'Salbutamol', brandName: 'Asthalin Inhaler', dosage: '100mcg', dosageForm: 'Inhaler', strength: '100 mcg', manufacturer: 'Cipla Ltd', category: 'Respiratory', prescriptionRequired: true, activeIngredient: 'Salbutamol', description: 'Bronchodilator for quick relief of asthma symptoms.' },
    { name: 'Pantoprazole', genericName: 'Pantoprazole', brandName: 'Pan 40', dosage: '40mg', dosageForm: 'Tablet', strength: '40 mg', manufacturer: 'Alkem Labs', category: 'Gastrointestinal', prescriptionRequired: false, activeIngredient: 'Pantoprazole', description: 'Reduces stomach acid for GERD and acid reflux.' },
    { name: 'Amlodipine Besylate', genericName: 'Amlodipine', brandName: 'Amlokind 5', dosage: '5mg', dosageForm: 'Tablet', strength: '5 mg', manufacturer: 'Mankind Pharma', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Amlodipine', description: 'Calcium channel blocker for high blood pressure.' },
    { name: 'Montelukast', genericName: 'Montelukast', brandName: 'Montair 10', dosage: '10mg', dosageForm: 'Tablet', strength: '10 mg', manufacturer: 'Cipla Ltd', category: 'Respiratory', prescriptionRequired: true, activeIngredient: 'Montelukast', description: 'Leukotriene receptor antagonist for asthma and allergies.' },
    { name: 'Levocetirizine', genericName: 'Levocetirizine', brandName: 'Lvocet 5', dosage: '5mg', dosageForm: 'Tablet', strength: '5 mg', manufacturer: 'Sun Pharma', category: 'Antihistamines', prescriptionRequired: false, activeIngredient: 'Levocetirizine', description: 'Non-drowsy antihistamine for rhinitis and hives.' },
    { name: 'Vitamin C & Zinc', genericName: 'Ascorbic Acid + Zinc', brandName: 'Limcee Chewable', dosage: '500mg', dosageForm: 'Chewable Tablet', strength: '500 mg', manufacturer: 'Abbott', category: 'Vitamins & Supplements', prescriptionRequired: false, activeIngredient: 'Ascorbic Acid', description: 'Immune support supplement.' },
    { name: 'Dextromethorphan Syrup', genericName: 'Dextromethorphan', brandName: 'Benadryl Cough', dosage: '100ml', dosageForm: 'Syrup', strength: '15 mg / 5 ml', manufacturer: 'Johnson & Johnson', category: 'Cold & Cough', prescriptionRequired: false, activeIngredient: 'Dextromethorphan', description: 'Cough suppressant for dry cough.' },
    { name: 'Ciprofloxacin', genericName: 'Ciprofloxacin', brandName: 'Ciplox 500', dosage: '500mg', dosageForm: 'Tablet', strength: '500 mg', manufacturer: 'Cipla Ltd', category: 'Antibiotics', prescriptionRequired: true, activeIngredient: 'Ciprofloxacin', description: 'Fluoroquinolone antibiotic.' },
    { name: 'Doxycycline', genericName: 'Doxycycline', brandName: 'Microdox 100', dosage: '100mg', dosageForm: 'Capsule', strength: '100 mg', manufacturer: 'Micro Labs', category: 'Antibiotics', prescriptionRequired: true, activeIngredient: 'Doxycycline', description: 'Tetracycline antibiotic for skin and respiratory infections.' },
    { name: 'Furosemide', genericName: 'Furosemide', brandName: 'Lasix 40', dosage: '40mg', dosageForm: 'Tablet', strength: '40 mg', manufacturer: 'Sanofi', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Furosemide', description: 'Loop diuretic used to treat edema and high blood pressure.' },
    { name: 'Metoprolol Succinate', genericName: 'Metoprolol', brandName: 'Betaloc 50', dosage: '50mg', dosageForm: 'Tablet', strength: '50 mg', manufacturer: 'AstraZeneca', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Metoprolol', description: 'Beta-blocker for angina and hypertension.' },
    { name: 'Telmisartan', genericName: 'Telmisartan', brandName: 'Telma 40', dosage: '40mg', dosageForm: 'Tablet', strength: '40 mg', manufacturer: 'Glenmark', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Telmisartan', description: 'Angiotensin blocker for high blood pressure.' },
    { name: 'Hydrochlorothiazide', genericName: 'Hydrochlorothiazide', brandName: 'Aquazide 12.5', dosage: '12.5mg', dosageForm: 'Tablet', strength: '12.5 mg', manufacturer: 'Sun Pharma', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Hydrochlorothiazide', description: 'Thiazide diuretic.' },
    { name: 'Ondansetron', genericName: 'Ondansetron', brandName: 'Emeset 4', dosage: '4mg', dosageForm: 'Tablet', strength: '4 mg', manufacturer: 'Cipla Ltd', category: 'Gastrointestinal', prescriptionRequired: true, activeIngredient: 'Ondansetron', description: 'Prevents nausea and vomiting.' },
    { name: 'Spironolactone', genericName: 'Spironolactone', brandName: 'Aldactone 25', dosage: '25mg', dosageForm: 'Tablet', strength: '25 mg', manufacturer: 'RPG Life', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Spironolactone', description: 'Potassium-sparing diuretic.' },
    { name: 'Glimepiride', genericName: 'Glimepiride', brandName: 'Amaryl 2', dosage: '2mg', dosageForm: 'Tablet', strength: '2 mg', manufacturer: 'Sanofi', category: 'Antidiabetic', prescriptionRequired: true, activeIngredient: 'Glimepiride', description: 'Sulfonylurea antidiabetic medication.' },
    { name: 'Sitagliptin', genericName: 'Sitagliptin', brandName: 'Januvia 100', dosage: '100mg', dosageForm: 'Tablet', strength: '100 mg', manufacturer: 'MSD Pharma', category: 'Antidiabetic', prescriptionRequired: true, activeIngredient: 'Sitagliptin', description: 'DPP-4 inhibitor for type 2 diabetes.' },
    { name: 'Clopidogrel', genericName: 'Clopidogrel', brandName: 'Clopivas 75', dosage: '75mg', dosageForm: 'Tablet', strength: '75 mg', manufacturer: 'Cipla Ltd', category: 'Cardiovascular', prescriptionRequired: true, activeIngredient: 'Clopidogrel', description: 'Antiplatelet medication preventing blood clots.' },
    { name: 'Aspirin', genericName: 'Aspirin', brandName: 'Ecosprin 75', dosage: '75mg', dosageForm: 'Tablet', strength: '75 mg', manufacturer: 'USV Ltd', category: 'Cardiovascular', prescriptionRequired: false, activeIngredient: 'Aspirin', description: 'Blood thinner and pain reliever.' },
    { name: 'Multivitamin Complex', genericName: 'Multivitamin', brandName: 'Becosules Z', dosage: 'Capsule', dosageForm: 'Capsule', strength: '1 Capsule', manufacturer: 'Pfizer', category: 'Vitamins & Supplements', prescriptionRequired: false, activeIngredient: 'Multivitamin', description: 'B-complex and vitamin daily supplement.' },
    { name: 'Oral Rehydration Salt', genericName: 'ORS Electrolytes', brandName: 'Electral Powder', dosage: '21.8g', dosageForm: 'Sachet', strength: '21.8 g', manufacturer: 'FDC Ltd', category: 'Rehydration', prescriptionRequired: false, activeIngredient: 'Sodium Chloride + Dextrose', description: 'WHO formula oral rehydration salt for dehydration.' },
  ];

  const createdMedicines = [];
  for (const mData of medicinesData) {
    const med = await prisma.medicine.create({ data: mData });
    createdMedicines.push(med);
  }

  // 8. Seed Generic Alternatives
  const paracetamol = createdMedicines.find((m) => m.name === 'Paracetamol');
  if (paracetamol) {
    await prisma.genericAlternative.create({
      data: {
        originalMedicineId: paracetamol.id,
        genericName: 'Paracetamol',
        activeIngredient: 'Paracetamol',
        strength: '500 mg',
        dosageForm: 'Tablet',
        manufacturer: 'Generic Pharma Lab',
        prescriptionStatus: 'OTC',
        notes: 'Identical chemical composition and dissolution profile.',
        similarityScore: 0.99,
      },
    });
  }

  // 9. Seed Batches & Donations
  const futureExpiry = new Date();
  futureExpiry.setFullYear(futureExpiry.getFullYear() + 2);

  const batch1 = await prisma.medicineBatch.create({
    data: {
      medicineId: createdMedicines[0].id, // Paracetamol
      batchNumber: 'BATCH-PAR-2026',
      expiryDate: futureExpiry,
      barcode: '8901087001122',
      verificationStatus: 'VERIFIED',
      images: {
        create: {
          imageUrl: '/uploads/paracetamol-sample.jpg',
          originalFilename: 'paracetamol.jpg',
        },
      },
    },
  });

  const donation1 = await prisma.donation.create({
    data: {
      donorId: donorUser.id,
      medicineBatchId: batch1.id,
      quantity: 50,
      condition: 'Sealed',
      storageCondition: 'Cool & dry place',
      status: 'APPROVED',
      verificationReason: 'OCR, Barcode & Expiry date auto-verified by Admin.',
      approvedById: admin.id,
      approvedAt: new Date(),
      verifications: {
        create: {
          ocrDataJson: JSON.stringify({
            rawText: 'Paracetamol 500mg Batch BATCH-PAR-2026 Exp 12/2028',
            confidence: 0.95,
          }),
          barcodeScanned: '8901087001122',
          confidenceScore: 0.95,
          status: 'VERIFIED',
          notes: 'High confidence match',
        },
      },
    },
  });

  // 10. Seed Pharmacy Inventories
  if (pharmacy1User.pharmacy) {
    await prisma.pharmacyInventory.create({
      data: {
        pharmacyId: pharmacy1User.pharmacy.id,
        medicineId: createdMedicines[0].id,
        batchNumber: 'BATCH-PAR-9988',
        expiryDate: futureExpiry,
        quantity: 200,
        price: 4.5,
        isAvailable: true,
      },
    });
    await prisma.pharmacyInventory.create({
      data: {
        pharmacyId: pharmacy1User.pharmacy.id,
        medicineId: createdMedicines[1].id, // Amoxicillin
        batchNumber: 'BATCH-AMX-5511',
        expiryDate: futureExpiry,
        quantity: 80,
        price: 12.0,
        prescriptionRequired: true,
        isAvailable: true,
      },
    });
  }

  // 11. Seed First-Aid Articles
  await prisma.firstAidContent.createMany({
    data: [
      {
        title: 'First-Aid for Minor Cuts and Scrapes',
        category: 'Minor Cuts',
        summary: 'Step-by-step guidance for cleaning and dressing minor skin cuts.',
        stepsJson: JSON.stringify([
          'Wash hands thoroughly with soap and warm water.',
          'Apply gentle pressure with a clean cloth to stop minor bleeding.',
          'Rinse the cut under cool running water to clear dirt and debris.',
          'Apply an over-the-counter antiseptic ointment.',
          'Cover with a sterile bandage or gauze dressing.',
        ]),
        avoidJson: JSON.stringify([
          'Do not apply harsh chemicals like pure alcohol or iodine directly into deep wounds.',
          'Do not pick at scabs during healing.',
        ]),
        whenToSeekHelp: 'Seek medical care if bleeding does not stop after 10 minutes of direct pressure, or if cut is deep/gaping.',
        emergencySigns: 'High fever, red streaks spreading from wound, severe throbbing pain, or pus formation.',
        published: true,
      },
      {
        title: 'Emergency First-Aid for Minor Burns',
        category: 'Burns',
        summary: 'Immediate care for minor first-degree thermal burns.',
        stepsJson: JSON.stringify([
          'Cool the burn immediately under cool (not ice cold) running water for 10-15 minutes.',
          'Remove tight rings or clothing near the burn before swelling occurs.',
          'Cover loosely with a clean, sterile, non-stick bandage.',
          'Take over-the-counter pain reliever like Paracetamol if needed.',
        ]),
        avoidJson: JSON.stringify([
          'Do NOT apply ice directly to burns, which can damage tissue.',
          'Do NOT break blisters.',
          'Do NOT apply butter, oil, or toothpastes to burns.',
        ]),
        whenToSeekHelp: 'Seek emergency care for burns covering large areas, facial burns, chemical/electrical burns, or third-degree burns.',
        emergencySigns: 'Charred skin, white painless patches, or severe blister weeping.',
        published: true,
      },
      {
        title: 'Fever Management & Hydration Basics',
        category: 'Fever',
        summary: 'General supportive care for mild fever in adults.',
        stepsJson: JSON.stringify([
          'Rest in a cool, well-ventilated room.',
          'Drink plenty of fluids (water, clear broths, oral rehydration solutions).',
          'Use light clothing and a thin blanket.',
          'Take recommended fever reducer (e.g. Paracetamol 500mg) as directed.',
        ]),
        avoidJson: JSON.stringify(['Do not take cold baths or ice rubs, which cause shivering.']),
        whenToSeekHelp: 'Consult a doctor if fever exceeds 103°F (39.4°C) or lasts longer than 3 days.',
        emergencySigns: 'Difficulty breathing, severe stiff neck, confusion, chest pain, or seizure.',
        published: true,
      },
    ],
  });

  // 12. Seed Natural Self-Care Content
  await prisma.selfCareContent.createMany({
    data: [
      {
        title: 'Optimal Hydration & Electrolyte Balance',
        category: 'Hydration',
        summary: 'Importance of maintaining proper fluid intake during illness or warm weather.',
        tipsJson: JSON.stringify([
          'Drink 8-10 glasses of water daily.',
          'Include natural electrolyte drinks such as coconut water or lemon water with a pinch of salt.',
          'Monitor urine color; pale straw color indicates healthy hydration.',
        ]),
        precautionsJson: JSON.stringify([
          'Avoid excessive sugary energy drinks or caffeinated beverages during recovery.',
        ]),
        published: true,
      },
      {
        title: 'Rest & Immune System Recovery',
        category: 'Sleep & Rest',
        summary: 'How sleep supports cellular repair and immune defense.',
        tipsJson: JSON.stringify([
          'Aim for 7-9 hours of uninterrupted sleep every night.',
          'Maintain a dark, quiet, and cool bedroom environment.',
          'Avoid screens 30 minutes before bedtime.',
        ]),
        precautionsJson: JSON.stringify([
          'Persistent fatigue despite sleep should be evaluated by a healthcare professional.',
        ]),
        published: true,
      },
    ],
  });

  console.log('✅ Database Seeded Successfully!');
  console.log('\n================ DEMO ACCOUNTS ===============');
  console.log('Role       | Email                      | Password');
  console.log('----------------------------------------------------');
  console.log('ADMIN      | admin@medibridge.org       | Password123!');
  console.log('DONOR      | donor@medibridge.org       | Password123!');
  console.log('USER       | user@medibridge.org        | Password123!');
  console.log('PHARMACY   | pharmacy@medibridge.org    | Password123!');
  console.log('NGO        | ngo@medibridge.org         | Password123!');
  console.log('HOSPITAL   | hospital@medibridge.org    | Password123!');
  console.log('==============================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
