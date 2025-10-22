import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRouter from "./routes/auth.router.js";

const rawPort = process.env.PORT;
const parsedPort = Number(rawPort);
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

try {
  const corsOptions = {
    origin: FRONTEND_URL,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

  const app = express();

  // IMPORTANT: body parsers BEFORE routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors(corsOptions));
  // app.options('*', cors(corsOptions)); // handle preflight

  mongoose.connect(process.env.MONGO_URI).then(()=> {
    console.log('Connected to MongoDB');
  }).catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

  app.get('/', (req, res) => {
    res.send('Welcome to taskPulse');
  });

  // mount auth routes
  app.use("/api/auth", authRouter);

  // optional legacy compatibility if you previously used /sign-Up
  app.post('/sign-Up', (req, res) => res.redirect(307, '/api/auth/signUp'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS is configured for origin: ${FRONTEND_URL}`);
  });
} catch (error) {
  console.error('Server failed to start:', error);
  process.exit(1);
}

