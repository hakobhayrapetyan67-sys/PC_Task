const { PrismaClient } = require('../generated/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const createJob = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const newJob = await prisma.job.create({
      data: { title, description, price: parseFloat(price), providerId: req.user.userId }
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { provider: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

module.exports = { createJob, getJobs };