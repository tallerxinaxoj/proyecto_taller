import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  const tools = await prisma.tool.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(tools);
});

router.post('/', requireRole('ADMIN'), async (req, res) => {
  const { name, code, quantity, location } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name requerido' });
  const t = await prisma.tool.create({ data: { name, code, quantity: quantity ?? 1, location } });
  res.status(201).json(t);
});

export default router;

