const { PrismaClient } = require('./generated/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const provider = await prisma.user.upsert({
    where: { email: 'provider@test.com' },
    update: {},
    create: {
      name: 'Tech Innovations LLC',
      email: 'provider@test.com',
      password: password,
      role: 'PROVIDER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'worker@test.com' },
    update: {},
    create: {
      name: 'Hakob Hayrapetyan',
      email: 'worker@test.com',
      password: password,
      role: 'WORKER',
    },
  });

  const jobs = [
    {
      title: 'Senior React Developer',
      description: 'Looking for an experienced React developer to build a modern dashboard using Zustand and Tailwind.',
      price: 2500,
      providerId: provider.id,
    },
    {
      title: 'UI/UX Designer',
      description: 'Design intuitive and beautiful interfaces for our new job portal platform. Experience with Figma is a must.',
      price: 1800,
      providerId: provider.id,
    },
    {
      title: 'Node.js Backend Engineer',
      description: 'Build robust REST APIs using Express and Prisma. Knowledge of JWT and SQLite/PostgreSQL is required.',
      price: 2200,
      providerId: provider.id,
    },
    {
      title: 'DevOps Engineer',
      description: 'Manage our cloud infrastructure on AWS. Set up CI/CD pipelines and monitor server health.',
      price: 3000,
      providerId: provider.id,
    }
  ];

  await prisma.job.deleteMany({});
  
  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });