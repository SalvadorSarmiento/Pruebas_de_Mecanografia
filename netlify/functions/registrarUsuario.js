const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const ruta = path.join(__dirname, "../..", "data", "usuarios.json");

  let usuarios = fs.existsSync(ruta) ? JSON.parse(fs.readFileSync(ruta)) : [];

  data.fecha = new Date().toISOString();
  usuarios.push(data);

  fs.writeFileSync(ruta, JSON.stringify(usuarios, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Usuario registrado correctamente" }),
  };
};
