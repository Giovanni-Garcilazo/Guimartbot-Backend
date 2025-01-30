const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json());

// Configuración de archivos estáticos para la carpeta "front-end"
app.use(express.static(path.join(__dirname, '../front-end'))); // Ajusta la ruta si es necesario

// Configuración de archivos estáticos para la carpeta "Guimartbot-dashboard"
app.use(express.static(path.join(__dirname, '../Guimartbot-dashboard'))); // Agrega esta línea

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Ruta para el login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end/login.html')); // Ajusta la ruta si es necesario
});

// Ruta para servir index.html desde Guimartbot-dashboard
app.get('/Guimartbot-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../Guimartbot-dashboard/index2.html')); // Esta línea sirve el index.html
});

// Otras configuraciones de rutas
app.use('/auth', require('./routes/auth'));
