(async () => {
  const modules = [
    './src/index.js',
    './src/routes/auth.route.js',
    './src/routes/admin.route.js',
    './src/routes/faculty.route.js',
    './src/routes/research.route.js',
    './src/routes/publication.route.js',
    './src/routes/awards.route.js',
    './src/routes/qualifications.route.js',
    './src/routes/teaching.route.js',
    './src/middleware/auth.middleware.js',
    './src/controller/admin.controller.js',
    './src/controller/teaching.controller.js',
    './src/utils/db.js'
  ];

  for (const m of modules) {
    try {
      process.stdout.write(`Importing ${m}... `);
      const imported = await import(m);
      console.log('OK');
    } catch (e) {
      console.error('ERROR');
      console.error('Module:', m);
      console.error(e && e.stack ? e.stack : e);
      process.exit(1);
    }
  }

  console.log('All imports succeeded');
})();
