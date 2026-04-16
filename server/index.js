import { createApp } from './app.js';

const app = createApp();
const PORT = Number(process.env.PORT) || 4001;
const server = app.listen(PORT, () => {
  console.log(`ReliefIQ API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the process using that port or set PORT to a different port.`);
    process.exit(1);
  }
  throw err;
});
