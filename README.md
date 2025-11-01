Taller de Motos — Monorepo (Node, React, TypeScript, Tailwind, Docker, PostgreSQL)

Resumen
- Backend: Node + Express + TypeScript + Prisma (PostgreSQL) + JWT con roles (ADMIN, MECANICO)
- Frontend: React + TypeScript + Vite + TailwindCSS
- Notificaciones: Proveedor de WhatsApp conmutables (consola por defecto / Twilio opcional)
- Docker: docker-compose con PostgreSQL, backend y frontend

Características
- Órdenes: crear, cliente + moto, productos del stock, estados con historial, notificación WhatsApp al crear y cambiar estado
- Inventario: productos y herramientas; los productos se enlazan a las órdenes (descuenta stock)
- Clientes: registro básico (incluye teléfono/WhatsApp)
- Roles: ADMIN (todo), MECANICO (crear/visualizar órdenes, ver stock, actualizar estado)

Comandos básicos (local)
1) Backend
   - cd backend
   - npm install
   - npx prisma generate
   - npx prisma migrate dev --name init
   - npm run seed
   - npm run dev

2) Frontend
   - cd ../frontend
   - npm install
   - npm run dev
   - Abrir http://localhost:5173

Docker
- docker compose up --build
- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health

WhatsApp
- Por defecto usa consola (simulado). Para Twilio: en backend `.env`, poner WHATSAPP_PROVIDER=twilio y completar credenciales.

