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
  const esc = (v: any) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string') return `"${v.replace(/"/g, '""')}"`;
    return String(v);
  };
  const rows = orders.map(o => {
    const total = Number(o.totalParts) + Number(o.totalLabor);
    return [
      esc(o.code),
      esc(o.createdAt.toISOString()),
      esc(o.client.name),
      esc(o.client.phone),
      esc(o.client.whatsapp),
      esc(o.motorcycle.brand),
      esc(o.motorcycle.model),
      esc(o.motorcycle.plate),
      esc(o.status),
      esc(Number(o.totalParts)),
      esc(Number(o.totalLabor)),
      esc(total),
      esc(o.expectedAt ? o.expectedAt.toISOString().slice(0,10) : '')
    ].join(',');
  }).join('\n');
  res.send(header + rows);
});

export default router;
