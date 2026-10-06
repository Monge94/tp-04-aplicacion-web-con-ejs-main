const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const { cargarMascotas } = require("./archivos");

const app = express();
const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  let mascotas;

  try {
    mascotas = await cargarMascotas();
  } catch (error) {
    console.error("No se pudieron cargar los datos iniciales:", error.message);
    process.exit(1);
  }

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.use(expressLayouts);
  app.set("layout", "layouts/main");
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/", (req, res) => {
    res.render("inicio", {
      title: "Inicio | Mascotas en adopción"
    });
  });

  app.get("/mascotas", (req, res) => {
    res.render("mascotas/lista", {
      title: "Catálogo | Mascotas en adopción",
      mascotas
    });
  });

  app.get("/mascotas/nueva", (req, res) => {
    res.render("mascotas/nueva", {
      title: "Nueva mascota | Mascotas en adopción",
      error: null,
      valores: {
        nombre: "",
        especie: "",
        edad: "",
        estado: "En adopción",
        descripcion: ""
      }
    });
  });

  app.get("/mascotas/:id", (req, res) => {
    const id = Number(req.params.id);
    const mascota = mascotas.find((item) => item.id === id);

    if (!mascota) {
      return res.status(404).render("no-encontrado", {
        title: "404 | Mascota no encontrada"
      });
    }

    return res.render("mascotas/detalle", {
      title: `${mascota.nombre} | Mascotas en adopción`,
      mascota
    });
  });

  app.post("/mascotas", (req, res) => {
    const valores = {
      nombre: String(req.body.nombre || "").trim(),
      especie: String(req.body.especie || "").trim(),
      edad: String(req.body.edad ?? "").trim(),
      estado: String(req.body.estado || "").trim(),
      descripcion: String(req.body.descripcion || "").trim()
    };

    const edad = Number(valores.edad);
    const estadosPermitidos = ["En adopción", "Reservada", "Adoptada"];
    let error = null;

    if (!valores.nombre || !valores.especie || !valores.edad ||
        !valores.estado || !valores.descripcion) {
      error = "Todos los campos son obligatorios.";
    } else if (!Number.isInteger(edad) || edad < 0) {
      error = "La edad debe ser un número entero mayor o igual a 0.";
    } else if (!estadosPermitidos.includes(valores.estado)) {
      error = "El estado seleccionado no es válido.";
    }

    if (error) {
      return res.status(400).render("mascotas/nueva", {
        title: "Nueva mascota | Mascotas en adopción",
        error,
        valores
      });
    }

    const nuevoId = mascotas.length
      ? Math.max(...mascotas.map((item) => item.id)) + 1
      : 1;

    mascotas.push({
      id: nuevoId,
      nombre: valores.nombre,
      especie: valores.especie,
      edad,
      descripcion: valores.descripcion,
      estado: valores.estado,
      imagen: "/img/mascota.svg"
    });

    return res.redirect("/mascotas");
  });

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      title: "404 | Página no encontrada"
    });
  });

  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
}

iniciarServidor().catch((error) => {
  console.error("Error inesperado al iniciar:", error);
  process.exit(1);
});