const fs = require("fs/promises");
const path = require("path");

async function cargarMascotas() {
  const archivo = path.join(__dirname, "..", "datos", "mascotas.json");
  const contenido = await fs.readFile(archivo, "utf8");
  const mascotas = JSON.parse(contenido);

  if (!Array.isArray(mascotas)) {
    throw new Error("El archivo de mascotas debe contener un arreglo.");
  }

  return mascotas;
}

module.exports = { cargarMascotas };