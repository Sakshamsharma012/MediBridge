import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected via Prisma successfully.');
  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
    console.log('⚠️ Ensure your PostgreSQL server is running and DATABASE_URL is correct in backend/.env');
  }
};
