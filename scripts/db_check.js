const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const f = await prisma.faculty.findUnique({ where: { Email: 'soumallyanaskar2002@gmail.com' } });
    console.log('Faculty:', f);
  } catch (err) {
    console.error('DB error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
})();
