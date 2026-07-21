import { render } from "./ui.js";
import { login,logout,haySesion,obtenerUsuario } from "./auth.js";
import { setFiltro, setBusqueda } from "./filters.js";
import * as actions from "./actions.js";
import { registroAutomatico } from "./actions.js";
import { validarDuplicadoTiempoReal } from "./actions.js";
import { cargarAreas } from "./ui.js";
import { areas } from "./areas.js";
import { limpiarHistorial } from "./historial.js";
import { abrirPerfil, cerrarPerfil, agregarObservacion } from "./perfil.js";





function renderSugerencias(valor) {
  const boxSugerencias = document.getElementById("sugerencias-area");

  if (!valor) {
    boxSugerencias.classList.add("hidden");
    return;
  }

  const filtradas = areas.filter(a =>
    a.toLowerCase().includes(valor.toLowerCase())
  );

  if (filtradas.length === 0) {
    boxSugerencias.classList.add("hidden");
    return;
  }

  const oscuro = document
  .getElementById("body")
  .classList.contains("bg-slate-900");

  boxSugerencias.innerHTML = filtradas.map(a => `
    <div class="p-2 cursor-pointer ${
      oscuro
        ? "text-slate-100 hover:bg-slate-700"
        : "text-slate-800 hover:bg-slate-200"
    }">
      ${a}
    </div>
  `).join("");

  boxSugerencias.classList.remove("hidden");

  boxSugerencias.querySelectorAll("div").forEach(div => {
    div.addEventListener("click", () => {
      document.getElementById("nueva-area").value = div.innerText;
      boxSugerencias.classList.add("hidden");
    });
  });
}

document.getElementById("nueva-area").addEventListener("input", (e) => {
  renderSugerencias(e.target.value);
});


// ===================== Cargar areas =====================

cargarAreas();


document.getElementById("area").addEventListener("change", () => {
  const select = document.getElementById("area");
  const inputNueva = document.getElementById("nueva-area");

  if (select.value === "") {
    inputNueva.classList.remove("hidden");
  } else {
    inputNueva.classList.add("hidden");
    inputNueva.value = "";
  }
});

// ===================== Duplicado Tiempo Real =====================

document.getElementById("nombre").addEventListener("input", validarDuplicadoTiempoReal);
document.getElementById("area").addEventListener("input", validarDuplicadoTiempoReal);


// ===================== BARRA LATERAL =====================

let seccionActiva = "dashboard";

const rolActual = obtenerUsuario()?.rol;

if (rolActual === "supervisor") {
  seccionActiva = "gestion";
}

function cambiarSeccion(seccion) {

  const rol = obtenerUsuario()?.rol;

  if (
    rol === "supervisor" &&
    seccion === "registro"
  ) {
    return;
  }

  seccionActiva = seccion;
  actualizarVista();
}

function actualizarVista() {

  const dashboard = document.getElementById("seccion-dashboard");
  const registro = document.getElementById("seccion-registro");
  const gestion = document.getElementById("seccion-gestion");
  const reportes = document.getElementById("seccion-reportes");
  const historial = document.getElementById("seccion-historial");
  const actividades = document.getElementById("seccion-actividades");

  const titulo = document.getElementById("tituloPrincipal");

  const btnDashboard = document.getElementById("btn-dashboard");
  const btnRegistro = document.getElementById("btn-registro");
  const btnGestion = document.getElementById("btn-gestion");
  const btnReportes = document.getElementById("btn-reportes");
  const btnHistorial = document.getElementById("btn-historial");
  const btnActividades = document.getElementById("btn-actividades");


  


  const rol = obtenerUsuario()?.rol;

  if (rol === "supervisor") {

  if (btnRegistro) {
    btnRegistro.classList.add("hidden");
  }

}

  // ocultar secciones
  if (dashboard) dashboard.classList.add("hidden");
  if (registro) registro.classList.add("hidden");
  if (gestion) gestion.classList.add("hidden");
  if (reportes) reportes.classList.add("hidden");
  if (historial) historial.classList.add("hidden"); 
  if (actividades) actividades.classList.add("hidden");

  // limpiar estilos botones
  
    [
  btnDashboard,
  btnRegistro,
  btnGestion,
  btnReportes,
  btnHistorial,
  btnActividades
].forEach(btn => {

  if (!btn) return;

  btn.classList.remove(
      "text-cyan-400",
      "bg-slate-800",
      "border-l-4",
      "border-cyan-400",
      "pl-3",
      "rounded-lg"
    );

  });

  // dashboard
  if (seccionActiva === "dashboard") {

    if (dashboard) {
      dashboard.classList.remove("hidden");
    }

    titulo.innerText = "Dashboard";

    btnDashboard.classList.add(
      "text-cyan-400",
      "bg-slate-800",
      "border-l-4",
      "border-cyan-400",
      "pl-3",
      "rounded-lg"
    );
  }

  // registro
  if (seccionActiva === "registro") {

    if (registro) {
      registro.classList.remove("hidden");
    }

    titulo.innerText = "Registro";

    btnRegistro.classList.add(
      "text-cyan-400",
      "bg-slate-800",
      "border-l-4",
      "border-cyan-400",
      "pl-3",
      "rounded-lg"
    );
  }

  // gestion
  if (seccionActiva === "gestion") {

    if (gestion) {
      gestion.classList.remove("hidden");
    }

    titulo.innerText = "Gestión";

    btnGestion.classList.add(
      "text-cyan-400",
      "bg-slate-800",
      "border-l-4",
      "border-cyan-400",
      "pl-3",
      "rounded-lg"
    );
  }

  // reportes
if (seccionActiva === "reportes") {

if (reportes) {
  reportes.classList.remove("hidden");
}

  titulo.innerText = "Reportes";

  btnReportes.classList.add(
    "text-cyan-400",
    "bg-slate-800",
    "border-l-4",
    "border-cyan-400",
    "pl-3",
    "rounded-lg"
  );

  setTimeout(() => {
    render();
  }, 50);
}


// historial
if (seccionActiva === "historial") {

if (historial) {
  historial.classList.remove("hidden");
}

  titulo.innerText = "Historial";

  btnHistorial.classList.add(
    "text-cyan-400",
    "bg-slate-800",
    "border-l-4",
    "border-cyan-400",
    "pl-3",
    "rounded-lg"
  );

}


// actividades
if (seccionActiva === "actividades") {

  if (actividades) {
    actividades.classList.remove("hidden");
  }

  titulo.innerText = "Actividades";

  btnActividades.classList.add(
    "text-cyan-400",
    "bg-slate-800",
    "border-l-4",
    "border-cyan-400",
    "pl-3",
    "rounded-lg"
  );
}
}

// ===================== LOGIN =====================

window.iniciarSesion = () => {

  const usuario =
    document.getElementById("loginUsuario").value;

  const rol =
    document.getElementById("loginRol").value;

  const password =
    document.getElementById("loginPassword").value;

  const resultado = login(usuario, password, rol);

  const error =
    document.getElementById("loginError");

  if (!resultado.success) {

    error.classList.remove("hidden");

    return;
  }

  mostrarSistema();

  actualizarVista();

  render();
};

// ===================== MOSTRAR SISTEMA =====================

function mostrarSistema() {

  

  document
    .getElementById("loginScreen")
    .classList.add("hidden");

  document
    .getElementById("container")
    .classList.remove("hidden");

  const usuario = obtenerUsuario();

  document.getElementById("usuarioActivo").innerText =
  usuario.usuario;

  document.getElementById("rolActivo").innerText =
  usuario.rol.toUpperCase();
}

// ===================== VALIDAR SESIÓN =====================

if (haySesion()) {
  mostrarSistema();
}


// ===================== EVENTOS =====================
window.setFiltro = (valor) => {
  setFiltro(valor);
  render();
};

window.buscar = () => {
  const valor = document.getElementById("buscador").value;
  setBusqueda(valor);
  render();
};



// acciones
window.abrirModal = actions.abrirModal;
window.agregarObservacion = agregarObservacion;
window.abrirPerfil = abrirPerfil;
window.cerrarPerfil = cerrarPerfil;
window.registroAutomatico = registroAutomatico;
window.guardarEmpleado = actions.guardarEmpleado;
window.eliminarEmpleado = actions.eliminarEmpleado;
window.exportarCSV = actions.exportarCSV;
window.toggleDarkMode = actions.toggleDarkMode;
window.logout = logout;
window.eliminarArea = actions.eliminarArea;
window.guardarComentario = actions.guardarComentario;
window.limpiarHistorial = limpiarHistorial;
window.cambiarSeccion = cambiarSeccion;
window.abrirModalEliminar = actions.abrirModalEliminar;
window.cerrarModalEliminar = actions.cerrarModalEliminar;
window.abrirModalEliminarActividad = actions.abrirModalEliminarActividad;
window.cerrarModalEliminarActividad = actions.cerrarModalEliminarActividad;


// ===================== FECHA INGRESO =====================

const selectEtapa =
  document.getElementById("etapa");

const boxFechaIngreso =
  document.getElementById("boxFechaIngreso");

function validarFechaIngreso() {

  if (
    selectEtapa.value === "Contratado"
  ) {

    boxFechaIngreso.classList.remove("hidden");

  } else {

    boxFechaIngreso.classList.add("hidden");

  }

}

selectEtapa.addEventListener(
  "change",
  validarFechaIngreso
);

validarFechaIngreso();

// ===================== INIT =====================
if (localStorage.getItem("darkMode") === "activo") {
  window.toggleDarkMode();
}

  const input = document.getElementById("nueva-area");
if (input) {
  renderSugerencias(input.value);
}



render();
actualizarVista();




document
  .getElementById("btnConfirmarEliminar")
  .addEventListener("click", actions.eliminarEmpleado);
document
  .getElementById("btnConfirmarEliminarActividad")
  .addEventListener(
    "click",
    actions.eliminarActividad
  );