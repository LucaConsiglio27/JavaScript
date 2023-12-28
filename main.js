// Declaracion de variables
const HORARIO_INICIO = 6;
const HORARIO_FIN = 23;
let horasDisponiblesPorDia = 17;
const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Objeto para almacenar la informacion de los deportes
const deportes = {
    futsal: { horasPorDia: 7, horarios: [] },
    gimnasia: { horasPorDia: 5, horarios: [] },
    voley: { horasPorDia: 5, horarios: [] }
};

// Funcion para capturar entradas mediante prompt
function capturarEntrada() {
    alert("Complete los siguientes datos:");

    let deporte;
    let entradaValida = false;

    while (!entradaValida) {
        deporte = prompt("Ingrese el deporte (Futsal, Gimnasia, Voley):").toLowerCase();

        // Validar la entrada de deporte
        if (deporte === "futsal" || deporte === "voley" || deporte === "gimnasia") {
            entradaValida = true;
        } else {
            alert("Deporte no válido. Inténtelo nuevamente.");
        }
    }

    const horasPorDia = parseInt(prompt(`Ingrese las horas por día para ${deporte}:`));

    // Validar la entrada de horas por dia
    if (horasPorDia > 0 && horasPorDia <= horasDisponiblesPorDia) {
        const horariosPorDia = {};
        for (const dia of DIAS_SEMANA) {
            const horarioDia = parseInt(prompt(`Ingrese el horario para ${dia} (entre ${HORARIO_INICIO} y ${HORARIO_FIN}):`));
            // Validar el horario ingresado
            if (horarioDia >= HORARIO_INICIO && horarioDia <= HORARIO_FIN) {
                horariosPorDia[dia] = horarioDia;
            } else {
                alert(`Horario no válido para ${dia}. Inténtelo nuevamente.`);
                return capturarEntrada(); // Volver a capturar la entrada
            }
        }

        return { deporte, horasPorDia, horariosPorDia };
    } else {
        alert("Entrada no válida. Inténtelo nuevamente.");
        return capturarEntrada(); // Volver a capturar la entrada
    }
}



// Funcion para asignar horarios a cada deporte
function asignarHorarios(entrada) {
    const { deporte, horasPorDia } = entrada;

    for (const dia of DIAS_SEMANA) {
        for (let i = 0; i < horasPorDia; i++) {
            const hora = HORARIO_INICIO + i;
            deportes[deporte].horarios.push({ dia, hora });
        }
    }

    // Restar horas asignadas por deporte a las horas disponibles
    if (horasDisponiblesPorDia >= horasPorDia) {
        horasDisponiblesPorDia -= horasPorDia;
    } else {
        console.error(`No hay suficientes horas disponibles para asignar a ${deporte}`);
    }
}


// Funcion para mostrar la grilla horaria por deporte mediante alert()
function mostrarGrillaPorDeporte(deporte) {
    let mensaje = `${deporte.charAt(0).toUpperCase() + deporte.slice(1)}:\n`;
    deportes[deporte].horarios.forEach(evento => {
        mensaje += `  ${evento.dia.charAt(0).toUpperCase() + evento.dia.slice(1)} a las ${evento.hora}:00\n`;
    });
    alert(mensaje);
}

// Funcion para mostrar la grilla consolidada de todos los deportes
function mostrarGrillaConsolidada() {
    let mensaje = "Grilla horaria consolidada para todos los deportes:\n";
    for (const deporte in deportes) {
        mensaje += `${deporte.charAt(0).toUpperCase() + deporte.slice(1)}:\n`;
        deportes[deporte].horarios.forEach(evento => {
            mensaje += `  ${evento.dia.charAt(0).toUpperCase() + evento.dia.slice(1)} a las ${evento.hora}:00\n`;
        });
        mensaje += "\n"; // Separador entre deportes
    }
    alert(mensaje);
}

// Simulador principal
function simulador() {
    for (let i = 0; i < Object.keys(deportes).length; i++) {
        const entrada = capturarEntrada();
        asignarHorarios(entrada);
    }

    // Mostrar grilla por deporte
    for (const deporte in deportes) {
        mostrarGrillaPorDeporte(deporte);
    }

    // Mostrar grilla consolidada
    mostrarGrillaConsolidada();
}


simulador();
