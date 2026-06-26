import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.ts';
import userRoutes from './routes/users.ts';
import jobRoutes from './routes/jobs.ts';
import slotRoutes from './routes/slots.ts';
import bookingRoutes from './routes/bookings.ts';
import connectionRoutes from './routes/connections.ts';
import messageRoutes from './routes/messages.ts';
import adminRoutes from './routes/admin.ts';
import resourceRoutes from './routes/resources.ts';
import referralRoutes from './routes/referrals.ts';
import reviewRoutes from './routes/reviews.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Alumni Connect API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});