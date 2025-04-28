const niveles = [
  {
    nivel: 1,
    titulo: "Nivel 1: Básico",
    parrafo: "Cada mañana me levanto, me cepillo los dientes, desayuno cereales y voy a la escuela caminando con mis amigos."
  },
  {
    nivel: 2,
    titulo: "Nivel 2: Intermedio",
    parrafo: "Para hacer limonada, primero cortas los limones, exprimes su jugo, mezclas con agua y agregas azúcar al gusto."
  },
  {
    nivel: 3,
    titulo: "Nivel 3: Avanzado",
    parrafo: "Las estaciones cambian debido a la inclinación del eje terrestre, haciendo que diferentes partes de la Tierra reciban distinta cantidad de luz solar durante el año."
  },
  {
    nivel: 4,
    titulo: "Nivel 4: Experto",
    parrafo: "La energía solar proviene del sol y es renovable, mientras que la energía eólica utiliza el viento; ambas dependen de la naturaleza, pero se aprovechan de formas distintas."
  },
  {
    nivel: 5,
    titulo: "Nivel 5: Maestro",
    parrafo: "La memoria humana combina recuerdos mediante conexiones neuronales, mientras que los sistemas artificiales utilizan algoritmos de búsqueda para procesar información."
  }
];

let nivelActual = 0;
let startTime;

// --- Tu sistema de registro se mantiene ---
document.getElementById("registroForm").addEventListener("submit", async e => {
  e.preventDefault();
  const correo = document.getElementById("correo").value;

  const res = await fetch("/.netlify/functions/registrarUsuario", {
    method: "POST",
    body: JSON.stringify({ email: correo }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (res.status === 200) {
    document.getElementById("registroForm").style.display = "none";
    document.getElementById("pruebaContainer").style.display = "block";
    mostrarNivel(); // Mostrar primer párrafo
  } else {
    alert("Correo ya registrado o error.");
  }
});

// --- Mostrar el párrafo del nivel actual ---
function mostrarNivel() {
  const nivel = niveles[nivelActual];
  document.getElementById("parrafo").textContent = nivel.parrafo;
  document.getElementById("parrafo").style.display = "block";
  document.getElementById("ocultarParrafo").style.display = "inline-block";
  document.getElementById("respuesta").value = "";
  document.getElementById("respuesta").disabled = true;
  document.getElementById("enviarRespuesta").disabled = true;
}

// --- Cuando el usuario oculta el párrafo para comenzar a escribir ---
document.getElementById("ocultarParrafo").addEventListener("click", () => {
  document.getElementById("parrafo").style.display = "none";
  const textarea = document.getElementById("respuesta");
  textarea.disabled = false;
  textarea.focus();
  document.getElementById("enviarRespuesta").disabled = false;

  // Bloquear eliminaciones y correcciones
  textarea.addEventListener('keydown', bloquearBorrado);
  startTime = Date.now();
});

// --- Bloquear retroceso y eliminar texto ---
function bloquearBorrado(e) {
  if (e.key === "Backspace" || e.key === "Delete" || (e.ctrlKey && (e.key === "x" || e.key === "v"))) {
    e.preventDefault();
  }
}

// --- Enviar respuesta de cada nivel ---
document.getElementById("enviarRespuesta").addEventListener("click", async () => {
  const correo = document.getElementById("correo").value;
  const textoEscrito = document.getElementById("respuesta").value;
  const tiempoEscrito = Date.now() - startTime;
  const textoMostrado = niveles[nivelActual].parrafo;
  const fecha = new Date().toLocaleString();

  const data = {
    correo: correo,
    nivel: niveles[nivelActual].nivel,
    texto: textoMostrado,
    textoEscrito: textoEscrito,
    tiempoEscrito: tiempoEscrito,
    fecha: fecha
  };

  const res = await fetch("/.netlify/functions/guardarResultados", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (res.status === 200) {
    alert(`Nivel ${niveles[nivelActual].nivel} guardado.`);

    nivelActual++;
    if (nivelActual < niveles.length) {
      mostrarNivel(); // Siguiente nivel
    } else {
      finalizarPrueba();
    }
  } else {
    alert("Hubo un problema al guardar los resultados.");
  }
});

// --- Al finalizar los 5 niveles ---
function finalizarPrueba() {
  document.getElementById("pruebaContainer").innerHTML = `
    <h2>¡Has completado todos los niveles!</h2>
    <p>Gracias por participar.</p>
    <button onclick="location.reload()">Volver a comenzar</button>
  `;
}
