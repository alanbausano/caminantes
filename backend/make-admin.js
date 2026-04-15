import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL no está definido en el archivo .env.");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function makeAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });
    console.log(`\n¡Éxito! El usuario ${user.firstName} (${email}) ahora es administrador. 🛡️\n`);
  } catch (error) {
    console.error(`\nError: No se encontró al usuario con email "${email}" o hubo un problema con la base de datos.`);
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Uso: node make-admin.js <email>');
  process.exit(1);
}

makeAdmin(email);
