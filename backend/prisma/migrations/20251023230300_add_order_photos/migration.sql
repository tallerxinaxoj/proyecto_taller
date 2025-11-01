/*
  Warnings:

  - A unique constraint covering the columns `[dpi]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable


-- CreateTable
CREATE TABLE "OrderPhoto" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Client_dpi_key" ON "Client"("dpi");

-- AddForeignKey
ALTER TABLE "OrderPhoto" ADD CONSTRAINT "OrderPhoto_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
