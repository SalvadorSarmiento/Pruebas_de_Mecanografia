const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const ruta = path.join(__dirname, "../..", "data", "resultados.json");

  let resultados = fs.existsSync(ruta) ? JSON.parse(fs.readFileSync(ruta)) : [];
  data.fecha = new Date().toISOString();
  resultados.push(data);

  fs.writeFileSync(ruta, JSON.stringify(resultados, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Guardado correctamente" }),
  };
};
