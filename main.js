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
function capturarEntrada(deporte) {
    alert("Complete los siguientes datos:");

    let entradaValida = false;

    while (!entradaValida) {
        const horasPorDia = parseInt(prompt(`Ingrese las horas por día para ${deporte}:`));

        // Validar la entrada de horas por dia
        if (horasPorDia > 0 && horasPorDia <= horasDisponiblesPorDia) {
            const horariosPorDia = {};
            for (const dia of DIAS_SEMANA) {
                const horarioDia = parseInt(prompt(`Ingrese el horario para ${dia} (entre ${HORARIO_INICIO} y ${HORARIO_FIN}):`));
                // Validar el horario ingresado
                if (horarioDia >= HORARIO_INICIO && horarioDia <= HORARIO_FIN) {
                    // Verificar si la hora ya está asignada
                    const horaAsignada = deportes[deporte].horarios.find(evento => evento.dia === dia && evento.hora === horarioDia);
                    if (!horaAsignada) {
                        horariosPorDia[dia] = horarioDia;
                    } else {
                        console.error(`La hora ${horarioDia}:00 del ${dia} ya está asignada para ${deporte}`);
                        mostrarHorariosDisponibles(deporte);
                        return capturarEntrada(deporte); // Volver a capturar la entrada
                    }
                } else {
                    alert(`Horario no válido para ${dia}. Inténtelo nuevamente.`);
                    return capturarEntrada(deporte); // Volver a capturar la entrada
                }
            }

            return { horasPorDia, horariosPorDia };
        } else {
            alert("Entrada no válida. Inténtelo nuevamente.");
            return capturarEntrada(deporte); // Volver a capturar la entrada
        }
    }
}

// Funcion para mostrar los horarios disponibles
function mostrarHorariosDisponibles(deporte) {
    const horariosAsignados = deportes[deporte].horarios.map(evento => evento.hora);
    const horariosDisponibles = Array.from({ length: HORARIO_FIN - HORARIO_INICIO + 1 }, (_, i) => i + HORARIO_INICIO).filter(hora => !horariosAsignados.includes(hora));
    
    console.log(`\nHorarios disponibles para ${deporte}: ${horariosDisponibles.join(', ')}\n`);
}

// Funcion para asignar horarios a cada deporte
function asignarHorarios(deporte, entrada) {
    const { horasPorDia } = entrada;

    console.log(`\nAsignando horarios para ${deporte}...`);

    for (const dia of DIAS_SEMANA) {
        for (let i = 0; i < horasPorDia; i++) {
            const hora = HORARIO_INICIO + i;

            // Verificar si la hora ya está asignada
            const horaAsignada = deportes[deporte].horarios.find(evento => evento.dia === dia && evento.hora === hora);
            if (!horaAsignada) {
                deportes[deporte].horarios.push({ dia, hora });
                console.log(`  ${dia} a las ${hora}:00 asignado`);
            } else {
                console.error(`La hora ${hora}:00 del ${dia} ya está asignada para ${deporte}`);
                mostrarHorariosDisponibles(deporte);
                return; // No asignar esta hora, pasar a la siguiente
            }
        }
    }

    // Restar horas asignadas por deporte a las horas disponibles
    if (horasDisponiblesPorDia >= horasPorDia) {
        horasDisponiblesPorDia -= horasPorDia;
    } else {
        console.error(`No hay suficientes horas disponibles para asignar a ${deporte}`);
    }

    // Mostrar los horarios disponibles restantes
    console.log(`\nHorarios disponibles restantes: ${horasDisponiblesPorDia}\n`);
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

// Funcion para reiniciar el simulador
function reiniciarSimulador() {
    horasDisponiblesPorDia = 17;

    for (const deporte in deportes) {
        deportes[deporte].horarios = [];
    }
}

// Funcion principal del simulador
function simulador() {
    reiniciarSimulador();

    for (const deporte in deportes) {
        const entrada = capturarEntrada(deporte);
        asignarHorarios(deporte, entrada);
    }

    // Mostrar grilla por deporte
    for (const deporte in deportes) {
        mostrarGrillaPorDeporte(deporte);
    }

    // Mostrar grilla consolidada
    mostrarGrillaConsolidada();
}

simulador();
