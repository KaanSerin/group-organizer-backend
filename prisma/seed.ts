import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  const dateNow = new Date();
  const admin = await prisma.userRoleType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'admin',
      isAdmin: true,
      isTest: false,
      createdAt: dateNow,
      updatedAt: dateNow,
    },
  });
  const normal = await prisma.userRoleType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'normal',
      isAdmin: false,
      isTest: false,
      createdAt: dateNow,
      updatedAt: dateNow,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      email: 'admin@mail.com',
      username: 'admin',
      password: await bcrypt.hash('chooseSomethingStrongerThanThis', 10),
      roleId: admin.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    },
  });
  await prisma.user.upsert({
    where: { email: 'normal@mail.com' },
    update: {},
    create: {
      email: 'normal@mail.com',
      username: 'normal',
      password: await bcrypt.hash('chooseSomethingStrongerThanThis', 10),
      roleId: normal.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    },
  });

  await prisma.groupRoleType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'group_owner',
      isAdmin: true,
      createdAt: dateNow,
      updatedAt: dateNow,
    },
  });
  await prisma.groupRoleType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'group_member',
      isAdmin: false,
      createdAt: dateNow,
      updatedAt: dateNow,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
