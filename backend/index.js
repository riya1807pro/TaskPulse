import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const rawPort = process.env.PORT;
const parsedPort = Number(rawPort);
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

try {
  const corsOptions = {
    origin: FRONTEND_URL,
    optionsSuccessStatus: 200,
  };

  const app = express();
  app.use(cors(corsOptions));

  app.get('/', (req, res) => {
    res.send('Welcome to taskPulse');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS is configured for origin: ${FRONTEND_URL}`);
  });
} catch (error) {
  console.error('Server failed to start:', error);
  process.exit(1);
}
