document.addEventListener('DOMContentLoaded', function () {
    const appElement = document.getElementById('app');
    const HORARIO_INICIO = 6;
    const HORARIO_FIN = 23;
    let horasDisponiblesPorDia = 17;
    const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    let deportes = JSON.parse(localStorage.getItem('deportes')) || {
        Futsal: { horasPorDia: 7, horarios: [] },
        Gimnasia: { horasPorDia: 5, horarios: [] },
        Voley: { horasPorDia: 5, horarios: [] },
    };

    const interfazDeUsuario = {
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

            appElement.insertAdjacentHTML('beforeend', formularioHTML);
        },

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

        actualizarInterfaz: function () {
            appElement.innerHTML = '';

            for (const deporte in deportes) {
                this.mostrarFormulario(deporte);
            }
        }
    };

    const simulador = {
        capturarEntrada: function (deporte) {
            const horasPorDiaInput = document.getElementById(`${deporte}_horasPorDia`);
            const horariosPorDia = {};

            if (!horasPorDiaInput.checkValidity()) {
                this.mostrarError("Entrada no válida. Inténtelo nuevamente.");
                return;
            }

            const horasPorDia = parseInt(horasPorDiaInput.value);

            for (const dia of DIAS_SEMANA) {
                const horarioInput = document.getElementById(`${deporte}_${dia}`);
                if (!horarioInput.checkValidity()) {
                    this.mostrarError(`Horario no válido para ${dia}. Inténtelo nuevamente.`);
                    return;
                }

                const horarioDia = parseInt(horarioInput.value);

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

            this.asignarHorarios(deporte, { horasPorDia, horariosPorDia });
        },

        asignarHorarios: function (deporte, entrada) {
            const { horasPorDia, horariosPorDia } = entrada;

            for (const dia of DIAS_SEMANA) {
                const horariosAsignadosDia = deportes[deporte].horarios
                    .filter(evento => evento.dia === dia)
                    .map(evento => evento.hora);

                for (let i = 0; i < horasPorDia; i++) {
                    const hora = HORARIO_INICIO + i;

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

            horasDisponiblesPorDia -= horasPorDia;
            localStorage.setItem('deportes', JSON.stringify(deportes));
            localStorage.setItem('horasDisponiblesPorDia', horasDisponiblesPorDia);
            console.log(`\nHorarios disponibles restantes: ${horasDisponiblesPorDia}\n`);

            this.mostrarGrillaPorDeporte(deporte);
            this.mostrarGrillaConsolidada();
        },

        reiniciarSimulador: function () {
            horasDisponiblesPorDia = 17;

            for (const deporte in deportes) {
                deportes[deporte].horarios = [];
            }

            localStorage.setItem('deportes', JSON.stringify(deportes));
            localStorage.setItem('horasDisponiblesPorDia', horasDisponiblesPorDia);
        },

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

        
        simulador: function () {
            this.reiniciarSimulador();

            for (const deporte in deportes) {
                interfazDeUsuario.mostrarFormulario(deporte);
            }

            interfazDeUsuario.actualizarInterfaz();
        },

        mostrarError: function (mensaje) {
            const errorElement = document.createElement('div');
            errorElement.textContent = mensaje;
            errorElement.classList.add('mensaje-error');
            appElement.appendChild(errorElement);
        },

        mostrarMensaje: function (mensaje, claseCSS) {
            const mensajeElement = document.createElement('div');
            mensajeElement.textContent = mensaje;
            mensajeElement.classList.add(claseCSS);
            appElement.appendChild(mensajeElement);
        },

        mostrarHorariosDisponibles: function (deporte, dia) {
            const horariosAsignadosDia = deportes[deporte].horarios
                .filter(evento => evento.dia === dia)
                .map(evento => evento.hora);

            const horariosDisponibles = [];
            for (let hora = HORARIO_INICIO; hora <= HORARIO_FIN; hora++) {
                if (!horariosAsignadosDia.includes(hora)) {
                    horariosDisponibles.push(hora);
                }
            }

            const mensaje = `Horarios disponibles para ${deporte} el ${dia}: ${horariosDisponibles.join(', ')}`;
            this.mostrarMensaje(mensaje, 'mensaje-disponible');
        }
    };

    appElement.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('guardar-btn')) {
            const cardElement = target.closest('.card');
            const deporte = cardElement.id;
            simulador.capturarEntrada(deporte);
        }
    });

    simulador.simulador();
});
