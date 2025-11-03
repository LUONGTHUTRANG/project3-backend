import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => res.json({ ok: true, service: 'dorm-management-backend', version: '0.1.0' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
