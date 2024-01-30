document.addEventListener('DOMContentLoaded', function () {
    // Obtener el elemento contenedor de la aplicación
    const appElement = document.getElementById('app');
    // Definir constantes para el horario de inicio y fin, y las horas disponibles por dia
    const HORARIO_INICIO = 6;
    const HORARIO_FIN = 23;
    let horasDisponiblesPorDia = 17;
    // Definir un arreglo con los dias de la semana
    const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    // Obtener los datos de deportes del almacenamiento local o usar valores predeterminados
    let deportes = JSON.parse(localStorage.getItem('deportes')) || {
        Futsal: { horasPorDia: 7, horarios: [] },
        Gimnasia: { horasPorDia: 5, horarios: [] },
        Voley: { horasPorDia: 5, horarios: [] },
    };

    // Objeto que maneja la interfaz de usuario
    const interfazDeUsuario = {
        // Metodo para mostrar el formulario de entrada para un deporte específico
        mostrarFormulario: function (deporte) {
            // Crear el HTML del formulario
            const formularioHTML = `
            <div class="card" id="${deporte}">
                <h2>${deporte}</h2>
                <label for="${deporte}_horasPorDia">Horas por Día:</label>
                <input type="number" id="${deporte}_horasPorDia" min="1" max="${horasDisponiblesPorDia}" required>
                
                ${this.crearInputsHorarios(deporte)}
            
                <button class="guardar-btn">Guardar</button>
            </div>
        `;

            // Insertar el formulario en el DOM
            appElement.insertAdjacentHTML('beforeend', formularioHTML);
        },

        // Metodo para crear los inputs de horarios para un deporte específico
        crearInputsHorarios: function (deporte) {
            let inputsHTML = '';

            // Iterar sobre los dias de la semana para crear los inputs
            for (const dia of DIAS_SEMANA) {
                inputsHTML += `
                <label for="${deporte}_${dia}">${dia}:</label>
                <input type="number" id="${deporte}_${dia}" min="${HORARIO_INICIO}" max="${HORARIO_FIN}" required>
                `;
            }

            return inputsHTML;
        },

        // Metodo para actualizar la interfaz de usuario
        actualizarInterfaz: function () {
            // Limpiar el contenido del contenedor de la aplicacion
            appElement.innerHTML = '';

            // Mostrar el formulario para cada deporte
            for (const deporte in deportes) {
                this.mostrarFormulario(deporte);
            }
        }
    };

    // Objeto que simula el proceso de captura de entrada y asignacion de horarios
    const simulador = {
        // Metodo para capturar la entrada del usuario y asignar horarios
        capturarEntrada: function (deporte) {
            // Obtener el input de horas por dia y crear un objeto para almacenar los horarios por dia
            const horasPorDiaInput = document.getElementById(`${deporte}_horasPorDia`);
            const horariosPorDia = {};

            // Validar la entrada de horas por dia
            if (!horasPorDiaInput.checkValidity()) {
                this.mostrarError("Entrada no válida. Inténtelo nuevamente.");
                return;
            }

            const horasPorDia = parseInt(horasPorDiaInput.value);

            // Iterar sobre los dias de la semana y validar los horarios
            for (const dia of DIAS_SEMANA) {
                const horarioInput = document.getElementById(`${deporte}_${dia}`);
                if (!horarioInput.checkValidity()) {
                    this.mostrarError(`Horario no válido para ${dia}. Inténtelo nuevamente.`);
                    return;
                }

                const horarioDia = parseInt(horarioInput.value);

                // Verificar si el horario ya esta asignado para el dia especifico
                const horariosAsignadosDia = deportes[deporte].horarios
                    .filter(evento => evento.dia === dia)
                    .map(evento => evento.hora);

                if (horariosAsignadosDia.includes(horarioDia)) {
                    this.mostrarError(`La hora ${horarioDia}:00 del ${dia} ya está ocupada.`);
                    this.mostrarHorariosDisponibles(deporte, dia);
                    return;
                }

                horariosPorDia[dia] = horarioDia;
            }

            // Asignar los horarios y actualizar la interfaz
            this.asignarHorarios(deporte, { horasPorDia, horariosPorDia });
        },

        // Metodo para asignar los horarios para un deporte especifico
        asignarHorarios: function (deporte, entrada) {
            const { horasPorDia, horariosPorDia } = entrada;

            // Iterar sobre los dias de la semana
            for (const dia of DIAS_SEMANA) {
                // Filtrar los horarios asignados para el dia específico
                const horariosAsignadosDia = deportes[deporte].horarios
                    .filter(evento => evento.dia === dia)
                    .map(evento => evento.hora);

                // Iterar sobre las horas disponibles para asignar horarios
                for (let i = 0; i < horasPorDia; i++) {
                    const hora = HORARIO_INICIO + i;

                    // Verificar si la hora esta disponible para asignar
                    if (!horariosAsignadosDia.includes(hora)) {
                        deportes[deporte].horarios.push({ dia, hora });
                        console.log(`  ${dia} a las ${hora}:00 asignado`);
                    } else {
                        this.mostrarError(`La hora ${hora}:00 del ${dia} ya está ocupada.`);
                        this.mostrarHorariosDisponibles(deporte, dia);
                        return;
                    }
                }
            }

            // Actualizar las horas disponibles y el almacenamiento local
            horasDisponiblesPorDia -= horasPorDia;
            localStorage.setItem('deportes', JSON.stringify(deportes));
            localStorage.setItem('horasDisponiblesPorDia', horasDisponiblesPorDia);
            console.log(`\nHorarios disponibles restantes: ${horasDisponiblesPorDia}\n`);

            // Mostrar la grilla de horarios actualizada
            this.mostrarGrillaPorDeporte(deporte);
        },

        // Metodo para reiniciar el simulador
        reiniciarSimulador: function () {
            // Restablecer las horas disponibles por dia y reiniciar los horarios asignados para cada deporte
            horasDisponiblesPorDia = 17;
            for (const deporte in deportes) {
                deportes[deporte].horarios = [];
            }

            // Actualizar el almacenamiento local
            localStorage.setItem('deportes', JSON.stringify(deportes));
            localStorage.setItem('horasDisponiblesPorDia', horasDisponiblesPorDia);
        },

        // Metodo para mostrar la grilla de horarios para un deporte especifico
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
            this.mostrarMensaje(mensaje, 'mensaje-deporte');
        },
        
        // Metodo principal para iniciar el simulador
        simulador: function () {
            // Reiniciar el simulador
            this.reiniciarSimulador();

            // Mostrar el formulario para cada deporte y actualizar la interfaz
            for (const deporte in deportes) {
                interfazDeUsuario.mostrarFormulario(deporte);
            }
            interfazDeUsuario.actualizarInterfaz();
        },

        // Metodo para mostrar mensajes de error en la interfaz de usuario
        mostrarError: function (mensaje) {
            const errorElement = document.createElement('div');
            errorElement.textContent = mensaje;
            errorElement.classList.add('mensaje-error');
            appElement.appendChild(errorElement);
        },

        // Metodo para mostrar mensajes en la interfaz de usuario
        mostrarMensaje: function (mensaje, claseCSS) {
            const mensajeElement = document.createElement('div');
            mensajeElement.textContent = mensaje;
            mensajeElement.classList.add(claseCSS);
            appElement.appendChild(mensajeElement);
        },

        // Metodo para mostrar los horarios disponibles para un dia especifico en la interfaz de usuario
        mostrarHorariosDisponibles: function (deporte, dia) {
            // Obtener los horarios asignados para el dia especifico
            const horariosAsignadosDia = deportes[deporte].horarios
                .filter(evento => evento.dia === dia)
                .map(evento => evento.hora);

            // Obtener los horarios disponibles para el dia especifico
            const horariosDisponibles = [];
            for (let hora = HORARIO_INICIO; hora <= HORARIO_FIN; hora++) {
                if (!horariosAsignadosDia.includes(hora)) {
                    horariosDisponibles.push(hora);
                }
            }

            // Crear un mensaje con los horarios disponibles y mostrarlo en la interfaz
            const mensaje = `Horarios disponibles para ${deporte} el ${dia}: ${horariosDisponibles.join(', ')}`;
            this.mostrarMensaje(mensaje, 'mensaje-disponible');
        }
    };

    // Agregar un evento click al contenedor de la aplicacion para capturar la entrada del usuario al hacer clic en el boton de guardar
    appElement.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('guardar-btn')) {
            const cardElement = target.closest('.card');
            const deporte = cardElement.id;
            simulador.capturarEntrada(deporte);
        }
    });

    // Iniciar el simulador al cargar el contenido del DOM
    simulador.simulador();
});
