import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Erro ao conectar MongoDB:', err));

// Modelo para contagem de acessos
const CounterSchema = new mongoose.Schema({ count: Number });
const Counter = mongoose.model('Counter', CounterSchema);

// Rota para obter e incrementar contagem
app.get('/count', async (req, res) => {
  let counter = await Counter.findOne();
  if (!counter) {
    counter = new Counter({ count: 1 });
  } else {
    counter.count++;
  }
  await counter.save();
  res.json({ count: counter.count });
});

// Exportação para Vercel
export default app;