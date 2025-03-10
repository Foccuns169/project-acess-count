import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();  // <-- Definição da variável app

app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
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

app.get("/", (req, res) => {
  res.send("API está funcionando!");
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando na porta ${PORT}'));

// Exportação para Vercel
export default app;