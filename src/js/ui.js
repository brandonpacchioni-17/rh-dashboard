import { empleados } from "./data.js";
import { historial } from "./historial.js";
import { obtenerRol } from "./auth.js";
import { getFiltro, getBusqueda } from "./filters.js";
import { areas } from "./areas.js";
import { actividades } from "./actividades.js";

// ===================== ÁREAS =====================

export function cargarAreas() {

  const selectArea =
    document.getElementById("area");

  const selectRegistro =
    document.getElementById("registroArea");

  // LIMPIAR

  if (selectArea) {
    selectArea.innerHTML =
      `<option value="">-- Seleccionar área --</option>`;
  }

  if (selectRegistro) {
    selectRegistro.innerHTML =
      `<option value="">Seleccionar área</option>`;
  }

  // AGREGAR ÁREAS

  areas.forEach(area => {

    // MODAL
    if (selectArea) {

      selectArea.innerHTML += `
        <option value="${area}">
          ${area}
        </option>
      `;
    }

    // REGISTRO
    if (selectRegistro) {

      selectRegistro.innerHTML += `
        <option value="${area}">
          ${area}
        </option>
      `;
    }

  });
}
// ===================== DOM =====================
const tbody = document.getElementById("tabla-body");



// ===================== RENDER =====================

export function render() {

  const rol = obtenerRol();

  let data = empleados;

  const filtro = getFiltro();
  const textoBusqueda = getBusqueda();

  if (filtro !== "todos") {

    data = empleados.filter(e =>
      e.etapa === filtro
    );

  }

  if (textoBusqueda.trim() !== "") {

    const texto = textoBusqueda.toLowerCase();

      data = data.filter(e =>

      e.nombre.toLowerCase().includes(texto) ||
      e.actividad.toLowerCase().includes(texto) ||
      e.area.toLowerCase().includes(texto) ||
      e.etapa.toLowerCase().includes(texto)

    );
  }



// ===================== PERMISOS =====================

const btnAgregar =
  document.getElementById("btnAgregarEmpleado");

if (btnAgregar) {

  if (rol === "supervisor") {

    btnAgregar.classList.add("hidden");

  } else {

    btnAgregar.classList.remove("hidden");

  }
}


  // TABLA
  tbody.innerHTML = data.map((e, index) => {

  if (!e.observaciones) {
    e.observaciones = [];
  }


  

  return `
    <tr class="
      border-b transition-all duration-200

      ${
        e.etapa === "Postulante trunco"
          ? "bg-red-100 dark:bg-red-900/30"
          : ""
      }

      hover:bg-slate-100
      dark:hover:bg-slate-700
      dark:hover:text-white
    ">


        
      
        <td class="py-3">${e.nombre}</td>
        <td>${e.actividad}</td>
        <td>${e.area}</td>
        <td>
          ${e.fecha || "Sin registrar"}
        </td>

        <td>
          ${
            e.etapa === "Contratado"
              ? (e.fechaIngreso || "Pendiente")

              : e.etapa === "Postulante trunco"
              ? "No aplica"

              : e.etapa === "Seleccionado"
              ? "Pendiente"

              : e.etapa === "Entrevista virtual" ||
                e.etapa === "Entrevista presencial"
              ? "En proceso"

              : "—"
          }
        </td>

        <td>
          <span class="px-3 py-1 rounded-full text-sm font-semibold ${
            e.etapa === "Postulante"
              ? "bg-yellow-100 text-yellow-700"

              : e.etapa === "Postulante trunco"
              ? "bg-red-100 text-red-700"

              : e.etapa === "Entrevista virtual"
              ? "bg-blue-100 text-blue-700"

              : e.etapa === "Entrevista presencial"
              ? "bg-cyan-100 text-cyan-700"

              : e.etapa === "Seleccionado"
              ? "bg-green-100 text-green-700"

              : "bg-emerald-100 text-emerald-700"
          }">

            ${e.etapa}

          </span>
        </td>

          <td>

            
            

                <button
                  onclick="abrirPerfil(${index})"
                  class="
                    bg-slate-100 hover:bg-slate-200
                    dark:bg-slate-700 dark:hover:bg-slate-600
                    px-3 py-1 rounded-lg text-sm
                  "
                >
                  💬 Ver comentarios (${e.observaciones?.length || 0})
                </button>

            
            

            </td>
          

        <td class="flex gap-2 py-2">

          <button
          onclick="abrirPerfil(${index})"
          title="Ver perfil"
          class="bg-slate-700 hover:bg-slate-800 text-white px-3 py-1 rounded transition-all duration-200"
          >
            Perfil
          </button>

          ${
            rol !== "supervisor"
              ? `
                <button
                  onclick="abrirModal(${index})"
                  title="Editar empleado"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-all duration-200"
                >
                  Editar
                </button>
              `
              : ""
          }

          ${
            rol === "admin"
              ? `
                <button
                  onclick="abrirModalEliminar(${index})"
                  title="Eliminar empleado"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-200"
                >
                  Eliminar
                </button>
              `
              : ""
          }

        </td>
      </tr>
    `;
  }).join("");


  

  /*  ACTIVIDADES RECIENTES DESACTIVADO 
      porque la sección ya no existe en index.astro   */

  const pendientesBox = document.getElementById("lista-postulantes");
  const procesoBox = document.getElementById("lista-entrevistas");
  const completadasBox = document.getElementById("lista-contratados");

  if (pendientesBox && procesoBox && completadasBox) {

    pendientesBox.innerHTML = "";
    procesoBox.innerHTML = "";
    completadasBox.innerHTML = "";

    empleados.forEach(emp => {

      const body = document.getElementById("body");

const modoOscuro = body.classList.contains("dark");

const item = `
  <div class="
    border rounded-xl p-3 transition-all duration-300
    ${
      modoOscuro
        ? "bg-slate-700 text-white border-slate-600"
        : "bg-white text-slate-800 border-slate-200"
    }
  ">

    <p class="font-bold">
      ${emp.nombre}
    </p>

    <p class="
      text-sm
      ${
        modoOscuro
          ? "text-slate-300"
          : "text-slate-500"
      }
    ">
      ${emp.actividad}
    </p>

  </div>
`;

      if (emp.etapa === "Postulante"){
        pendientesBox.innerHTML += item;
      }

      if (
        emp.etapa === "Entrevista virtual" ||
        emp.etapa === "Entrevista presencial"
      ) {
        procesoBox.innerHTML += item;
      }

      if (
        emp.etapa === "Seleccionado" ||
        emp.etapa === "Contratado"
      ) {
        completadasBox.innerHTML += item;
      }

    });
  }
  // ===================== HISTORIAL =====================

const listaHistorial =
  document.getElementById("listaHistorial");

if (listaHistorial) {

  if (historial.length === 0) {

    listaHistorial.innerHTML = `
      <p class="text-slate-500">
        No hay movimientos registrados
      </p>
    `;

  } else {

    listaHistorial.innerHTML = historial.map(item => `

      <div class="border rounded-xl p-4">

        <p class="font-semibold">
          ${item.mensaje}
        </p>

        <p class="text-sm text-slate-500 mt-1">
          ${item.fecha}
        </p>

      </div>

    `).join("");

  }

}

// ===================== ÚLTIMA ACTIVIDAD =====================

const ultima = historial[0];

const ultimaActividad =
  document.getElementById("ultimaActividad");

if (ultimaActividad) {

  ultimaActividad.innerHTML = ultima
  ? `
    <div>
      <p>${ultima.mensaje}</p>

      <span class="text-sm text-slate-500">
        ${ultima.fecha}
      </span>
    </div>
  `
  : "Sin movimientos";

}


// ===================== TOTAL MOVIMIENTOS =====================

const totalMovimientos =
  document.getElementById("totalMovimientos");

if (totalMovimientos) {

  totalMovimientos.innerText =
    historial.length;

}

renderDashboard();
renderReportes();
renderActividades();

}


  


document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "btnExportCSV") {
    console.log("EXPORTANDO CSV");
    exportarCSV();
    
  }


});


function renderDashboard() {

  const totalEmpleados =
    empleados.length;

  const totalActividades =
    empleados.filter(e => e.actividad).length;

  const totalAreas =
    new Set(empleados.map(e => e.area)).size;

  const vencidas =
  empleados.filter(e =>
    e.etapa === "Postulante trunco"
  ).length;



  // PROGRESO

  const contratados =
    empleados.filter(e =>
      e.etapa === "Contratado"
    ).length;

  const progreso =
    totalEmpleados === 0
      ? 0
      : Math.round(
          (contratados / totalEmpleados) * 100
        );

  // INSERTAR EN HTML

  document.getElementById("total-empleados").innerText =
    totalEmpleados;

  document.getElementById("total-actividades").innerText =
    totalActividades;

  document.getElementById("total-pendientes").innerText =
    totalAreas;

  document.getElementById("total-vencidas").innerText =
    vencidas;

  document.getElementById("porcentaje-progreso").innerText =
    `${progreso}%`;

  document.getElementById("barra-progreso").style.width =
    `${progreso}%`;


    // ===================== GRÁFICO DASHBOARD =====================

const ctxDashboard =
  document.getElementById("graficoEstados");

if (ctxDashboard) {

  // destruir gráfico anterior
  if (
    window.graficoDashboard &&
    typeof window.graficoDashboard.destroy === "function"
  ) {
    window.graficoDashboard.destroy();
  }

  const postulantes =
    empleados.filter(e =>
      e.etapa === "Postulante"
    ).length;

  const entrevistas =
    empleados.filter(e =>

      e.etapa === "Entrevista virtual" ||
      e.etapa === "Entrevista presencial"

    ).length;

  const seleccionados =
    empleados.filter(e =>
      e.etapa === "Seleccionado"
    ).length;

  const contratados =
    empleados.filter(e =>
      e.etapa === "Contratado"
    ).length;

  window.graficoDashboard =
    new Chart(ctxDashboard, {

      type: "bar",

      data: {

        labels: [
          "Postulantes",
          "Entrevistas",
          "Seleccionados",
          "Contratados"
        ],

        datasets: [{

          label: "Cantidad",

          data: [
            postulantes,
            entrevistas,
            seleccionados,
            contratados
          ]

        }]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {

            labels: {

              color: document.body.classList.contains("dark")
                ? "#ffffff"
                : "#334155"

            }

          }

        },

        scales: {

          y: {

            ticks: {

              color: document.body.classList.contains("dark")
                ? "#ffffff"
                : "#334155"

            }

          },

          x: {

            ticks: {

              color: document.body.classList.contains("dark")
                ? "#ffffff"
                : "#334155"

            }

          }

        }

      }

    });

}

}

function renderReportes() {

  // TOTAL

  const total =
    empleados.length;

  // CONTRATADOS

  const contratados =
    empleados.filter(e =>
      e.etapa === "Contratado"
    ).length;

  // ENTREVISTAS

  const entrevistas =
    empleados.filter(e =>

      e.etapa === "Entrevista virtual" ||
      e.etapa === "Entrevista presencial"

    ).length;

  // VENCIDOS

  const vencidos =
  empleados.filter(e =>
    e.etapa === "Postulante trunco"
  ).length;

  // INSERTAR DATOS

  const reporteTotal =
    document.getElementById("reporteTotal");

  const reporteContratados =
    document.getElementById("reporteContratados");

  const reporteEntrevistas =
    document.getElementById("reporteEntrevistas");

  const reporteVencidos =
    document.getElementById("reporteVencidos");

  if (reporteTotal) {
    reporteTotal.innerText = total;
  }

  if (reporteContratados) {
    reporteContratados.innerText =
      contratados;
  }

  if (reporteEntrevistas) {
    reporteEntrevistas.innerText =
      entrevistas;
  }

  if (reporteVencidos) {
    reporteVencidos.innerText =
      vencidos;
  }
// ===================== TABLA REPORTES =====================

const tablaReportes =
  document.getElementById("tablaReportes");

if (tablaReportes) {

  tablaReportes.innerHTML = "";

  areas.forEach(area => {

    // TOTAL POR ÁREA

    const totalArea =
      empleados.filter(e =>
        e.area === area
      ).length;

    // CONTRATADOS

    const contratadosArea =
      empleados.filter(e =>

        e.area === area &&
        e.etapa === "Contratado"

      ).length;

    // PENDIENTES

    const pendientesArea =
      empleados.filter(e =>

        e.area === area &&
        e.etapa !== "Contratado"

      ).length;

      const porcentaje =
  totalArea === 0
    ? 0
    : Math.round(
        (contratadosArea / totalArea) * 100
      );

    tablaReportes.innerHTML += `

      <tr class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200">

        <td class="py-4 font-semibold text-slate-700 dark:text-white">
          ${area}
        </td>

        <td class="text-slate-600 dark:text-slate-300">
          ${totalArea}
        </td>

        <td class="text-emerald-500 font-bold">
          ${contratadosArea}
        </td>

        <td class="text-orange-500 font-bold">
          ${pendientesArea}
        </td>
        <td class="text-cyan-500 font-bold">
          ${porcentaje}%
        </td>

      </tr>

    `;

  });

}

// ===================== GRÁFICO ESTADOS =====================

const ctxReportes =
  document.getElementById("graficoReportes");

if (ctxReportes) {

  if (
  window.graficoEstados &&
  typeof window.graficoEstados.destroy === "function"
) {
  window.graficoEstados.destroy();
}

  const postulantes =
    empleados.filter(e =>
      e.etapa === "Postulante"
    ).length;

  const entrevistas =
    empleados.filter(e =>

      e.etapa === "Entrevista virtual" ||
      e.etapa === "Entrevista presencial"

    ).length;

  const seleccionados =
    empleados.filter(e =>
      e.etapa === "Seleccionado"
    ).length;

  const contratados =
    empleados.filter(e =>
      e.etapa === "Contratado"
    ).length;

  window.graficoEstados =
    new Chart(ctxReportes, {

      type: "bar",

      data: {

        labels: [
          "Postulantes",
          "Entrevistas",
          "Seleccionados",
          "Contratados"
        ],

        datasets: [{

          label: "Cantidad de candidatos",

          data: [
            postulantes,
            entrevistas,
            seleccionados,
            contratados
          ],

          backgroundColor: [
            "#facc15",
            "#38bdf8",
            "#4ade80",
            "#10b981"
          ],

          borderWidth: 1

        }]

      },

      options: {

        responsive: true,
        maintainAspectRatio: false,

        plugins: {

          legend: {

            labels: {
              color: "#94a3b8"
            }

          }

        }

      }

    });
    

}

}
export function renderActividades() {

  const tabla =
    document.getElementById(
      "tablaActividades"
    );

  if (!tabla) return;

  if (actividades.length === 0) {

    tabla.innerHTML = `

      <div class="text-center py-10">

        <p class="text-slate-500">
          No hay actividades registradas
        </p>

      </div>

    `;

    return;
  }

  tabla.innerHTML = `

    <table class="w-full">

      <thead>

          <tr class="border-b">

          <th class="text-left py-3">
            Empleado
          </th>

          <th class="text-left">
            Puesto
          </th>

          <th class="text-left">
            Área
          </th>

          <th class="text-left">
            Actividad
          </th>

          <th class="text-left">
            Fecha Inicio
          </th>

          <th class="text-left">
            Fecha Fin
          </th>

          <th class="text-left">
            Días
          </th>

          <th class="text-left">
            Estado
          </th>
          <th class="text-left">
            Estado Empleado
          </th>

          <th class="text-left">
            Acción
          </th>

      </thead>

      <tbody>

      ${actividades.map((a,i)=>`

        <tr class="
          border-b
          ${
            a.estadoEmpleado === "Inactivo"
              ? "opacity-50 bg-slate-100 dark:bg-slate-800"
              : ""
          }
        ">

            <td class="py-3">
              ${a.nombre}
            </td>

            <td>
              ${a.puesto}
            </td>

            <td>
              ${a.area}
            </td>

            <td>
              <input
                value="${a.actividad || ""}"
                onchange="actualizarActividad(${i}, this.value)"
                class="border rounded px-2 py-1 w-full"
              >
            </td>

            <td>
              <input
                type="date"
                value="${a.fechaInicio || ""}"
                onchange="actualizarFechaInicio(${i}, this.value)"
                class="border rounded px-2 py-1"
              >
            </td>

            <td>
              <input
                type="date"
                value="${a.fechaFin || ""}"
                onchange="actualizarFechaFin(${i}, this.value)"
                class="border rounded px-2 py-1"
              >
            </td>

            <td>
              ${
                a.fechaInicio && a.fechaFin
                  ? Math.ceil(
                      (
                        new Date(a.fechaFin) -
                        new Date(a.fechaInicio)
                      ) /
                      (1000 * 60 * 60 * 24)
                    )
                  : "-"
              }
            </td>

            <td>
              <select
                onchange="actualizarEstado(${i}, this.value)"
                class="border rounded px-2 py-1"
              >

                <option
                  ${a.estado === "Pendiente" ? "selected" : ""}
                >
                  Pendiente
                </option>

                <option
                  ${a.estado === "En proceso" ? "selected" : ""}
                >
                  En proceso
                </option>

                <option
                  ${a.estado === "Completado" ? "selected" : ""}
                >
                  Completado
                </option>

              </select>

            </td>
              
              <td>

              <select
                onchange="actualizarEstadoEmpleado(${i}, this.value)"
                class="border rounded px-2 py-1"
              >

                <option
                  ${a.estadoEmpleado === "Activo" ? "selected" : ""}
                >
                  Activo
                </option>

                <option
                  ${a.estadoEmpleado === "Inactivo" ? "selected" : ""}
                >
                  Inactivo
                </option>

              </select>

            </td>
              <td>
                <button
                  onclick="abrirModalEliminarActividad(${i})"
                  class="
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-3 py-1
                    rounded
                  "
                >
                  ✕
                </button>

              </td>
          </tr>

        `).join("")}

      </tbody>

    </table>

  `;
}