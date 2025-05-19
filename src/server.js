import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import { getContacts, getContact } from './controllers/contactController.js';

export async function setupServer() {
  const app = express();
  app.use(cors());
  app.use(pino());

  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContact);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found - 404' });
  });

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
