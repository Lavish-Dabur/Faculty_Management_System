import prisma from '../src/utils/db.js';

async function main() {
  console.log('Start seeding...');

  const types = ['publication', 'patent', 'research_project'];
  for (const t of types) {
    await prisma.TYPES.upsert({
      where: { TypeID: t },
      update: {},
      create: {
        TypeID: t,
        Type: t,
        Status: 'active',
      },
    });
    console.log(`Upserted TYPE: ${t}`);
  }


  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biotechnology',
  ];
  for (const name of departments) {
    await prisma.department.upsert({
      where: { DepartmentName: name },
      update: {},
      create: {
        DepartmentName: name,
      },
    });
    console.log(`Upserted Department: ${name}`);
  }

  
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });