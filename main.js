// Evento que se dispara cuando el DOM se ha cargado completamente
document.addEventListener('DOMContentLoaded', function () {
    // Elemento contenedor principal de la aplicación
    const appElement = document.getElementById('app');

    // Constantes para definir el horario de inicio, fin y las horas disponibles por dia
    const HORARIO_INICIO = 6;
    const HORARIO_FIN = 23;
    let horasDisponiblesPorDia = 17;

    // Dias de la semana
    const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    // Obtiene o inicializa los datos de deportes desde el almacenamiento local
    let deportes = JSON.parse(localStorage.getItem('deportes')) || {
        Futsal: { horasPorDia: 7, horarios: [] },
        Gimnasia: { horasPorDia: 5, horarios: [] },
        Voley: { horasPorDia: 5, horarios: [] },
    };

    // Objeto que contiene las funciones relacionadas con la interfaz de usuario
    const interfazDeUsuario = {
        // Muestra el formulario para un deporte específico
        mostrarFormulario: function (deporte) {
            const formularioHTML = `
            <div class="card" id="${deporte}">
                <h2>${deporte}</h2>
                <label for="${deporte}_horasPorDia">Horas por Día:</label>
                <input type="number" id="${deporte}_horasPorDia" min="1" max="${horasDisponiblesPorDia}" required>
                
                ${this.crearInputsHorarios(deporte)}
            
                <button class="guardar-btn">Guardar</button>
            </div>
        `;

            appElement.innerHTML += formularioHTML;
        },

        // Crea los campos de entrada para los horarios de la semana
        crearInputsHorarios: function (deporte) {
            let inputsHTML = '';

            for (const dia of DIAS_SEMANA) {
                inputsHTML += `
                <label for="${deporte}_${dia}">${dia}:</label>
                <input type="number" id="${deporte}_${dia}" min="${HORARIO_INICIO}" max="${HORARIO_FIN}" required>
                `;
            }

            return inputsHTML;
        },

        // Actualiza la interfaz eliminando el contenido y mostrando los formularios para cada deporte
        actualizarInterfaz: function () {
            appElement.innerHTML = '';

            for (const deporte in deportes) {
                this.mostrarFormulario(deporte);
            }
        }
    };

    // Objeto que contiene las funciones relacionadas con la logica del simulador
    const simulador = {
        // Captura la entrada del usuario al completar el formulario para un deporte
        capturarEntrada: function (deporte) {
            const horasPorDiaInput = document.getElementById(`${deporte}_horasPorDia`);
            const horariosPorDia = {};

            // Validacion de entrada de horas por dia
            if (!horasPorDiaInput.checkValidity()) {
                alert("Entrada no válida. Inténtelo nuevamente.");
                return;
            }

            const horasPorDia = parseInt(horasPorDiaInput.value);

            // Validacion de horarios para cada día de la semana
            for (const dia of DIAS_SEMANA) {
                const horarioInput = document.getElementById(`${deporte}_${dia}`);
                if (!horarioInput.checkValidity()) {
                    alert(`Horario no válido para ${dia}. Inténtelo nuevamente.`);
                    return;
                }

                const horarioDia = parseInt(horarioInput.value);

                // Verificacion de disponibilidad de horario
                const horariosAsignadosDia = deportes[deporte].horarios
                    .filter(evento => evento.dia === dia)
                    .map(evento => evento.hora);

                if (horariosAsignadosDia.includes(horarioDia)) {
                    console.error(`La hora ${horarioDia}:00 del ${dia} ya está ocupada.`);
                    mostrarHorariosDisponibles(deporte, dia);
                    return;
                }

                horariosPorDia[dia] = horarioDia;
            }

            this.asignarHorarios(deporte, { horasPorDia, horariosPorDia });
        },

        // Asigna los horarios ingresados por el usuario para un deporte
        asignarHorarios: function (deporte, entrada) {
            const { horasPorDia, horariosPorDia } = entrada;

            for (const dia of DIAS_SEMANA) {
                const horariosAsignadosDia = deportes[deporte].horarios
                    .filter(evento => evento.dia === dia)
                    .map(evento => evento.hora);

                for (let i = 0; i < horasPorDia; i++) {
                    const hora = HORARIO_INICIO + i;

                    // Verificación de disponibilidad de hora
                    if (!horariosAsignadosDia.includes(hora)) {
                        deportes[deporte].horarios.push({ dia, hora });
                        console.log(`  ${dia} a las ${hora}:00 asignado`);
                    } else {
                        console.error(`La hora ${hora}:00 del ${dia} ya está ocupada.`);
                        mostrarHorariosDisponibles(deporte, dia);
                        return;
                    }
                }
            }

            // Actualizacion de horas disponibles y almacenamiento local
            horasDisponiblesPorDia -= horasPorDia;
            localStorage.setItem('deportes', JSON.stringify(deportes));
            localStorage.setItem('horasDisponiblesPorDia', horasDisponiblesPorDia);
            console.log(`\nHorarios disponibles restantes: ${horasDisponiblesPorDia}\n`);

            this.mostrarGrillaPorDeporte(deporte);
            this.mostrarGrillaConsolidada();
        },

        // Reinicia el simulador, estableciendo las horas disponibles y los horarios de los deportes a sus valores iniciales
        reiniciarSimulador: function () {
            horasDisponiblesPorDia = 17;

            for (const deporte in deportes) {
                deportes[deporte].horarios = [];
            }

            localStorage.setItem('deportes', JSON.stringify(deportes));
            localStorage.setItem('horasDisponiblesPorDia', horasDisponiblesPorDia);
        },

        // Muestra los horarios asignados para un deporte en un formato específico
        mostrarGrillaPorDeporte: function (deporte) {
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
        },

        // Muestra la grilla horaria consolidada para todos los deportes
        mostrarGrillaConsolidada: function () {
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
                mensaje += "\n";
            }
            alert(mensaje);
        },

        // Inicia el simulador al cargar la página
        simulador: function () {
            this.reiniciarSimulador();

            for (const deporte in deportes) {
                interfazDeUsuario.mostrarFormulario(deporte);
            }

            interfazDeUsuario.actualizarInterfaz();
        }
    };

    // Evento de clic en el contenedor principal
    appElement.addEventListener('click', function (event) {
        const target = event.target;

        // Verificacion de clic en el boton de guardar
        if (target.classList.contains('guardar-btn')) {
            const cardElement = target.closest('.card');
            const deporte = cardElement.id;
            simulador.capturarEntrada(deporte);
        }
    });

    // Inicia el simulador al cargar la página
    simulador.simulador();
});
