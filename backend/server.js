import express from 'express';
import dotenv from 'dotenv';
import connectDb  from './config/db.js';
import instituteRoutes from './routes/instituteRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import vcRoutes from './routes/vcRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import cors from 'cors';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/institute', instituteRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/vc', vcRoutes);
app.use('/api/otp', otpRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
