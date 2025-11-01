import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { sendWhatsApp } from '../notifications/whatsapp';
import { ENV } from '../config/env';

const router = Router();

router.use(requireAuth);

// Prueba de notificación WhatsApp (ADMIN)
router.post('/test', requireRole('ADMIN'), async (req, res) => {
  const { to, body } = req.body || {};
  if (!to || !body) return res.status(400).json({ error: 'to y body requeridos' });
  try {
    await sendWhatsApp(to, body);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Fallo al enviar' });
  }
});

// Config actual (proveedor activo)
router.get('/config', requireRole('ADMIN'), (_req, res) => {
  res.json({ provider: ENV.WHATSAPP_PROVIDER });
});

export default router;
