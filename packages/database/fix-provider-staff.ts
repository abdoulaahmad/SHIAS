import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find all provider users
  const providerUsers = await prisma.user.findMany({
    where: { role: 'PROVIDER', deletedAt: null }
  });
  console.log(`Found ${providerUsers.length} provider user(s):`);
  for (const u of providerUsers) {
    console.log(`  - ${u.id} | ${u.email} | ${u.role}`);
  }

  // Find all providers
  const providers = await prisma.provider.findMany({
    where: { deletedAt: null }
  });
  console.log(`\nFound ${providers.length} provider org(s):`);
  for (const p of providers) {
    console.log(`  - ${p.id} | ${p.name} | ${p.npi}`);
  }

  // Find existing staff links
  const existingStaff = await prisma.providerStaff.findMany();
  console.log(`\nExisting ProviderStaff links: ${existingStaff.length}`);
  for (const s of existingStaff) {
    console.log(`  - staffId=${s.id} | providerId=${s.providerId} | userId=${s.userId}`);
  }

  // For each provider user without a staff link, try to create one
  for (const u of providerUsers) {
    const hasLink = existingStaff.some(s => s.userId === u.id);
    if (!hasLink && providers.length > 0) {
      // Link to first provider (in a real system you'd match properly)
      const provider = providers[0];
      console.log(`\nCreating ProviderStaff link: user=${u.email} -> provider=${provider.name}`);
      await prisma.providerStaff.create({
        data: {
          providerId: provider.id,
          userId: u.id,
          role: 'ADMIN',
        }
      });
      console.log('  ✅ Created successfully!');
    } else if (hasLink) {
      console.log(`\nUser ${u.email} already has a staff link.`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
