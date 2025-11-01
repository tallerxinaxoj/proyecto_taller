import { Router } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { orderCreatedMessage, orderStatusMessage, sendWhatsApp } from '../notifications/whatsapp';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: true,
      motorcycle: true,
      items: { include: { product: true } },
      history: { orderBy: { createdAt: 'desc' } }
    }
  });
  res.json(orders);
});

router.post('/', async (req, res) => {
  const { clientId, client, motorcycle, description, items } = req.body || {};

  try {
    const cId = clientId || (await prisma.client.create({
      data: {
        name: client?.name,
        phone: client?.phone,
        whatsapp: client?.whatsapp,
        email: client?.email,
        address: client?.address
      }
    })).id;

    // Normalizar año a número opcional
    const rawYear = motorcycle?.year as any;
    let yearVal: number | undefined;
    if (rawYear !== undefined && rawYear !== null && rawYear !== '') {
      const n = Number(rawYear);
      if (!Number.isNaN(n)) yearVal = n;
    }

    const moto = await prisma.motorcycle.create({
      data: {
        clientId: cId,
        brand: motorcycle?.brand,
        model: motorcycle?.model,
        plate: motorcycle?.plate,
        vin: motorcycle?.vin,
        year: yearVal
      }
    });

    const created = await prisma.$transaction(async (tx) => {
      let totalParts = 0;
      const orderItems: Array<{ product: any; quantity: number; unitPrice: any }> = [];
      for (const it of (items || [])) {
        const product = await tx.product.findUnique({ where: { id: it.productId } });
        if (!product) throw new Error('Producto no existe');
        if (product.stock < it.quantity) throw new Error(`Stock insuficiente para ${product.name}`);
        totalParts += Number(product.price) * it.quantity;
        orderItems.push({ product, quantity: it.quantity, unitPrice: product.price });
      }

      const order = await tx.order.create({
        data: {
          code: 'TEMP',
          clientId: cId,
          motorcycleId: moto.id,
          description,
          status: OrderStatus.RECIBIDA,
          totalParts,
          totalLabor: 0
        }
      });

      const code = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${order.id}`;
      const updated = await tx.order.update({ where: { id: order.id }, data: { code } });

      for (const oi of orderItems) {
        await tx.orderItem.create({
          data: { orderId: updated.id, productId: oi.product.id, quantity: oi.quantity, unitPrice: oi.unitPrice }
        });
        await tx.product.update({ where: { id: oi.product.id }, data: { stock: oi.product.stock - oi.quantity } });
      }

      await tx.orderStatusHistory.create({ data: { orderId: updated.id, status: OrderStatus.RECIBIDA, note: 'Orden ingresada' } });
      return updated;
    });

    const cli = await prisma.client.findUnique({ where: { id: cId } });
    if (cli?.whatsapp) {
      await sendWhatsApp(cli.whatsapp, orderCreatedMessage(created.code));
    }

    const full = await prisma.order.findUnique({
      where: { id: created.id },
      include: { client: true, motorcycle: true, items: { include: { product: true } }, history: true }
    });

    res.status(201).json(full);
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'No se pudo crear la orden' });
  }
});

router.post('/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  const { status, note } = req.body || {};
  if (!status) return res.status(400).json({ error: 'status requerido' });
  if (!Object.keys(OrderStatus).includes(status)) return res.status(400).json({ error: 'status inválido' });

  try {
    const order = await prisma.order.update({ where: { id }, data: { status } });
    await prisma.orderStatusHistory.create({ data: { orderId: id, status, note } });

    const cli = await prisma.client.findUnique({ where: { id: order.clientId } });
    if (cli?.whatsapp) {
      await sendWhatsApp(cli.whatsapp, orderStatusMessage(order.code, status));
    }

    const full = await prisma.order.findUnique({
      where: { id },
      include: { client: true, motorcycle: true, items: { include: { product: true } }, history: { orderBy: { createdAt: 'desc' } } }
    });
    res.json(full);
  } catch {
    res.status(400).json({ error: 'No se pudo cambiar estado' });
  }
});

export default router;
