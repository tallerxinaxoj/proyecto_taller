import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@taller.local';
  const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!exists) {
    const hash = await bcrypt.hash('Admin123!', 10);
    await prisma.user.create({ data: { name: 'Admin', email: adminEmail, passwordHash: hash, role: Role.ADMIN } });
    console.log('Usuario ADMIN creado:', adminEmail, 'pass: Admin123!');
  } else {
    console.log('ADMIN ya existe:', adminEmail);
  }
}

main().finally(() => prisma.$disconnect());

