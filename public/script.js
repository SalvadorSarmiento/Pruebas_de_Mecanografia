// --- Datos de niveles ---
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

// --- Conectar con Firebase Realtime Database ---
const db = firebase.database(); // Ya está inicializado en index.html

// --- Registro de correo ---
document.getElementById("registroForm").addEventListener("submit", async e => {
  e.preventDefault();
  const correo = document.getElementById("correo").value.trim();

  if (correo === "") {
    alert("Por favor ingresa tu correo.");
    return;
  }

  document.getElementById("registroForm").style.display = "none";
  document.getElementById("pruebaContainer").style.display = "block";
  mostrarNivel(); // Mostrar primer párrafo
});

// --- Mostrar párrafo del nivel actual ---
function mostrarNivel() {
  const nivel = niveles[nivelActual];
  document.getElementById("parrafo").textContent = nivel.parrafo;
  document.getElementById("parrafo").style.display = "block";
  document.getElementById("ocultarParrafo").style.display = "inline-block";
  document.getElementById("respuesta").value = "";
  document.getElementById("respuesta").disabled = true;
  document.getElementById("enviarRespuesta").disabled = true;
}

// --- Ocultar párrafo y activar escritura ---
document.getElementById("ocultarParrafo").addEventListener("click", () => {
  document.getElementById("parrafo").style.display = "none";
  const textarea = document.getElementById("respuesta");
  textarea.disabled = false;
  textarea.focus();
  document.getElementById("enviarRespuesta").disabled = false;

  // Bloquear eliminaciones
  textarea.addEventListener('keydown', bloquearBorrado);
  startTime = Date.now();
});

// --- Bloquear borrar texto ---
function bloquearBorrado(e) {
  if (e.key === "Backspace" || e.key === "Delete" || (e.ctrlKey && (e.key === "x" || e.key === "v"))) {
    e.preventDefault();
  }
}

// --- Enviar respuesta a Firebase ---
document.getElementById("enviarRespuesta").addEventListener("click", async () => {
  const correo = document.getElementById("correo").value.trim();
  const textoEscrito = document.getElementById("respuesta").value.trim();
  const tiempo = Date.now() - startTime;
  const textoOriginal = niveles[nivelActual].parrafo;
  const nivel = niveles[nivelActual].nivel;
  const fecha = new Date().toLocaleString();

  if (textoEscrito === "") {
    alert("Por favor escribe tu respuesta.");
    return;
  }

  const datos = {
    correo,
    nivel,
    textoMostrado: textoOriginal,
    textoEscrito,
    tiempo,
    fecha
  };

  try {
    await db.ref("resultados").push(datos);
    alert(`Nivel ${nivel} guardado correctamente.`);
    nivelActual++;
    if (nivelActual < niveles.length) {
      mostrarNivel();
    } else {
      finalizarPrueba();
    }
  } catch (err) {
    alert("Error al guardar los resultados en Firebase: " + err.message);
  }
});

// --- Finalizar prueba ---
function finalizarPrueba() {
  document.getElementById("pruebaContainer").innerHTML = `
    <h2>¡Has completado todos los niveles!</h2>
    <p>Gracias por participar.</p>
    <button onclick="location.reload()">Volver a comenzar</button>
  `;
}
