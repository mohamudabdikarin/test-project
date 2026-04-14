require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create company
  const company = await prisma.companyProfile.upsert({
    where: { slug: "promanager-inc" },
    update: {},
    create: {
      name: "ProManager Inc.",
      slug: "promanager-inc",
      industry: "Construction & Development",
      email: "info@promanager.com",
      website: "https://promanager.com",
      address: "1200 Riverside Dr, Chicago",
    },
  });
  console.log(`✅ Company: ${company.name} (${company.id})`);

  // 2. Create system config for company
  await prisma.systemConfig.upsert({
    where: { companyId: company.id },
    update: {},
    create: {
      companyId: company.id,
      timezone: "America/Chicago",
      currency: "USD",
      maxProjects: 100,
    },
  });
  console.log("✅ System config created");

  // 3. Create admin user
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@promanager.com" },
    update: {},
    create: {
      email: "admin@promanager.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      companyId: company.id,
    },
  });
  console.log(`✅ Admin: ${admin.email} (password: Admin@123)`);

  // 4. Create sample team members
  const members = [
    { email: "alex@promanager.com", firstName: "Alex", lastName: "Marston", role: "MANAGER" },
    { email: "sarah@promanager.com", firstName: "Sarah", lastName: "Richardson", role: "MEMBER" },
    { email: "james@promanager.com", firstName: "James", lastName: "Lowery", role: "MEMBER" },
  ];

  for (const m of members) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        ...m,
        password: await bcrypt.hash("Member@123", 12),
        companyId: company.id,
      },
    });
    console.log(`✅ User: ${user.email} (${user.role})`);
  }

  // 5. Create sample projects (matching Figma design)
  const alex = await prisma.user.findUnique({ where: { email: "alex@promanager.com" } });
  const sarah = await prisma.user.findUnique({ where: { email: "sarah@promanager.com" } });
  const james = await prisma.user.findUnique({ where: { email: "james@promanager.com" } });

  const projects = [
    {
      name: "Skyline Tower Expansion",
      description: "A cornerstone development aiming to increase the vertical footprint of the downtown tech corridor. This project involves the integration of sustainable vertical gardens, advanced smart-grid energy management, and a new observation deck.",
      status: "ACTIVE",
      priority: "HIGH",
      budget: 2000000,
      startDate: new Date("2025-10-12"),
      endDate: new Date("2026-06-28"),
      progress: 65,
      location: "1200 Riverside Dr, Chicago",
      createdById: admin.id,
      assigneeId: alex.id,
      companyId: company.id,
    },
    {
      name: "Harbor Bridge Renovation",
      description: "Structural reinforcement and aesthetic upgrade of the city's main harbor bridge.",
      status: "PLANNING",
      priority: "MEDIUM",
      budget: 850000,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-12-15"),
      progress: 10,
      location: "Harbor District, Chicago",
      createdById: admin.id,
      assigneeId: sarah.id,
      companyId: company.id,
    },
    {
      name: "Metro Station Redesign",
      description: "Complete interior redesign of 3 downtown metro stations with modern accessibility features.",
      status: "COMPLETED",
      priority: "HIGH",
      budget: 1200000,
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-09-30"),
      progress: 100,
      location: "Downtown, Chicago",
      createdById: admin.id,
      assigneeId: james.id,
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
