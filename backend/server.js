require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

// Configuración de entorno solo local
const MONGO_URI = process.env.MONGO_URI || '';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';
const JWT_SECRET = process.env.JWT_SECRET || '';

// Validación de MONGO_URI y logging del entorno
if (!MONGO_URI) {
  console.error('MONGO_URI no está definido. Verifica tu archivo .env o configuración de entorno.');
}
console.log(`Entorno: ${isProd ? 'production' : 'development'}`);

const app = express();

// Middleware
const envOrigins = (CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);
const baseOrigins = [...envOrigins,'https://viajaconmemoya.com','https://www.viajaconmemoya.com'];
const localOrigins = ['http://localhost:3000','http://127.0.0.1:3000','http://localhost:3001','http://localhost:5000','http://127.0.0.1:5000','http://localhost:5173','http://127.0.0.1:5173','http://localhost:4173','http://127.0.0.1:4173','http://localhost:8080','http://127.0.0.1:8080'];
const allowedOrigins = isProd ? baseOrigins : baseOrigins.concat(localOrigins);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const hostname = new URL(origin).hostname;
      const isAllowed = allowedOrigins.includes(origin) || hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.vercel.app') || hostname.endsWith('.web.app') || hostname.endsWith('.firebaseapp.com');
      if (isAllowed) return callback(null, true);
      console.warn(`CORS bloqueado para origen: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    } catch (e) {
      return callback(null, true);
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Desactivar buffer de comandos para no encolar operaciones cuando la DB está desconectada
mongoose.set('bufferCommands', false);

// Conexión a la base de datos
const connectDB = async () => {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    isConnected = true;
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', (error && error.message) ? error.message : error);
    console.error('Continuando sin conexión a MongoDB. Se intentará reconectar en 5s.');
    setTimeout(connectDB, 5000);
  }
};

let isConnected = false;

// Eventos de conexión de Mongoose
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('Evento: Mongoose conectado');
});
mongoose.connection.on('error', (err) => {
  console.error('Evento: Error de Mongoose:', (err && err.message) ? err.message : err);
});
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('Evento: Mongoose desconectado');
});

const connectPromise = connectDB();



// Rutas
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (!isConnected) {
    return res.status(503).json({ error: 'Servicio temporalmente no disponible', detail: 'Sin conexión a la base de datos', retryAfterMs: 5000 });
  }
  next();
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/albums', require('./routes/albums'));
app.use('/api/users', require('./routes/users'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/payments', require('./routes/payments'));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health route
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({ status: 'ok', db: { connected: isConnected, readyState: state } });
});
app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({ status: 'ok', db: { connected: isConnected, readyState: state } });
});

// En producción no servimos el frontend desde el backend; mantener solo las rutas de API.
if (isProd) {
  // Sin fallback de SPA aquí. El frontend debe servirse por su plataforma (p.ej., Vercel).
}

if (!isProd) {
  app.get('/', (req, res) => {
    res.send('API de Viaja con Memo');
  });
}
// Manejador 404 para rutas no existentes del API
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});
const port = process.env.PORT || 3001;

if (require.main === module) {
  (async () => {
    await connectPromise;
    app.listen(port, '0.0.0.0', () => console.log(`Servidor corriendo en puerto ${port}`));
  })();
}

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err && err.status ? err.status : 500).json({ error: 'Internal Server Error', detail: err && err.message ? err.message : String(err) });
});
module.exports = app;