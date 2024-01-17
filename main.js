// Declaracion de variables
const HORARIO_INICIO = 6;
const HORARIO_FIN = 23;
let horasDisponiblesPorDia = 17;
const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Inicializar deportes desde localStorage o un objeto vacío si no existe
let deportes = JSON.parse(localStorage.getItem('deportes')) || {
    futsal: { horasPorDia: 7, horarios: [] },
    gimnasia: { horasPorDia: 5, horarios: [] },
    voley: { horasPorDia: 5, horarios: [] }
};

// Funcion para capturar entradas mediante prompt
function capturarEntrada(deporte) {
    alert("Complete los siguientes datos:");

    let horasPorDia;
    let horariosPorDia = {};

    do {
        horasPorDia = parseInt(prompt(`Ingrese las horas por día para ${deporte}:`));

        if (isNaN(horasPorDia) || horasPorDia <= 0 || horasPorDia > horasDisponiblesPorDia) {
            alert("Entrada no válida. Inténtelo nuevamente.");
        }
    } while (isNaN(horasPorDia) || horasPorDia <= 0 || horasPorDia > horasDisponiblesPorDia);

    for (const dia of DIAS_SEMANA) {
        let horarioDia;

        do {
            horarioDia = parseInt(prompt(`Ingrese el horario para ${dia} (entre ${HORARIO_INICIO} y ${HORARIO_FIN}):`));

            if (isNaN(horarioDia) || horarioDia < HORARIO_INICIO || horarioDia > HORARIO_FIN) {
                alert(`Horario no válido para ${dia}. Inténtelo nuevamente.`);
            }
        } while (isNaN(horarioDia) || horarioDia < HORARIO_INICIO || horarioDia > HORARIO_FIN);

        // Verificar si la hora ya está asignada
        const horariosAsignadosDia = deportes[deporte].horarios
            .filter(evento => evento.dia === dia)
            .map(evento => evento.hora);

        if (horariosAsignadosDia.includes(horarioDia)) {
            console.error(`La hora ${horarioDia}:00 del ${dia} ya está ocupada.`);
            mostrarHorariosDisponibles(deporte, dia);
            return capturarEntrada(deporte); // Volver a capturar la entrada
        }

        horariosPorDia[dia] = horarioDia;
    }

    return { horasPorDia, horariosPorDia };
}

// Funcion para mostrar los horarios disponibles
function mostrarHorariosDisponibles(deporte, dia) {
    const horariosAsignados = deportes[deporte].horarios
        .filter(evento => evento.dia === dia)
        .map(evento => evento.hora);

    const horariosDisponibles = Array.from({ length: HORARIO_FIN - HORARIO_INICIO + 1 }, (_, i) => i + HORARIO_INICIO)
        .filter(hora => !horariosAsignados.includes(hora));

    console.log(`\nHorarios disponibles para ${deporte} el ${dia}: ${horariosDisponibles.join(', ')}\n`);
}

// Funcion para asignar horarios a cada deporte
function asignarHorarios(deporte, entrada) {
    const { horasPorDia, horariosPorDia } = entrada;

    console.log(`\nAsignando horarios para ${deporte}...`);

    for (const dia of DIAS_SEMANA) {
        const horariosAsignadosDia = deportes[deporte].horarios
            .filter(evento => evento.dia === dia)
            .map(evento => evento.hora);

        for (let i = 0; i < horasPorDia; i++) {
            const hora = HORARIO_INICIO + i;

            // Verificar si la hora ya está asignada
            if (!horariosAsignadosDia.includes(hora)) {
                deportes[deporte].horarios.push({ dia, hora });
                console.log(`  ${dia} a las ${hora}:00 asignado`);
            } else {
                console.error(`La hora ${hora}:00 del ${dia} ya está ocupada.`);
                mostrarHorariosDisponibles(deporte, dia);
                return; // No asignar esta hora, pasar a la siguiente
            }
        }
    }

    // Restar horas asignadas por deporte a las horas disponibles
    horasDisponiblesPorDia -= horasPorDia;
    // Actualizar localStorage
    localStorage.setItem('deportes', JSON.stringify(deportes));
    localStorage.setItem('horasDisponiblesPorDia', horasDisponiblesPorDia);

    // Mostrar los horarios disponibles restantes
    console.log(`\nHorarios disponibles restantes: ${horasDisponiblesPorDia}\n`);
}

// Funcion para mostrar la grilla horaria por deporte mediante alert()
function mostrarGrillaPorDeporte(deporte) {
    let mensaje = `${deporte.charAt(0).toUpperCase() + deporte.slice(1)}:\n`;
    for (const dia of DIAS_SEMANA) {
        mensaje += `${dia}:\n`;
        deportes[deporte].horarios
            .filter(evento => evento.dia === dia)
            .forEach(evento => {
                mensaje += `  ${evento.hora}:00\n`;
            });
    }
    alert(mensaje);
}

// Funcion para mostrar la grilla consolidada de todos los deportes
function mostrarGrillaConsolidada() {
    let mensaje = "Grilla horaria consolidada para todos los deportes:\n";
    for (const deporte in deportes) {
        mensaje += `${deporte.charAt(0).toUpperCase() + deporte.slice(1)}:\n`;
        for (const dia of DIAS_SEMANA) {
            deportes[deporte].horarios
                .filter(evento => evento.dia === dia)
                .forEach(evento => {
                    mensaje += `  ${dia} a las ${evento.hora}:00\n`;
                });
        }
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

    // Actualizar localStorage
    localStorage.setItem('deportes', JSON.stringify(deportes));
    localStorage.setItem('horasDisponiblesPorDia', horasDisponiblesPorDia);
}

// Funcion principal del simulador
function simulador() {
    reiniciarSimulador();  // Reiniciamos el simulador al cargar la página

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
