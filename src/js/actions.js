import { empleados, guardar, guardarEmpleadoBackend, actualizarEmpleadoBackend, eliminarEmpleadoBackend, cargarEmpleados } from "./data.js";
import { obtenerRol } from "./auth.js";
import { render } from "./ui.js";
import { areas, guardarAreas } from "./areas.js";
import { cargarAreas } from "./ui.js";
import { agregarHistorial, historial } from "./historial.js";
import { actividades, guardarActividades } from "./actividades.js";
import { renderActividades } from "./ui.js";

let editIndex = null;
let notiCooldown = false;



let lastNotiTime = 0;

export function notificar(mensaje, tipo = "info") {

  const now = Date.now();
  if (now - lastNotiTime < 400) return;
  lastNotiTime = now;

  
  const container = document.getElementById("noti-stack");
  if (!container) return;

  const iconos = {
    success: "✔",
    error: "✖",
    info: "ℹ",
    warning: "⚠"
  };

  const colores = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-slate-900",
    warning: "bg-yellow-500"
  };

  const noti = document.createElement("div");

  noti.className = `
    min-w-[260px]
    max-w-[320px]
    text-white px-4 py-3 rounded-lg shadow-2xl
    flex items-start gap-2
    transform translate-x-full opacity-0
    transition-all duration-300
    ${colores[tipo] || "bg-slate-900"}
  `;

  noti.innerHTML = `
    <span class="font-bold text-lg">${iconos[tipo] || "ℹ"}</span>
    <div class="flex-1 text-sm leading-tight">${mensaje}</div>
  `;

  container.appendChild(noti);

  // ENTRADA (animación tipo deslizar)
  requestAnimationFrame(() => {
    noti.classList.remove("translate-x-full", "opacity-0");
  });

  // SALIDA
  setTimeout(() => {
    noti.classList.add("translate-x-full", "opacity-0");

    setTimeout(() => {
      noti.remove();
    }, 300);
  }, 3000);
}


// ===================== MODAL =====================
export function abrirModal(index = null) {

  const emp = empleados[index];

  if (!emp && index !== null) return;

  const rol = obtenerRol();

  if (rol === "supervisor") {
    return;
  }
  editIndex = index;
  document.getElementById("modal").classList.remove("hidden");

  if (index !== null) {
    const emp = empleados[index];
    document.getElementById("nombre").value = emp.nombre;
    document.getElementById("dni").value = emp.dni || "";
    document.getElementById("actividad").value = emp.actividad;
    document.getElementById("area").value = emp.area;
    document.getElementById("etapa").value = emp.etapa;
    document.getElementById("fechaPostulacion").value =
  emp.fecha || "";
    document.getElementById("fechaIngreso").value =
    emp.fechaIngreso || "";
  } else {
    document.getElementById("nombre").value = "";
    document.getElementById("dni").value = "";
    document.getElementById("actividad").value = "";
    document.getElementById("area").value = "";
    document.getElementById("etapa").value = "Postulante";
    document.getElementById("fechaIngreso").value = "";

    const inputNueva = document.getElementById("nueva-area");
    inputNueva.classList.remove("hidden");
  }
}

export function cerrarModal() {
  document.getElementById("nueva-area").value = "";
  document.getElementById("modal").classList.add("hidden");
  editIndex = null;
}

async function agregarActividadBackend(datos) {

  try {

    const respuesta =
      await fetch(
        "http://localhost:3000/api/actividades",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(datos)
        }
      );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo crear la actividad"
      );

    }

    return resultado;

  } catch (error) {

    console.error(
      "Error al guardar actividad:",
      error
    );

    return null;

  }

}

// ===================== HISTORIAL DE ETAPAS =====================

async function agregarHistorialBackend(empleadoId, etapa) {

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/empleados/${empleadoId}/historial`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          etapa
        })
      }
    );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo guardar el historial"
      );

    }

    console.log(
      "Historial guardado en SQLite:",
      resultado
    );

    return resultado;

  } catch (error) {

    console.error(
      "Error al guardar historial:",
      error
    );

    return null;

  }

}

// ===================== CRUD =====================

export async function guardarEmpleado() {


  const fecha = document.getElementById("fechaPostulacion").value;
  const fechaIngreso = document.getElementById("fechaIngreso").value;
  const errorFecha = document.getElementById("error-fechaPostulacion");
  const nombre = document.getElementById("nombre").value.trim();
  const actividad = document.getElementById("actividad").value.trim();
  const dni = document.getElementById("dni").value.trim();
  let area = document.getElementById("area").value.trim();
  const etapa = document.getElementById("etapa").value;

  let fechaIngresoFinal = fechaIngreso;


if (
  etapa === "Contratado" &&
  !fechaIngresoFinal
) {

  fechaIngresoFinal =
    new Date().toISOString().split("T")[0];
}


if (etapa !== "Contratado") {

  fechaIngresoFinal = "";
}


  const nuevaArea = document.getElementById("nueva-area").value.trim();
  const botonGuardar = document.getElementById("btnGuardar");

  const errorNombre = document.getElementById("error-nombre");
  const errorActividad = document.getElementById("error-actividad");
  const errorArea = document.getElementById("error-area");
  const errorExiste = document.getElementById("error-existe");
  const errorAreaExiste = document.getElementById("error-area-existe");







  errorFecha.classList.add("hidden");
  errorNombre.classList.add("hidden");
  errorActividad.classList.add("hidden");
  errorArea.classList.add("hidden");
  if (errorExiste) errorExiste.classList.add("hidden");
  if (errorAreaExiste) errorAreaExiste.classList.add("hidden");

  let valido = true;

  if (!nombre) {
    errorNombre.classList.remove("hidden");
    valido = false;
  }

  if (!actividad) {
    errorActividad.classList.remove("hidden");
    valido = false;
  }

  if (!fecha) {
  errorFecha.classList.remove("hidden");
  valido = false;
}


const hoy = new Date()
  .toISOString()
  .split("T")[0];

if (fecha > hoy) {

  errorFecha.classList.remove("hidden");

  errorFecha.innerText =
    "La fecha no puede ser futura";

  valido = false;

}


  // ================= NORMALIZAR ÁREA =================
let areaFinal = area;

if (nuevaArea) {
  areaFinal = nuevaArea;
}

// ================= VALIDACIÓN =================
if (!areaFinal) {
  errorArea.classList.remove("hidden");
  valido = false;
}

if (!valido) return;

botonGuardar.disabled = true;
botonGuardar.innerText = "Guardando...";
botonGuardar.classList.add("opacity-70");

  // ================= NUEVA ÁREA =================
  if (nuevaArea) {

    const existeArea = areas.some(a =>
      a.toLowerCase() === nuevaArea.toLowerCase()
    );

    if (existeArea) {
      if (errorAreaExiste) errorAreaExiste.classList.remove("hidden");
      return;
    }

    area = nuevaArea;

    areas.push(nuevaArea);
    guardarAreas();

    cargarAreas();

    document.getElementById("area").value = nuevaArea;
  }

  // ================= DUPLICADO =================
  const existe = empleados.some((e, i) =>
    e.nombre.toLowerCase() === nombre.toLowerCase() &&
    e.area.toLowerCase() === area.toLowerCase() &&
    i !== editIndex
  );

  if (existe) {
    if (errorExiste) errorExiste.classList.remove("hidden");
    return;
  }


// ===================== GUARDAR =====================

const empleadoData = {
  nombre,
  dni,
  actividad,
  area: areaFinal,
  etapa,
  fecha,
  fechaIngreso: fechaIngresoFinal,
  comentario: ""
};

if (editIndex === null) {

  const resultado =
    await guardarEmpleadoBackend(empleadoData);

  if (!resultado) {

    botonGuardar.disabled = false;
    botonGuardar.innerText = "Guardar";
    botonGuardar.classList.remove("opacity-70");

    notificar(
      "No se pudo conectar con el servidor",
      "error"
    );

    return;
  }

await cargarEmpleados();
const empleadoCreado =
  empleados.find(e =>
    e.nombre === nombre &&
    e.dni === dni
  );

if (empleadoCreado?.id) {

  await agregarHistorialBackend(
    empleadoCreado.id,
    etapa
  );

}

} else {

  const empleadoActual =
    empleados[editIndex];

  if (!empleadoActual?.id) {

    notificar(
      "El empleado no tiene un ID válido",
      "error"
    );

    botonGuardar.disabled = false;
    botonGuardar.innerText = "Guardar";
    botonGuardar.classList.remove("opacity-70");

    return;
  }

  const etapaAnterior =
  empleadoActual.etapa;

  const empleadoActualizado = {

    nombre,
    dni,
    actividad,
    area: areaFinal,
    etapa,
    fecha,
    fechaIngreso: fechaIngresoFinal,
    comentario:
      empleadoActual.comentario || ""
  };

  

  const resultado =
    await actualizarEmpleadoBackend(
      empleadoActual.id,
      empleadoActualizado
    );

  if (!resultado) {

    botonGuardar.disabled = false;
    botonGuardar.innerText = "Guardar";
    botonGuardar.classList.remove("opacity-70");

    notificar(
      "No se pudo actualizar el empleado",
      "error"
    );

    return;
  }

  console.log(
    "Empleado actualizado correctamente:",
    resultado
  );

  if (etapaAnterior !== etapa) {

  await agregarHistorialBackend(
    empleadoActual.id,
    etapa
  );

}
}

 const esEdicion = editIndex !== null;


// ===================== ACTIVIDAD AUTOMÁTICA =====================

if (etapa === "Contratado") {

  const existeActividad =
    actividades.some(
      a =>
        a.nombre === nombre
    );

  if (!existeActividad) {

    console.log(
      "AGREGANDO ACTIVIDAD",
      nombre
    );

    const nuevaActividad = {

      nombre,

      puesto: actividad,

      area: areaFinal,

      fechaIngreso: fechaIngresoFinal,

      actividad: "",

      fechaInicio: "",

      fechaFin: "",

      estado: "Pendiente",

      estadoEmpleado: "Activo"

    };

    const resultado =
      await agregarActividadBackend(
        nuevaActividad
      );

    if (!resultado) {

      console.error(
        "No se pudo guardar la actividad en el backend"
      );

    } else {

      console.log(
        "Actividad creada en backend:",
        resultado
      );

    }

  }

}


// ===================== FINALIZAR =====================

guardar();

agregarHistorial(
  esEdicion
    ? `Empleado editado: ${nombre}`
    : `Empleado agregado: ${nombre}`
);

render();

cerrarModal();

botonGuardar.disabled = false;
botonGuardar.innerText = "Guardar";
botonGuardar.classList.remove("opacity-70");

notificar(
  esEdicion
    ? "Empleado actualizado"
    : "Empleado agregado correctamente",
  "success"
);

return;
}


let indexEliminar = null;

let indexActividadEliminar = null;

export function abrirModalEliminar(index) {

  const rol = obtenerRol();

  if (rol !== "admin") {
    return;
  }

  indexEliminar = index;

  const empleado = empleados[index];
  const texto = document.getElementById("textoEliminar");
  const body = document.getElementById("body");

  const esOscuro = body.classList.contains("bg-slate-900");

  texto.innerText = `¿Eliminar a ${empleado.nombre} del sistema?`;

  texto.className = `
    mb-6 text-sm md:text-base
    ${esOscuro ? "text-slate-300" : "text-slate-900"}
  `;

  document
    .getElementById("modalEliminar")
    .classList.remove("hidden");
}

export function cerrarModalEliminar() {

  document
    .getElementById("modalEliminar")
    .classList.add("hidden");

  indexEliminar = null;
}
export async function eliminarEmpleado() {

  if (indexEliminar === null) return;

  const empleado =
    empleados[indexEliminar];

  if (!empleado) {

    cerrarModalEliminar();

    return;
  }

  if (!empleado.id) {

    notificar(
      "El empleado no tiene un ID válido",
      "error"
    );

    return;
  }

  const nombre =
    empleado.nombre;

  const resultado =
    await eliminarEmpleadoBackend(
      empleado.id
    );

  if (!resultado) {

    notificar(
      "No se pudo eliminar el empleado",
      "error"
    );

    return;
  }

  await cargarEmpleados();

  agregarHistorial(
    `Empleado eliminado: ${nombre}`
  );

  cerrarModalEliminar();

  await render();

  notificar(
    "Empleado eliminado correctamente",
    "success"
  );

}

// ===================== EXPORTAR =====================
export function exportarCSV() {

  // =====================
  // HOJA EMPLEADOS
  // =====================

  const empleadosData = empleados.map(e => ({
    Nombre: e.nombre,
    DNI: e.dni || "",
    Puesto: e.actividad,
    Area: e.area,
    Etapa: e.etapa,
    "Fecha Postulación": e.fecha || "",
    "Fecha Ingreso": e.fechaIngreso || "",
    Comentarios: e.observaciones?.length || 0
  }));


  // =====================
  // HOJA INDICADORES
  // =====================

  const indicadoresData = [

    {
      Indicador: "Total empleados",
      Valor: empleados.length
    },

    {
      Indicador: "Contratados",
      Valor: empleados.filter(
        e => e.etapa === "Contratado"
      ).length
    },

    {
      Indicador: "Entrevistas",
      Valor: empleados.filter(
        e =>
          e.etapa === "Entrevista virtual" ||
          e.etapa === "Entrevista presencial"
      ).length
    },

    {
      Indicador: "Postulantes truncos",
      Valor: empleados.filter(
        e => e.etapa === "Postulante trunco"
      ).length
    }

  ];


  // =====================
  // HOJA RESUMEN ÁREAS
  // =====================

  const resumenAreas = areas.map(area => ({

    Area: area,

    Total:
      empleados.filter(
        e => e.area === area
      ).length,

    Contratados:
      empleados.filter(
        e =>
          e.area === area &&
          e.etapa === "Contratado"
      ).length,

    Pendientes:
      empleados.filter(
        e =>
          e.area === area &&
          e.etapa !== "Contratado"
      ).length

  }));


  // =====================
  // HOJA DATOS GRÁFICO
  // =====================

  const datosGrafico = [

    {
      Estado: "Postulantes",
      Cantidad: empleados.filter(
        e => e.etapa === "Postulante"
      ).length
    },

    {
      Estado: "Entrevistas",
      Cantidad: empleados.filter(
        e =>
          e.etapa === "Entrevista virtual" ||
          e.etapa === "Entrevista presencial"
      ).length
    },

    {
      Estado: "Seleccionados",
      Cantidad: empleados.filter(
        e => e.etapa === "Seleccionado"
      ).length
    },

    {
      Estado: "Contratados",
      Cantidad: empleados.filter(
        e => e.etapa === "Contratado"
      ).length
    }

  ];
const historialData = historial.map(item => ({
  Actividad: item
}));

  // =====================
  // CREAR LIBRO
  // =====================

  const libro = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    libro,
    XLSX.utils.json_to_sheet(indicadoresData),
    "Indicadores"
  );

  XLSX.utils.book_append_sheet(
    libro,
    XLSX.utils.json_to_sheet(resumenAreas),
    "Resumen Areas"
  );

  XLSX.utils.book_append_sheet(
    libro,
    XLSX.utils.json_to_sheet(empleadosData),
    "Empleados"
  );

  
  const hojaGrafico = XLSX.utils.aoa_to_sheet([
  ["REPORTE DE RECLUTAMIENTO"],
  [],
  ["ESTADO", "CANTIDAD"],
  ["Postulantes", datosGrafico[0].Cantidad],
  ["Entrevistas", datosGrafico[1].Cantidad],
  ["Seleccionados", datosGrafico[2].Cantidad],
  ["Contratados", datosGrafico[3].Cantidad]
]);

hojaGrafico["!cols"] = [
  { wch: 25 },
  { wch: 15 }
];

XLSX.utils.book_append_sheet(
  libro,
  hojaGrafico,
  "Grafico"
);

  XLSX.writeFile(
    libro,
    "Reporte_RRHH.xlsx"
  );

}

// ===================== DARK MODE =====================
export function toggleDarkMode() {

  const body = document.getElementById("body");
  const botonModo = document.getElementById("botonModo");
  const selects = document.querySelectorAll("#container select");

selects.forEach(select => {

  select.classList.toggle("bg-white");
  select.classList.toggle("bg-slate-700");

  select.classList.toggle("text-black");
  select.classList.toggle("text-white");

  select.classList.toggle("border-slate-300");
  select.classList.toggle("border-slate-600");

});

  body.classList.toggle("dark");
  body.classList.toggle("bg-slate-900");
  body.classList.toggle("bg-slate-100");

  const cards = document.querySelectorAll(".card");
  const inputsRegistro = document.querySelectorAll(".registro-input");
  const titulosCard = document.querySelectorAll(".tituloCard");
  const numerosCard = document.querySelectorAll(".numeroCard");

  titulosCard.forEach(t => {
    t.classList.toggle("text-gray-500");
    t.classList.toggle("text-slate-300");
  });


  numerosCard.forEach(n => {

  n.classList.toggle("text-slate-800");
  n.classList.toggle("text-white");

});

  cards.forEach(card => {
    card.classList.toggle("bg-white");
    card.classList.toggle("bg-slate-800");
    card.classList.toggle("text-white");
  });

  inputsRegistro.forEach(input => {

  if (body.classList.contains("bg-slate-900")) {

    input.classList.add("bg-slate-700");
    input.classList.add("text-white");
    input.classList.add("border-slate-600");

    input.classList.remove("bg-white");
    input.classList.remove("text-black");
    input.classList.remove("border-slate-300");

  } else {

    input.classList.add("bg-white");
    input.classList.add("text-black");
    input.classList.add("border-slate-300");

    input.classList.remove("bg-slate-700");
    input.classList.remove("text-white");
    input.classList.remove("border-slate-600");
  }
});

  const titulo = document.getElementById("tituloPrincipal");
  titulo.classList.toggle("text-white");

  const tituloProgreso = document.getElementById("tituloProgreso");
  
  const tituloReportes = document.getElementById("tituloReportes");

if (tituloReportes) {
  tituloReportes.classList.toggle("text-slate-800");
  tituloReportes.classList.toggle("text-white");
}

  const tituloActividades = document.getElementById("tituloActividades");
  const tituloRegistro = document.getElementById("tituloRegistro");

if (tituloActividades) {
  tituloActividades.classList.toggle("text-slate-800");
  tituloActividades.classList.toggle("text-white");
}

if (tituloRegistro) {
  tituloRegistro.classList.toggle("text-slate-800");
  tituloRegistro.classList.toggle("text-white");
}

if (tituloProgreso) {
  tituloProgreso.classList.toggle("text-white");
}

  const buscador = document.querySelector(".buscador");
  buscador.classList.toggle("bg-slate-700");
  buscador.classList.toggle("text-white");
  buscador.classList.toggle("border-slate-600");

  const boton = document.querySelector(".botonAgregar");
  boton.classList.toggle("shadow-2xl");
  boton.classList.toggle("text-white");
  boton.classList.toggle("shadow-lg");

  const filtroTodos = document.querySelector(".filtroTodos");
  filtroTodos.classList.toggle("bg-slate-900");
  filtroTodos.classList.toggle("bg-white");
  filtroTodos.classList.toggle("text-white");
  filtroTodos.classList.toggle("text-black");

  if (body.classList.contains("bg-slate-900")) {
    localStorage.setItem("darkMode", "activo");
    botonModo.innerText = "Modo Claro";
    botonModo.classList.remove("bg-slate-900");
    botonModo.classList.add("bg-yellow-500");
  } else {
    localStorage.setItem("darkMode", "inactivo");
    botonModo.innerText = "Modo Oscuro";
    botonModo.classList.remove("bg-yellow-500");
    botonModo.classList.add("bg-slate-900");
  }

  const input = document.getElementById("nueva-area");

  if (input) {
    input.dispatchEvent(new Event("input"));
  }

  const modalConfirmacion = document.getElementById("modal-confirmacion");

  

if (modalConfirmacion) {

  if (body.classList.contains("bg-slate-900")) {

    modalConfirmacion.classList.remove("bg-white");
    modalConfirmacion.classList.add("bg-slate-800");

  } else {

    modalConfirmacion.classList.remove("bg-slate-800");
    modalConfirmacion.classList.add("bg-white");

  }
}

const modalPostulante = document.querySelector("#modal-postulante .card");

if (modalPostulante) {

  if (body.classList.contains("bg-slate-900")) {

    modalPostulante.classList.remove("bg-white");
    modalPostulante.classList.add("bg-slate-800");

  } else {

    modalPostulante.classList.remove("bg-slate-800");
    modalPostulante.classList.add("bg-white");

  }

}

const modalCards = document.querySelectorAll(".modal-card");

modalCards.forEach(card => {

  if (body.classList.contains("bg-slate-900")) {

    card.classList.remove("bg-slate-50");
    card.classList.add("bg-slate-700");

  } else {

    card.classList.remove("bg-slate-700");
    card.classList.add("bg-slate-50");

  }

});

  render();
}


// ===================== DUPLICADO EN TIEMPO REAL =====================

export function validarDuplicadoTiempoReal() {
  const nombre = document.getElementById("nombre").value.trim().toLowerCase();
  const areaSelect = document.getElementById("area").value.trim().toLowerCase();
  const nuevaArea = document.getElementById("nueva-area").value.trim().toLowerCase();

  let area = areaSelect;

if (nuevaArea) {
  area = nuevaArea;
}

  const errorExiste = document.getElementById("error-existe");
  const sugerencia = document.getElementById("sugerencia-editar");
  const boton = document.getElementById("btnGuardar");

  errorExiste.classList.add("hidden");

  if (sugerencia) {
  sugerencia.classList.add("hidden");
  }

  if (!nombre || !area) {
    boton.innerText = "Guardar";
    return;
  }

  const index = empleados.findIndex(e =>
    e.nombre.toLowerCase() === nombre &&
    e.area.toLowerCase() === area
  );

  if (index !== -1 && index !== editIndex) {

    errorExiste.classList.remove("hidden");

  if (sugerencia) {
  sugerencia.classList.remove("hidden");
  }

  
    boton.innerText = "Editar existente";
    boton.classList.remove("bg-slate-900");
    boton.classList.add("bg-yellow-500");

    boton.onclick = null;
    boton.onclick = () => abrirModal(index);

   if (sugerencia) {
  sugerencia.onclick = () => abrirModal(index);
  }

  } else {

    boton.innerText = "Guardar";
    boton.classList.remove("bg-yellow-500");
    boton.classList.add("bg-slate-900");
    boton.onclick = guardarEmpleado;
  }
}

export function eliminarArea() {

  const select = document.getElementById("area");
  const areaSeleccionada = select.value;

  if (!areaSeleccionada) return;

  const confirmar = confirm(`¿Eliminar el área "${areaSeleccionada}"?`);

  if (!confirmar) return;


  const index = areas.indexOf(areaSeleccionada);
  if (index !== -1) {
    areas.splice(index, 1);
  }


  const nuevos = empleados.filter(e => e.area !== areaSeleccionada);
  empleados.length = 0;
  empleados.push(...nuevos);

  guardarAreas();
  guardar();

  cargarAreas();

  agregarHistorial(`Área eliminada: ${areaSeleccionada}`);

  render();

  notificar("Área eliminada correctamente", "error");

  

  document.getElementById("area").value = "";
  document.getElementById("nueva-area").classList.remove("hidden");
  document.getElementById("nueva-area").value = "";

}


// ===================== REGISTRO AUTOMÁTICO =====================

export async function registroAutomatico() {

  const rol = obtenerRol();

  if (rol === "supervisor") {
    return;
  }

  const nombres =
    document.getElementById("registroNombres").value.trim();

  const apellidos =
    document.getElementById("registroApellidos").value.trim();

  const dni =
    document.getElementById("registroDni").value.trim();

  const actividad =
    document.getElementById("registroActividad").value.trim();

  const fecha =
    document.getElementById("registroFecha").value;



  // VALIDACIONES

  if (
    !nombres ||
    !apellidos ||
    !dni ||
    !actividad ||
    !fecha
  ) {

    notificar(
      "Completa todos los campos",
      "bg-red-500"
    );

    return;
  }

  // NOMBRE COMPLETO

  const nombreCompleto =
    `${apellidos} ${nombres}`;

  // NUEVO EMPLEADO

  const nuevoEmpleado = {

    nombre: nombreCompleto,

    dni,

    actividad,

    area: " - ",

    etapa: "Postulante",

    fecha,

    fechaIngreso: "",

    comentario: ""

  };

  const resultado =
    await guardarEmpleadoBackend(
      nuevoEmpleado
    );

  if (!resultado) {

    notificar(
      "No se pudo registrar el empleado en el servidor",
      "error"
    );

    return;
  }

  await cargarEmpleados();

  // LIMPIAR CAMPOS

  document.getElementById("registroNombres").value = "";
  document.getElementById("registroApellidos").value = "";
  document.getElementById("registroDni").value = "";
  document.getElementById("registroActividad").value = "";
  document.getElementById("registroFecha").value = "";

  // HISTORIAL

  agregarHistorial(`Registro automático: ${nombreCompleto}`); 

  // ACTUALIZAR TABLA

  render();

  

  // CAMBIAR A GESTIÓN

  window.cambiarSeccion("gestion");

  // MENSAJE

  notificar("Empleado registrado correctamente", "success");

}

export function actualizarActividad(index, valor) {

  actividades[index].actividad = valor;

  guardarActividades();

  renderActividades();

}

export async function actualizarFechaInicio(index, valor) {

  const actividad = actividades[index];

  actividad.fechaInicio = valor;

  await actualizarActividadBackend(actividad);

  renderActividades();

}

async function actualizarActividadBackend(actividad) {

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/actividades/${actividad.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(actividad)
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo actualizar la actividad"
      );

    }

    console.log(
      "Actividad actualizada en SQLite:",
      resultado
    );

    return true;

  } catch (error) {

    console.error(
      "Error al actualizar actividad:",
      error
    );

    return false;

  }

}

export async function actualizarFechaFin(index, valor) {

  const actividad = actividades[index];

  actividad.fechaFin = valor;

  await actualizarActividadBackend(actividad);

  renderActividades();

}

export async function actualizarEstado(index, valor) {

  const actividad = actividades[index];

  actividad.estado = valor;

  await actualizarActividadBackend(actividad);

  renderActividades();

}

export async function actualizarEstadoEmpleado(index, valor) {

  const actividad = actividades[index];

  actividad.estadoEmpleado = valor;

  await actualizarActividadBackend(actividad);

  renderActividades();

}

export function abrirModalEliminarActividad(index) {

  indexActividadEliminar = index;

  const actividad = actividades[index];

  const texto =
    document.getElementById(
      "textoEliminarActividad"
    );

  texto.innerText =
    `¿Eliminar la actividad de ${actividad.nombre}?`;

  document
    .getElementById("modalEliminarActividad")
    .classList.remove("hidden");

}

export function cerrarModalEliminarActividad() {

  document
    .getElementById("modalEliminarActividad")
    .classList.add("hidden");

  indexActividadEliminar = null;

}

export function eliminarActividad() {

  if (indexActividadEliminar === null)
    return;

  actividades.splice(
    indexActividadEliminar,
    1
  );

  guardarActividades();

  renderActividades();

  cerrarModalEliminarActividad();

  notificar(
    "Actividad eliminada",
    "error"
  );

}

window.actualizarActividad =
  actualizarActividad;

window.actualizarFechaInicio =
  actualizarFechaInicio;

window.actualizarFechaFin =
  actualizarFechaFin;

window.actualizarEstado =
  actualizarEstado;

window.actualizarEstadoEmpleado =
  actualizarEstadoEmpleado;

window.eliminarActividad =
  eliminarActividad;
window.abrirModalEliminarActividad =
  abrirModalEliminarActividad;

window.cerrarModalEliminarActividad =
  cerrarModalEliminarActividad;

export function guardarComentario(index, texto) {

  empleados[index].comentario = texto;

  guardar();

  agregarHistorial(
    `Comentario actualizado: ${empleados[index].nombre}`
  );

}

// ===================== MODAL CONFIRMACION =====================

let accionConfirmada = null;


export function abrirConfirmacion(titulo, mensaje, callback){

    const modal =
    document.getElementById("modal-confirmacion");


    const tituloBox =
    document.getElementById("titulo-confirmacion");


    const mensajeBox =
    document.getElementById("mensaje-confirmacion");


    if(!modal) return;


    tituloBox.innerText = titulo;

    mensajeBox.innerText = mensaje;


    accionConfirmada = callback;


    modal.classList.remove("hidden");

    modal.classList.add("flex");

}



const btnConfirmar =
document.getElementById("btn-confirmar-accion");


if(btnConfirmar){

btnConfirmar.addEventListener(
"click",
()=>{


    if(accionConfirmada){

        accionConfirmada();

    }


    cerrarConfirmacion();


});


}



const btnCancelar =
document.getElementById("btn-cancelar-confirmacion");


if(btnCancelar){

btnCancelar.addEventListener(
"click",
()=>{

    cerrarConfirmacion();

});

}



export function cerrarConfirmacion(){

const modal =
document.getElementById("modal-confirmacion");


if(!modal) return;


modal.classList.add("hidden");

modal.classList.remove("flex");


accionConfirmada = null;


}