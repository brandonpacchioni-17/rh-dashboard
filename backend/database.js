const Database = require("better-sqlite3");
const path = require("path");

const rutaBaseDatos = path.join(__dirname, "rh_dashboard.db");

const db = new Database(rutaBaseDatos);

db.pragma("journal_mode = WAL");


// ===================== EMPLEADOS =====================

db.exec(`
  CREATE TABLE IF NOT EXISTS empleados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    dni TEXT,
    actividad TEXT,
    area TEXT,
    etapa TEXT,
    fecha TEXT,
    fechaIngreso TEXT,
    comentario TEXT
  );
`);


// ===================== POSTULANTES =====================

db.exec(`
  CREATE TABLE IF NOT EXISTS postulantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombres TEXT,
    apellidos TEXT,
    dni TEXT,
    correo TEXT,
    celular TEXT,
    fechaNacimiento TEXT,

    area TEXT,
    puesto TEXT,
    experiencia TEXT,
    disponibilidad TEXT,

    motivacion TEXT,
    habilidades TEXT,
    logro TEXT,

    linkedin TEXT,
    github TEXT,

    cvNombre TEXT,
    cvArchivo TEXT,

    estado TEXT,
    fecha TEXT,
    fechaAceptacion TEXT,
    fechaRechazo TEXT
  );
`);

// ===================== ACTIVIDADES =====================

db.exec(`
  CREATE TABLE IF NOT EXISTS actividades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    puesto TEXT,
    area TEXT,
    fechaIngreso TEXT,
    actividad TEXT,
    fechaInicio TEXT,
    fechaFin TEXT,
    estado TEXT,
    estadoEmpleado TEXT
  );
`);

// ===================== HISTORIAL DE ETAPAS =====================

db.exec(`
  CREATE TABLE IF NOT EXISTS historial_etapas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleadoId INTEGER NOT NULL,
    etapa TEXT NOT NULL,
    fechaCambio TEXT NOT NULL,
    FOREIGN KEY (empleadoId)
      REFERENCES empleados(id)
      ON DELETE CASCADE
  );
`);

// ===================== OBSERVACIONES =====================

db.exec(`
  CREATE TABLE IF NOT EXISTS observaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER NOT NULL,
    texto TEXT NOT NULL,
    fecha TEXT NOT NULL,
    FOREIGN KEY (empleado_id)
      REFERENCES empleados(id)
      ON DELETE CASCADE
  );
`);


// ===================== HISTORIAL DE ETAPAS =====================

db.exec(`
  CREATE TABLE IF NOT EXISTS historial_etapas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER NOT NULL,
    etapa TEXT NOT NULL,
    fechaCambio TEXT NOT NULL,
    FOREIGN KEY (empleado_id)
      REFERENCES empleados(id)
      ON DELETE CASCADE
  );
`);

console.log("Base de datos SQLite inicializada correctamente.");

module.exports = db;