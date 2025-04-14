document.getElementById("registroForm").addEventListener("submit", async e => {
  e.preventDefault();
  const correo = document.getElementById("correo").value;

  // Enviar el correo al servidor (por ejemplo, para comprobar si ya está registrado)
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
  } else {
    alert("Correo ya registrado o error.");
  }
});

document.getElementById("ocultarParrafo").addEventListener("click", () => {
  document.getElementById("parrafo").style.display = "none";
  const textarea = document.getElementById("respuesta");
  textarea.disabled = false;
  textarea.focus();
  document.getElementById("enviarRespuesta").disabled = false;
});

// Aquí agregamos la parte del tiempo de escritura y el envío de datos
let startTime; // Variable para almacenar el tiempo de inicio

document.getElementById("respuesta").addEventListener("focus", () => {
  startTime = Date.now(); // Empezar a contar el tiempo cuando el usuario empieza a escribir
});

document.getElementById("enviarRespuesta").addEventListener("click", async () => {
  const texto = document.getElementById("respuesta").value;
  const tiempoEscrito = Date.now() - startTime; // Tiempo que tomó escribir el texto
  const textoMostrado = document.getElementById("parrafo").textContent; // El texto que se muestra inicialmente
  const fecha = new Date().toLocaleString(); // Fecha actual

  // Crear el objeto con los datos a enviar
  const data = {
    correo: document.getElementById("correo").value,
    texto: textoMostrado,
    textoEscrito: texto,
    tiempoEscrito: tiempoEscrito,
    fecha: fecha
  };

  // Enviar los datos al backend en Netlify (función Lambda)
  const res = await fetch("/.netlify/functions/guardarResultados", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (res.status === 200) {
    alert("Respuesta guardada.");
  } else {
    alert("Hubo un problema al guardar los resultados.");
  }
});
