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

router.patch('/:id', requireRole('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const { name, code, quantity, location } = req.body || {};
  try {
    const t = await prisma.tool.update({ where: { id }, data: { name, code, quantity, location } });
    res.json(t);
  } catch {
    res.status(400).json({ error: 'No se pudo actualizar' });
  }
});

router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.tool.delete({ where: { id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'No se pudo eliminar' });
  }
});

export default router;
