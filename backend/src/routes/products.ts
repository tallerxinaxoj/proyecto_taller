import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(products);
});

router.post('/', requireRole('ADMIN'), async (req, res) => {
  const { name, sku, stock, price, active } = req.body || {};
  if (!name || !sku) return res.status(400).json({ error: 'name y sku requeridos' });
  try {
    const p = await prisma.product.create({ data: { name, sku, stock: stock ?? 0, price: price ?? 0, active: active ?? true } });
    res.status(201).json(p);
  } catch {
    res.status(400).json({ error: 'No se pudo crear (sku único?)' });
  }
});

router.patch('/:id', requireRole('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const { name, stock, price, active } = req.body || {};
  try {
    const p = await prisma.product.update({ where: { id }, data: { name, stock, price, active } });
    res.json(p);
  } catch {
    res.status(400).json({ error: 'No se pudo actualizar' });
  }
});

export default router;

