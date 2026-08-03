const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({where:{role:'PROVIDER',deletedAt:null}});
  console.log('Provider users:', JSON.stringify(users.map(u=>({id:u.id,email:u.email}))));
  
  const providers = await prisma.provider.findMany({where:{deletedAt:null}});
  console.log('Providers:', JSON.stringify(providers.map(p=>({id:p.id,name:p.name}))));
  
  const staff = await prisma.providerStaff.findMany();
  console.log('Staff links:', JSON.stringify(staff.map(s=>({id:s.id,providerId:s.providerId,userId:s.userId}))));
  
  for(const u of users) {
    const has = staff.some(s => s.userId === u.id);
    if(!has && providers.length > 0) {
      console.log('Creating link for', u.email);
      await prisma.providerStaff.create({data:{providerId:providers[0].id, userId:u.id, role:'ADMIN'}});
      console.log('Done!');
    } else {
      console.log(u.email, 'already linked or no provider');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
