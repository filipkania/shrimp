-- AlterTable
ALTER TABLE "User" ADD COLUMN     "srpClientPublicKey" CHAR(1024),
ADD COLUMN     "srpServerPrivateKey" CHAR(1024);
