function obtenerRespuesta(pregunta) {
    return prompt(pregunta).toLowerCase();
}

function simularDeporte() {
    let genero = obtenerRespuesta("¿Sos hombre o mujer?");
    let deporteContacto = obtenerRespuesta("¿Te gustan los deportes de contacto grupales?");
    let deporteIndividual = obtenerRespuesta("¿Te gustan los deportes individuales?");

    let deporteRecomendado = "";

    if ((genero === "hombre" || genero === "mujer") && deporteContacto === "si") {
        deporteRecomendado = "Futsal";
    } else if (genero === "mujer" && deporteIndividual === "si") {
        deporteRecomendado = "Gimnasia o Voley";
    } else {
        deporteRecomendado = "No se encontró un deporte recomendado para tus respuestas.";
    }
    alert("Según tus respuestas, te recomendamos practicar: " + deporteRecomendado);
    return deporteRecomendado;
}

simularDeporte();