-- CreateEnum
CREATE TYPE "public"."rol_usuario" AS ENUM ('admin', 'mecanico');

-- CreateEnum
CREATE TYPE "public"."estado_orden" AS ENUM ('ingresada', 'en_proceso', 'completada', 'cancelada');

-- CreateEnum
CREATE TYPE "public"."tipo_producto" AS ENUM ('repuesto', 'herramienta');

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "public"."rol_usuario" NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Motocicleta" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "año" INTEGER,
    "placa" TEXT,
    "vin" TEXT,
    "kilometraje" INTEGER DEFAULT 0,
    "color" TEXT,

    CONSTRAINT "Motocicleta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "public"."tipo_producto" NOT NULL,
    "precio_compra" DOUBLE PRECISION,
    "precio_venta" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 3,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrdenTrabajo" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "motocicletaId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_estimada" TIMESTAMP(3),
    "estado" "public"."estado_orden" NOT NULL DEFAULT 'ingresada',
    "problema" TEXT NOT NULL,
    "diagnostico" TEXT,
    "observaciones" TEXT,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "OrdenTrabajo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Servicio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "duracion_minutos" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiciosAplicados" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "servicioId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio" DOUBLE PRECISION,
    "observaciones" TEXT,

    CONSTRAINT "ServiciosAplicados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductoUtilizado" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DOUBLE PRECISION,
    "observaciones" TEXT,

    CONSTRAINT "ProductoUtilizado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "public"."Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Motocicleta_placa_key" ON "public"."Motocicleta"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenTrabajo_codigo_key" ON "public"."OrdenTrabajo"("codigo");

-- AddForeignKey
ALTER TABLE "public"."Motocicleta" ADD CONSTRAINT "Motocicleta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_motocicletaId_fkey" FOREIGN KEY ("motocicletaId") REFERENCES "public"."Motocicleta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrdenTrabajo" ADD CONSTRAINT "OrdenTrabajo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiciosAplicados" ADD CONSTRAINT "ServiciosAplicados_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "public"."OrdenTrabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiciosAplicados" ADD CONSTRAINT "ServiciosAplicados_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "public"."Servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductoUtilizado" ADD CONSTRAINT "ProductoUtilizado_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "public"."OrdenTrabajo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductoUtilizado" ADD CONSTRAINT "ProductoUtilizado_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
