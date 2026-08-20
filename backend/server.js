const express = require("express");
const cors = require("cors");

const db = require("./database");

const app = express();

const PORT = 3000;

// ===================== MIDDLEWARE =====================

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ===================== RUTA PRINCIPAL =====================

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend RH Dashboard funcionando correctamente",
    estado: "OK"
  });
});

// ===================== AUTENTICACIÓN =====================

app.post("/api/login", (req, res) => {

  const {
    usuario,
    password,
    rol
  } = req.body;

  const usuarios = {

    admin: {
      usuario: process.env.ADMIN_USUARIO,
      password: process.env.ADMIN_PASSWORD,
      rol: "admin"
    },

    rrhh: {
      usuario: process.env.RRHH_USUARIO,
      password: process.env.RRHH_PASSWORD,
      rol: "rrhh"
    },

    supervisor: {
      usuario: process.env.SUPERVISOR_USUARIO,
      password: process.env.SUPERVISOR_PASSWORD,
      rol: "supervisor"
    }

  };

  const usuarioConfigurado =
    usuarios[rol];

  if (
    !usuarioConfigurado ||
    usuario !== usuarioConfigurado.usuario ||
    password !== usuarioConfigurado.password
  ) {

    return res.status(401).json({
      error: "Credenciales incorrectas"
    });

  }

  res.json({

    mensaje: "Inicio de sesión correcto",

    usuario: {
      usuario: usuarioConfigurado.usuario,
      rol: usuarioConfigurado.rol
    }

  });

});

// ===================== EMPLEADOS =====================

app.get("/api/empleados", (req, res) => {

  const empleados = db
    .prepare("SELECT * FROM empleados ORDER BY id DESC")
    .all();

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.json(empleados);

});

// ===================== CREAR EMPLEADO =====================

app.post("/api/empleados", (req, res) => {

  const {
    nombre,
    dni,
    actividad,
    area,
    etapa,
    fecha,
    fechaIngreso,
    comentario
  } = req.body;

  if (!nombre) {

    return res.status(400).json({
      error: "El nombre es obligatorio"
    });

  }

  const resultado = db.prepare(`
    INSERT INTO empleados (
      nombre,
      dni,
      actividad,
      area,
      etapa,
      fecha,
      fechaIngreso,
      comentario
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    nombre,
    dni || "",
    actividad || "",
    area || "",
    etapa || "Postulante",
    fecha || "",
    fechaIngreso || "",
    comentario || ""
  );

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  res.status(201).json({
    mensaje: "Empleado creado correctamente",
    id: resultado.lastInsertRowid
  });

});

// ===================== EDITAR EMPLEADO =====================

app.put("/api/empleados/:id", (req, res) => {

  const id = Number(req.params.id);

  const {
    nombre,
    dni,
    actividad,
    area,
    etapa,
    fecha,
    fechaIngreso,
    comentario
  } = req.body;

  if (!nombre) {
    return res.status(400).json({
      error: "El nombre es obligatorio"
    });
  }

  const resultado = db.prepare(`
    UPDATE empleados
    SET
      nombre = ?,
      dni = ?,
      actividad = ?,
      area = ?,
      etapa = ?,
      fecha = ?,
      fechaIngreso = ?,
      comentario = ?
    WHERE id = ?
  `).run(
    nombre,
    dni || "",
    actividad || "",
    area || "",
    etapa || "Postulante",
    fecha || "",
    fechaIngreso || "",
    comentario || "",
    id
  );

  if (resultado.changes === 0) {
    return res.status(404).json({
      error: "Empleado no encontrado"
    });
  }

  res.setHeader(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  res.json({
    mensaje: "Empleado actualizado correctamente"
  });

});

// ===================== ELIMINAR EMPLEADO =====================

app.delete("/api/empleados/:id", (req, res) => {

  const id = Number(req.params.id);

  const resultado = db
    .prepare("DELETE FROM empleados WHERE id = ?")
    .run(id);

  if (resultado.changes === 0) {
    return res.status(404).json({
      error: "Empleado no encontrado"
    });
  }

  res.setHeader(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  res.json({
    mensaje: "Empleado eliminado correctamente"
  });

});

// ===================== POSTULANTES =====================

// OBTENER POSTULANTES

app.get("/api/postulantes", (req, res) => {

  const postulantes = db
    .prepare("SELECT * FROM postulantes ORDER BY id DESC")
    .all();

  res.setHeader(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  res.json(postulantes);

});


// CREAR POSTULANTE

app.post("/api/postulantes", (req, res) => {

  const {
    nombres,
    apellidos,
    dni,
    correo,
    celular,
    fechaNacimiento,
    area,
    puesto,
    experiencia,
    disponibilidad,
    motivacion,
    habilidades,
    logro,
    linkedin,
    github,
    cvNombre,
    cvArchivo,
    estado,
    fecha
  } = req.body;


  if (!nombres || !apellidos) {

    return res.status(400).json({
      error: "Los nombres y apellidos son obligatorios"
    });

  }


  const resultado = db.prepare(`
    INSERT INTO postulantes (
      nombres,
      apellidos,
      dni,
      correo,
      celular,
      fechaNacimiento,
      area,
      puesto,
      experiencia,
      disponibilidad,
      motivacion,
      habilidades,
      logro,
      linkedin,
      github,
      cvNombre,
      cvArchivo,
      estado,
      fecha
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    nombres || "",
    apellidos || "",
    dni || "",
    correo || "",
    celular || "",
    fechaNacimiento || "",
    area || "",
    puesto || "",
    experiencia || "",
    disponibilidad || "",
    motivacion || "",
    habilidades || "",
    logro || "",
    linkedin || "",
    github || "",
    cvNombre || "",
    cvArchivo || "",
    estado || "En evaluación",
    fecha || new Date().toISOString().split("T")[0]
  );


  res.status(201).json({

    mensaje: "Postulante registrado correctamente",

    id: resultado.lastInsertRowid

  });

});

// ===================== ACEPTAR POSTULANTE =====================

app.put("/api/postulantes/:id/aceptar", (req, res) => {

  const id = Number(req.params.id);

  const postulante = db
    .prepare("SELECT * FROM postulantes WHERE id = ?")
    .get(id);

  if (!postulante) {
    return res.status(404).json({
      error: "Postulante no encontrado"
    });
  }

  if (postulante.estado === "Aceptado") {
    return res.status(400).json({
      error: "El postulante ya fue aceptado"
    });
  }

  const fechaIngreso =
    new Date().toISOString().split("T")[0];

  const nombreCompleto =
    `${postulante.nombres} ${postulante.apellidos}`.trim();

  const resultado = db.transaction(() => {

    const empleado = db.prepare(`
      INSERT INTO empleados (
        nombre,
        dni,
        actividad,
        area,
        etapa,
        fecha,
        fechaIngreso,
        comentario
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      nombreCompleto,
      postulante.dni || "",
      postulante.puesto || "",
      postulante.area || "",
      "Postulante",
      postulante.fecha || "",
      fechaIngreso,
      "Postulante aceptado desde el portal de empleo"
    );

    db.prepare(`
      UPDATE postulantes
      SET
        estado = ?,
        fechaAceptacion = ?
      WHERE id = ?
    `).run(
      "Aceptado",
      Date.now(),
      id
    );

    return empleado.lastInsertRowid;

  })();

  res.json({
    mensaje: "Postulante aceptado correctamente",
    empleadoId: resultado
  });

});

// ===================== RECHAZAR POSTULANTE =====================

app.put("/api/postulantes/:id/rechazar", (req, res) => {

  const id = Number(req.params.id);

  const resultado = db.prepare(`
    UPDATE postulantes
    SET
      estado = ?,
      fechaRechazo = ?
    WHERE id = ?
  `).run(
    "Rechazado",
    Date.now(),
    id
  );

  if (resultado.changes === 0) {
    return res.status(404).json({
      error: "Postulante no encontrado"
    });
  }

  res.json({
    mensaje: "Postulante rechazado correctamente"
  });

});

// ===================== DESHACER ACEPTACIÓN =====================

app.put("/api/postulantes/:id/deshacer", (req, res) => {

  const id = Number(req.params.id);

  const postulante = db
    .prepare("SELECT * FROM postulantes WHERE id = ?")
    .get(id);

  if (!postulante) {

    return res.status(404).json({
      error: "Postulante no encontrado"
    });

  }

  if (postulante.estado !== "Aceptado") {

    return res.status(400).json({
      error: "El postulante no está aceptado"
    });

  }

  db.transaction(() => {

    const nombreCompleto =
      `${postulante.nombres} ${postulante.apellidos}`.trim();

    // Eliminar el empleado creado al aceptar
    db.prepare(`
      DELETE FROM empleados
      WHERE nombre = ?
    `).run(nombreCompleto);

    // Regresar postulante a evaluación
    db.prepare(`
      UPDATE postulantes
      SET
        estado = ?,
        fechaAceptacion = NULL
      WHERE id = ?
    `).run(
      "En evaluación",
      id
    );

  })();

  res.json({
    mensaje: "Contratación revertida correctamente"
  });

});

// ===================== HISTORIAL DE ETAPAS =====================

// OBTENER HISTORIAL DE UN EMPLEADO

app.get("/api/empleados/:id/historial", (req, res) => {

  const empleadoId = Number(req.params.id);

  const historial = db.prepare(`
    SELECT *
    FROM historial_etapas
    WHERE empleado_id = ?
    ORDER BY id ASC
  `).all(empleadoId);

  res.json(historial);

});


// CREAR HISTORIAL DE ETAPA

app.post("/api/empleados/:id/historial", (req, res) => {

  const empleadoId = Number(req.params.id);

  const { etapa } = req.body;

  if (!etapa) {

    return res.status(400).json({
      error: "La etapa es obligatoria"
    });

  }

  const empleado = db
    .prepare(`
      SELECT id
      FROM empleados
      WHERE id = ?
    `)
    .get(empleadoId);

  if (!empleado) {

    return res.status(404).json({
      error: "Empleado no encontrado"
    });

  }

  const fechaCambio = new Date().toLocaleString();

  const resultado = db.prepare(`
    INSERT INTO historial_etapas (
      empleado_id,
      etapa,
      fechaCambio
    )
    VALUES (?, ?, ?)
  `).run(
    empleadoId,
    etapa,
    fechaCambio
  );

  res.status(201).json({
    mensaje: "Historial registrado correctamente",
    id: resultado.lastInsertRowid
  });

});

// ===================== ACTIVIDADES =====================


app.get("/api/actividades", (req, res) => {

  const actividades = db
    .prepare("SELECT * FROM actividades ORDER BY id DESC")
    .all();

  res.setHeader(
    "Content-Type",
    "application/json; charset=utf-8"
  );

  res.json(actividades);

});


// CREAR ACTIVIDAD
app.post("/api/actividades", (req, res) => {

  const {
    nombre,
    puesto,
    area,
    fechaIngreso,
    actividad,
    fechaInicio,
    fechaFin,
    estado,
    estadoEmpleado
  } = req.body;

  if (!nombre) {

    return res.status(400).json({
      error: "El nombre del empleado es obligatorio"
    });

  }

  const resultado = db.prepare(`
    INSERT INTO actividades (
      nombre,
      puesto,
      area,
      fechaIngreso,
      actividad,
      fechaInicio,
      fechaFin,
      estado,
      estadoEmpleado
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    nombre,
    puesto || "",
    area || "",
    fechaIngreso || "",
    actividad || "",
    fechaInicio || "",
    fechaFin || "",
    estado || "Pendiente",
    estadoEmpleado || "Activo"
  );

  res.status(201).json({
    mensaje: "Actividad creada correctamente",
    id: resultado.lastInsertRowid
  });

});


// ===================== EDITAR ACTIVIDAD =====================

app.put("/api/actividades/:id", (req, res) => {

  const id = Number(req.params.id);

  const {
    nombre,
    puesto,
    area,
    fechaIngreso,
    actividad,
    fechaInicio,
    fechaFin,
    estado,
    estadoEmpleado
  } = req.body;

  const resultado = db.prepare(`
    UPDATE actividades
    SET
      nombre = ?,
      puesto = ?,
      area = ?,
      fechaIngreso = ?,
      actividad = ?,
      fechaInicio = ?,
      fechaFin = ?,
      estado = ?,
      estadoEmpleado = ?
    WHERE id = ?
  `).run(
    nombre || "",
    puesto || "",
    area || "",
    fechaIngreso || "",
    actividad || "",
    fechaInicio || "",
    fechaFin || "",
    estado || "Pendiente",
    estadoEmpleado || "Activo",
    id
  );

  if (resultado.changes === 0) {

    return res.status(404).json({
      error: "Actividad no encontrada"
    });

  }

  res.json({
    mensaje: "Actividad actualizada correctamente"
  });

});

// ===================== ELIMINAR ACTIVIDAD =====================

app.delete("/api/actividades/:id", (req, res) => {

  const id = Number(req.params.id);

  const resultado = db
    .prepare("DELETE FROM actividades WHERE id = ?")
    .run(id);

  if (resultado.changes === 0) {

    return res.status(404).json({
      error: "Actividad no encontrada"
    });

  }

  res.json({
    mensaje: "Actividad eliminada correctamente"
  });

});

// ===================== OBSERVACIONES =====================

// OBTENER OBSERVACIONES DE UN EMPLEADO

app.get("/api/empleados/:id/observaciones", (req, res) => {

  const empleadoId = Number(req.params.id);

  const observaciones = db.prepare(`
    SELECT *
    FROM observaciones
    WHERE empleado_id = ?
    ORDER BY id DESC
  `).all(empleadoId);

  res.json(observaciones);

});


// CREAR OBSERVACIÓN

app.post("/api/empleados/:id/observaciones", (req, res) => {

  const empleadoId = Number(req.params.id);

  const { texto } = req.body;

  if (!texto || !texto.trim()) {

    return res.status(400).json({
      error: "El comentario no puede estar vacío"
    });

  }

  const empleado = db
    .prepare("SELECT id FROM empleados WHERE id = ?")
    .get(empleadoId);

  if (!empleado) {

    return res.status(404).json({
      error: "Empleado no encontrado"
    });

  }

  const fecha =
    new Date().toLocaleString();

  const resultado = db.prepare(`
    INSERT INTO observaciones (
      empleado_id,
      texto,
      fecha
    )
    VALUES (?, ?, ?)
  `).run(
    empleadoId,
    texto.trim(),
    fecha
  );

  res.status(201).json({
    mensaje: "Observación creada correctamente",
    id: resultado.lastInsertRowid
  });

});


// ELIMINAR OBSERVACIÓN

app.delete(
  "/api/empleados/:empleadoId/observaciones/:id",
  (req, res) => {

    const empleadoId =
      Number(req.params.empleadoId);

    const id =
      Number(req.params.id);

    const resultado = db.prepare(`
      DELETE FROM observaciones
      WHERE id = ?
      AND empleado_id = ?
    `).run(
      id,
      empleadoId
    );

    if (resultado.changes === 0) {

      return res.status(404).json({
        error: "Observación no encontrada"
      });

    }

    res.json({
      mensaje: "Observación eliminada correctamente"
    });

  }
);


// ELIMINAR REGISTRO DEL HISTORIAL

app.delete(
  "/api/empleados/:empleadoId/historial/:id",
  (req, res) => {

    const empleadoId =
      Number(req.params.empleadoId);

    const id =
      Number(req.params.id);

    const resultado = db.prepare(`
      DELETE FROM historial_etapas
      WHERE id = ?
      AND empleado_id = ?
    `).run(
      id,
      empleadoId
    );

    if (resultado.changes === 0) {

      return res.status(404).json({
        error: "Registro de historial no encontrado"
      });

    }

    res.json({
      mensaje: "Registro de historial eliminado correctamente"
    });

  }
);


// ===================== HISTORIAL GENERAL =====================

// OBTENER HISTORIAL

app.get("/api/historial", (req, res) => {

  const historial = db.prepare(`
    SELECT *
    FROM historial
    ORDER BY id DESC
    LIMIT 20
  `).all();

  res.json(historial);

});


// CREAR REGISTRO DE HISTORIAL

app.post("/api/historial", (req, res) => {

  const { mensaje } = req.body;

  if (!mensaje || !mensaje.trim()) {

    return res.status(400).json({
      error: "El mensaje es obligatorio"
    });

  }

  const fecha =
    new Date().toLocaleString();

  const resultado = db.prepare(`
    INSERT INTO historial (
      mensaje,
      fecha
    )
    VALUES (?, ?)
  `).run(
    mensaje.trim(),
    fecha
  );

  // Mantener solamente los últimos 20 registros

  db.prepare(`
    DELETE FROM historial
    WHERE id NOT IN (
      SELECT id
      FROM historial
      ORDER BY id DESC
      LIMIT 20
    )
  `).run();

  res.status(201).json({

    mensaje: "Historial registrado correctamente",

    id: resultado.lastInsertRowid,

    fecha

  });

});


// ELIMINAR TODO EL HISTORIAL

app.delete("/api/historial", (req, res) => {

  db.prepare(`
    DELETE FROM historial
  `).run();

  res.json({
    mensaje: "Historial eliminado correctamente"
  });

});

// ===================== INICIAR SERVIDOR =====================

app.listen(PORT, () => {
  console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});