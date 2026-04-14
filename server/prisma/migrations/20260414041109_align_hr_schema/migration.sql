/*
  Warnings:

  - You are about to drop the column `address` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `company_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `assigneeId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `allowPublicShare` on the `system_configs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `system_configs` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `system_configs` table. All the data in the column will be lost.
  - You are about to drop the column `dateFormat` on the `system_configs` table. All the data in the column will be lost.
  - You are about to drop the column `maxProjects` on the `system_configs` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `system_configs` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `system_configs` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_createdById_fkey";

-- DropIndex
DROP INDEX "company_profiles_slug_key";

-- AlterTable
ALTER TABLE "company_profiles" DROP COLUMN "address",
DROP COLUMN "createdAt",
DROP COLUMN "industry",
DROP COLUMN "isActive",
DROP COLUMN "logo",
DROP COLUMN "slug",
DROP COLUMN "updatedAt",
DROP COLUMN "website";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "assigneeId",
DROP COLUMN "createdAt",
DROP COLUMN "createdById",
DROP COLUMN "description",
DROP COLUMN "endDate",
DROP COLUMN "priority",
DROP COLUMN "progress",
DROP COLUMN "startDate",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "system_configs" DROP COLUMN "allowPublicShare",
DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "dateFormat",
DROP COLUMN "maxProjects",
DROP COLUMN "timezone",
DROP COLUMN "updatedAt",
ADD COLUMN     "construction_enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "isActive",
DROP COLUMN "lastLogin",
DROP COLUMN "lastName",
DROP COLUMN "password",
DROP COLUMN "updatedAt",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "ProjectPriority";
