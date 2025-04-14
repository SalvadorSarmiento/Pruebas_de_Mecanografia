const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const emailNormalizado = email.trim().toLowerCase();
  const ruta = path.join(__dirname, "../..", "data", "usuarios.json");

  let usuarios = fs.existsSync(ruta) ? JSON.parse(fs.readFileSync(ruta)) : [];

  if (usuarios.find(u => u.email === email)) {
    return { statusCode: 409, body: "Correo ya existe" };
  }

  usuarios.push({ email });
  fs.writeFileSync(ruta, JSON.stringify(usuarios, null, 2));
  return { statusCode: 200, body: "Registrado correctamente" };
};