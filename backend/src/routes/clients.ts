import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth';
import { isDpiGT, isE164 } from '../utils/validate';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(clients);
});

router.post('/', requireRole('ADMIN'), async (req, res) => {
  const { name, phone, whatsapp, email, address, dpi } = req.body || {};
  if (!name || !phone || !whatsapp || !dpi) return res.status(400).json({ error: 'name, phone, whatsapp, dpi requeridos' });
  if (!isE164(whatsapp)) return res.status(400).json({ error: 'WhatsApp debe estar en formato E.164 (+502... )' });
  if (!isDpiGT(dpi)) return res.status(400).json({ error: 'DPI debe tener 13 dígitos (####-#####-####)' });
  const dpiDashed = toDashedDpi(dpi);
  try {
    const c = await prisma.client.create({ data: { name, phone, whatsapp, email, address, dpi: dpiDashed } });
    res.status(201).json(c);
  } catch (e:any) {
    res.status(400).json({ error: 'No se pudo crear cliente (¿DPI duplicado?)' });
  }
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
  const { name, phone, whatsapp, email, address, dpi } = req.body || {};
  try {
    if (whatsapp && !isE164(whatsapp)) return res.status(400).json({ error: 'WhatsApp inválido (E.164)' });
    let data: any = { name, phone, whatsapp, email, address };
    if (dpi) {
      if (!isDpiGT(dpi)) return res.status(400).json({ error: 'DPI inválido (13 dígitos)' });
      data.dpi = toDashedDpi(dpi);
    }
    const c = await prisma.client.update({ where: { id }, data });
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
