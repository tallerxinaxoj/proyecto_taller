import { Router } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth);

router.get('/dashboard', async (_req, res) => {
  const [totalClients, totalProducts, lowStock, byStatus] = await Promise.all([
    prisma.client.count(),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 5 }, active: true } }),
    prisma.order.groupBy({ by: ['status'], _count: { status: true } })
  ]);

  const statusMap: Record<string, number> = {};
  Object.values(OrderStatus).forEach(s => statusMap[s] = 0);
  byStatus.forEach(r => { statusMap[r.status] = r._count.status; });

  res.json({ totalClients, totalProducts, lowStock, byStatus: statusMap });
});

export default router;

