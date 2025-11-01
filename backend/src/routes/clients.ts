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

export default router;

