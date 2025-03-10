import mongoose from 'mongoose';

let isConnected = false;

const CounterSchema = new mongoose.Schema({ count: Number });
const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

async function connectToDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // resposta ao preflight
  }

  if (req.method === 'GET') {
    try {
      await connectToDB();

      let counter = await Counter.findOne();
      if (!counter) {
        counter = new Counter({ count: 1 });
      } else {
        counter.count++;
      }
      await counter.save();

      return res.status(200).json({ success: true, count: counter.count });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }
}
