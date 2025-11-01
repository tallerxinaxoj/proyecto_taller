import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(clients);
});

router.post('/', requireRole('ADMIN'), async (req, res) => {
  const { name, phone, whatsapp, email, address } = req.body || {};
  if (!name || !phone || !whatsapp) return res.status(400).json({ error: 'name, phone, whatsapp requeridos' });
  const c = await prisma.client.create({ data: { name, phone, whatsapp, email, address } });
  res.status(201).json(c);
});

// Obtener uno (ADMIN)
router.get('/:id', requireRole('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const c = await prisma.client.findUnique({ where: { id } });
  if (!c) return res.status(404).json({ error: 'No encontrado' });
  res.json(c);
});

// Actualizar (ADMIN)
router.patch('/:id', requireRole('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  const { name, phone, whatsapp, email, address } = req.body || {};
  try {
    const c = await prisma.client.update({ where: { id }, data: { name, phone, whatsapp, email, address } });
    res.json(c);
  } catch {
    res.status(400).json({ error: 'No se pudo actualizar' });
  }
});

// Eliminar (ADMIN)
router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.client.delete({ where: { id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: 'No se pudo eliminar (¿tiene órdenes?)' });
  }
});

export default router;
