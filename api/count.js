import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

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

export default async (req, res) => {
  if (req.method === 'GET') {
    let counter = await Counter.findOne();
    if (!counter) {
      counter = new Counter({ count: 1 });
    } else {
      counter.count++;
    }
    await counter.save();
    res.status(200).json({ count: counter.count });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
};