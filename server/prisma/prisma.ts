import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verificar la conexión
prisma.$connect()
  .then(() => console.log('Conectado a la base de datos correctamente'))
  .catch(err => console.error('Error de conexión:', err));

  

export default prisma;
