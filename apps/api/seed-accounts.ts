import { registerProviderUseCase, userRepository, passwordHasher } from './src/infrastructure/di/container';
import { randomUUID } from 'crypto';

async function main() {
  console.log('Seeding accounts...');
  
  // 1. Create a Provider
  try {
    await registerProviderUseCase.execute({
      providerId: randomUUID(),
      userId: randomUUID(),
      npi: '1234567890',
      providerName: 'City Hospital',
      type: 'HOSPITAL',
      userName: 'Dr. John Doe',
      email: 'provider@shias.com',
      password: 'password123'
    });
    console.log('✅ Provider created: provider@shias.com / password123');
  } catch (e: any) {
    console.log('⚠️ Provider might already exist:', e.message);
  }

  // 2. Create an Admin
  try {
    const existing = await userRepository.findByEmail('admin@shias.com');
    if (!existing) {
      const hash = await passwordHasher.hash('password123');
      // Create user directly using the Prisma database instance
      // because the Identity models might enforce strict type checking that we want to bypass for the seed
      const { prisma } = require('@shias/database');
      await prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'admin@shias.com',
          name: 'System Admin',
          password: hash,
          role: 'ADMIN'
        }
      });
      console.log('✅ Admin created: admin@shias.com / password123');
    } else {
      console.log('⚠️ Admin already exists');
    }
  } catch (e: any) {
    console.log('❌ Admin creation failed:', e.message);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
