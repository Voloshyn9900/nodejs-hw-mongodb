import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export async function setupServer() {
  const app = express();
  app.use(cors());
  app.use(pino());

  app.use(express.json())

  app.use("/", router);
  // app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);


  try {
    const PORT = process.env.PORT || 3000;
    console.log(process.env.PORT);

    await initMongoConnection();

    app.listen(PORT, err => {
      if (err) {
        throw err;
      }
      console.log(`Server is running on port ${PORT}`);
    });

    // Если хотите логировать переменные окружения:
  } catch (error) {
    console.error(error);
  }
}
