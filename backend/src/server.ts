import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import clientsRouter from './routes/clients';
import productsRouter from './routes/products';
import toolsRouter from './routes/tools';
import ordersRouter from './routes/orders';
import metricsRouter from './routes/metrics';
import notificationsRouter from './routes/notifications';
import reportsRouter from './routes/reports';

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: ENV.ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/products', productsRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', metricsRouter); // /api/dashboard
app.use('/api/notifications', notificationsRouter);
app.use('/api/reports', reportsRouter);

app.listen(ENV.PORT, () => {
  console.log(`Backend escuchando en http://localhost:${ENV.PORT}`);
  console.log(`WhatsApp provider: ${ENV.WHATSAPP_PROVIDER}`);
});
