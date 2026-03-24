// internal-imports
import { createApp, io } from './app/index.js';
import { env } from './core/index.js';

// external-imports
import http from 'http';

// function to start the server
async function startServer(): Promise<void> {
  // create express application
  const application = createApp();

  // create http server
  const server = http.createServer(application);

  // promise to attach event listeners
  await new Promise<void>((resolve, reject) =>
    server
      .once('error', reject)
      .once('listening', () => {
        console.info(`Server is running @ ${env.PORT}`);
        resolve();
      })
      .listen(env.PORT)
  );

  // attach socket.io to the server
  io.attach(server);
}

// start the server
startServer().catch(error => {
  console.error(error);
  process.exit(1);
});
