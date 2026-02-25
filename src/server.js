import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// import pino from 'pino';
// import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';

import router from './routers/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export async function setupServer() {
  // const isDev = process.env.NODE_ENV !== 'production';

  // const logger = pino(
  //   isDev
  //     ? {
  //         // prettifier только в dev-режиме
  //         transport: {
  //           target: 'pino-pretty',
  //           options: {
  //             colorize: true,
  //             translateTime: 'HH:MM:ss',
  //             ignore: 'pid,hostname',
  //           },
  //         },
  //       }
  //     : undefined // в проде пишем «сырой» JSON
  // );
  const app = express();
  app.use(cors());
  app.use(cookieParser());
  // app.use(pinoHttp({ logger }));

  app.use(express.json());

  app.use('/', router);
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
