require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 0. Clean existing data
  await prisma.project.deleteMany();
  await prisma.systemConfig.deleteMany();
  await prisma.user.deleteMany();
  await prisma.companyProfile.deleteMany();
  console.log("🧹 Cleared existing data");

  // 1. Create company
  const company = await prisma.companyProfile.create({
    data: {
      name: "ProManager Inc.",
      email: "info@promanager.com",
      phone: "+1-312-555-0100",
    },
  });
  console.log(`✅ Company: ${company.name} (${company.id})`);

  // 2. Create system config for company
  await prisma.systemConfig.create({
    data: {
      companyId: company.id,
      construction_enabled: true,
    },
  });
  console.log("✅ System config created");

  // 3. Create admin user
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@promanager.com",
      password_hash: await bcrypt.hash("Admin@123", 12),
      role: "ADMIN",
      status: "ACTIVE",
      companyId: company.id,
    },
  });
  console.log(`✅ Admin: ${admin.email} (password: Admin@123)`);

  // 4. Create sample projects
  const projects = [
    {
      name: "Skyline Tower Expansion",
      status: "ACTIVE",
      budget: 2000000,
      location: "1200 Riverside Dr, Chicago",
      companyId: company.id,
    },
    {
      name: "Harbor Bridge Renovation",
      status: "PLANNING",
      budget: 850000,
      location: "Harbor District, Chicago",
      companyId: company.id,
    },
    {
      name: "Metro Station Redesign",
      status: "COMPLETED",
      budget: 1200000,
      location: "Downtown, Chicago",
      companyId: company.id,
    },
  ];

  for (const p of projects) {
    const project = await prisma.project.create({ data: p });
    console.log(`✅ Project: ${project.name} [${project.status}]`);
  }

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
