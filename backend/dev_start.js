(async () => {
  try {
    await import('./src/index.js');
    console.log('Imported src/index.js successfully');
  } catch (err) {
    console.error('Import/Error starting backend:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
