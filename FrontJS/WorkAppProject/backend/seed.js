import bcrypt from 'bcryptjs';
import prisma from './lib/prisma.js';

const PASSWORD = 'Password123';

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 12);

  // --- employer (verified, so it can publish) ---
  const provider = await prisma.user.upsert({
    where: { email: 'provider@test.com' },
    update: {},
    create: {
      name: 'Tech Innovations LLC',
      email: 'provider@test.com',
      password: hash,
      role: 'PROVIDER',
      emailVerified: true,
      verificationStatus: 'VERIFIED',
      companyName: 'Tech Innovations LLC',
      companyWebsite: 'https://example.com',
      companySize: '50-200',
      companyAbout: 'Product studio building web and mobile products in Yerevan.',
      location: 'Yerevan',
      headline: 'Building products that matter',
    },
  });

  // --- second employer, not verified, to show the gate ---
  await prisma.user.upsert({
    where: { email: 'pending@test.com' },
    update: {},
    create: {
      name: 'Startup Garage',
      email: 'pending@test.com',
      password: hash,
      role: 'PROVIDER',
      emailVerified: true,
      verificationStatus: 'NONE',
      companyName: 'Startup Garage',
      location: 'Gyumri',
    },
  });

  // --- job seeker ---
  await prisma.user.upsert({
    where: { email: 'worker@test.com' },
    update: {},
    create: {
      name: 'Hakob Hayrapetyan',
      email: 'worker@test.com',
      password: hash,
      role: 'WORKER',
      emailVerified: true,
      location: 'Yerevan',
      headline: 'Frontend developer · React, TypeScript',
      bio: 'Three years building SPAs. Looking for a product team.',
      skills: 'React,TypeScript,CSS,Node.js',
    },
  });

  // --- admin, for reviewing verification requests ---
  await prisma.user.upsert({
    where: { email: 'admin@workx.local' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@workx.local',
      password: hash,
      role: 'PROVIDER',
      emailVerified: true,
      verificationStatus: 'VERIFIED',
      companyName: 'Workx Clone',
    },
  });

  const jobs = [
    {
      title: 'Senior React Developer',
      description:
        'We are looking for an experienced React developer to build a modern analytics dashboard. You will own the frontend architecture, work closely with design, and mentor two mid-level engineers.',
      category: 'IT', location: 'Yerevan', employmentType: 'FULL_TIME', workMode: 'HYBRID',
      experienceMin: 3, experienceMax: 6, salaryMin: 2200, salaryMax: 3000,
      skills: 'React,TypeScript,Zustand,REST',
    },
    {
      title: 'UI/UX Designer',
      description:
        'Design intuitive interfaces for our job portal platform. You will run discovery, build prototypes in Figma, and maintain the design system together with the frontend team.',
      category: 'DESIGN', location: 'Yerevan', employmentType: 'FULL_TIME', workMode: 'ONSITE',
      experienceMin: 2, experienceMax: 5, salaryMin: 1500, salaryMax: 2100,
      skills: 'Figma,Design systems,Prototyping',
    },
    {
      title: 'Node.js Backend Engineer',
      description:
        'Build robust REST APIs with Express and Prisma. You will design the data model, cover the critical paths with tests, and keep p95 latency under control as traffic grows.',
      category: 'IT', location: 'Remote', employmentType: 'CONTRACT', workMode: 'REMOTE',
      experienceMin: 2, salaryMin: 1800, salaryMax: 2600,
      skills: 'Node.js,Express,Prisma,SQL,JWT',
    },
    {
      title: 'DevOps Engineer',
      description:
        'Own our cloud infrastructure on AWS. Set up CI/CD pipelines, define infrastructure as code, and build the monitoring that tells us something broke before customers do.',
      category: 'IT', location: 'Yerevan', employmentType: 'FULL_TIME', workMode: 'REMOTE',
      experienceMin: 4, experienceMax: 8, salaryMin: 2800, salaryMax: 3800,
      skills: 'AWS,Terraform,Docker,CI/CD',
    },
    {
      title: 'Marketing Manager',
      description:
        'Lead performance marketing for an Armenian job platform. You will plan the channel mix, run experiments, and report on CAC and retention to the founding team every month.',
      category: 'MARKETING', location: 'Yerevan', employmentType: 'FULL_TIME', workMode: 'HYBRID',
      experienceMin: 3, salaryMin: 1400, salaryMax: 2000,
      skills: 'SEO,Google Ads,Analytics',
    },
    {
      title: 'Frontend Intern',
      description:
        'A paid six-month internship for someone who already builds small React projects. You will ship real features with a mentor reviewing every pull request.',
      category: 'IT', location: 'Yerevan', employmentType: 'INTERNSHIP', workMode: 'ONSITE',
      experienceMin: 0, experienceMax: 1, salaryMin: 500, salaryMax: 700,
      skills: 'HTML,CSS,JavaScript,React',
    },
  ];

  await prisma.application.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.job.deleteMany({});

  for (const job of jobs) {
    await prisma.job.create({ data: { ...job, providerId: provider.id } });
  }

  console.log('\nSeed complete.');
  console.log(`  ${jobs.length} jobs published by Tech Innovations LLC\n`);
  console.log('  Accounts (password for all: ' + PASSWORD + ')');
  console.log('    worker@test.com      WORKER   - email verified');
  console.log('    provider@test.com    PROVIDER - verified company, can publish');
  console.log('    pending@test.com     PROVIDER - NOT verified, shows the gate');
  console.log('    admin@workx.local    admin    - reviews verification requests\n');
}

main()
  .catch((e) => {
    console.error('[seed] failed:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
