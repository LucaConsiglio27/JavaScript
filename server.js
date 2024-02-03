// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Datos de deportes
const deportes = {
    Futsal: { horasPorDia: 7, horarios: [] },
    Gimnasia: { horasPorDia: 5, horarios: [] },
    Voley: { horasPorDia: 5, horarios: [] },
};

// Ruta para obtener los datos de deportes
app.get('/deportes', (req, res) => {
    res.json(deportes);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
