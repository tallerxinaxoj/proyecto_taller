import { Router } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

function parseDate(v?: string) {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

router.get('/orders', async (req, res) => {
  const { from, to, status } = req.query as any;
  const where: any = {};
  const fromD = parseDate(from);
  const toD = parseDate(to);
  if (fromD || toD) where.createdAt = { gte: fromD, lte: toD };
  if (status && Object.values(OrderStatus).includes(status)) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { client: true, motorcycle: true, items: { include: { product: true } } }
  });
  res.json(orders);
});

router.get('/orders.csv', async (req, res) => {
  const { from, to, status } = req.query as any;
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (status) params.set('status', status);
  const fromD = parseDate(from);
  const toD = parseDate(to);
  const where: any = {};
  if (fromD || toD) where.createdAt = { gte: fromD, lte: toD };
  if (status && Object.values(OrderStatus).includes(status)) where.status = status;

  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, include: { client: true, motorcycle: true } });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="reporte_ordenes.csv"');
  const header = 'Codigo,Fecha,Cliente,Telefono,WhatsApp,Marca,Modelo,Placa,Estado,Partes,ManoObra,Total,EntregaEsperada\n';
  const rows = orders.map(o => {
    const total = Number(o.totalParts) + Number(o.totalLabor);
    return [
      o.code,
      o.createdAt.toISOString(),
      o.client.name,
      o.client.phone,
      o.client.whatsapp,
      o.motorcycle.brand,
      o.motorcycle.model,
      o.motorcycle.plate,
      o.status,
      Number(o.totalParts),
      Number(o.totalLabor),
      total,
      o.expectedAt ? o.expectedAt.toISOString().slice(0,10) : ''
    ].map(v => typeof v === 'string' ? `"${v.replaceAll('"','""')}"` : v).join(',');
  }).join('\n');
  res.send(header + rows);
});

export default router;

