// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Datos de deportes
let deportes = {
    Futsal: { horasPorDia: 7, horarios: [] },
    Gimnasia: { horasPorDia: 5, horarios: [] },
    Voley: { horasPorDia: 5, horarios: [] },
};

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());

// Ruta para obtener los datos de deportes
app.get('/deportes', (req, res) => {
    res.json(deportes);
});

// Ruta para actualizar los datos de deportes
app.post('/deportes', (req, res) => {
    const newData = req.body;
    deportes = { ...deportes, ...newData };
    res.json(deportes);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
