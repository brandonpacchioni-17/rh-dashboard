import { empleados } from "./data.js";
import { agregarHistorial } from "./historial.js";
import { notificar } from "./actions.js";
import { renderActividades } from "./ui.js";



export async function abrirPerfil(index) {

  const emp = empleados[index];

  if (!emp) return;

  try {

    // ===================== CARGAR OBSERVACIONES =====================

    const respuestaObservaciones = await fetch(
      `http://localhost:3000/api/empleados/${emp.id}/observaciones`
    );

    if (!respuestaObservaciones.ok) {
      throw new Error("No se pudieron cargar las observaciones");
    }

    const observaciones =
      await respuestaObservaciones.json();


    // ===================== CARGAR HISTORIAL =====================

    const respuestaHistorial = await fetch(
      `http://localhost:3000/api/empleados/${emp.id}/historial`
    );

    if (!respuestaHistorial.ok) {
      throw new Error("No se pudo cargar el historial");
    }

    const historialEtapas =
      await respuestaHistorial.json();


    // ===================== PROGRESO =====================

    const progresoEtapas = {

      "Postulante trunco": 0,

      "Postulante": 25,

      "Entrevista virtual": 50,

      "Entrevista presencial": 75,

      "Seleccionado": 100,

      "Contratado": 100

    };

    const progreso =
      progresoEtapas[emp.etapa] || 0;


    // ===================== MODAL =====================

    const modal =
      document.getElementById("modalPerfil");

    const body =
      document.getElementById("perfilBody");

    if (!modal || !body) return;


    // ===================== OBSERVACIONES =====================

    const observacionesHTML =
      observaciones.length === 0

      ? `
        <p class="text-slate-500">
          Sin observaciones
        </p>
      `

      : observaciones.map(obs => `

        <div class="
          bg-slate-100 dark:bg-slate-700
          p-3 rounded-xl
          dark:text-white
          flex justify-between items-start
          gap-3
          overflow-hidden
        ">

          <div class="
            flex-1
            min-w-0
            overflow-hidden
          ">

            <p class="
              whitespace-pre-wrap
              break-words
              w-full
            ">
              ${obs.texto}
            </p>

            <p class="
              text-xs
              text-slate-500
              mt-1
            ">
              ${obs.fecha || ""}
            </p>

          </div>

          <button
            onclick="eliminarObservacion(
              ${index},
              ${obs.id}
            )"
            class="
              flex-shrink-0
              bg-red-500
              hover:bg-red-600
              text-white
              px-2
              py-1
              rounded-lg
              text-sm
            "
          >
            ✕
          </button>

        </div>

      `).join("");


    // ===================== HISTORIAL =====================

    const historialHTML =
      historialEtapas.length === 0

      ? `
        <p class="text-slate-500">
          Sin historial registrado
        </p>
      `

      : historialEtapas.map(item => `

        <div class="
          border
          rounded-xl
          p-3
          dark:border-slate-700
          flex
          justify-between
          items-start
          gap-3
        ">

          <div>

            <p class="
              font-semibold
              dark:text-white
            ">
              ${item.etapa}
            </p>

            <p class="
              text-sm
              text-slate-500
            ">
              ${item.fechaCambio || ""}
            </p>

          </div>

          <button
            onclick="eliminarHistorialEtapa(
              ${index},
              ${item.id}
            )"
            class="
              bg-red-500
              hover:bg-red-600
              text-white
              px-2
              py-1
              rounded-lg
              text-sm
            "
          >
            ✕
          </button>

        </div>

      `).join("");


    // ===================== CONTENIDO DEL PERFIL =====================

    body.innerHTML = `

      <div class="space-y-6">

        <!-- CABECERA -->

        <div class="flex items-center gap-4">

          <div class="
            w-20
            h-20
            rounded-full
            bg-slate-700
            text-white
            flex
            items-center
            justify-center
            text-3xl
            font-bold
            flex-shrink-0
          ">
            ${emp.nombre?.charAt(0) || "?"}
          </div>

          <div>

            <h2 class="
              text-2xl
              font-bold
              dark:text-white
            ">
              ${emp.nombre}
            </h2>

            <p class="text-slate-500">
              ${emp.actividad || "Sin puesto"}
            </p>

            <p class="
              text-sm
              text-slate-400
            ">
              Área: ${emp.area || "Sin registrar"}
            </p>

          </div>

        </div>


        <!-- PROGRESO -->

        <div>

          <p class="
            font-semibold
            dark:text-white
          ">
            Progreso del proceso
          </p>

          <p class="
            text-sm
            text-slate-500
            mb-2
          ">
            ${progreso}%
          </p>

          <div class="
            w-full
            bg-slate-200
            rounded-full
            h-2
          ">

            <div
              class="
                bg-green-500
                h-2
                rounded-full
                transition-all
                duration-500
              "
              style="width:${progreso}%"
            ></div>

          </div>

        </div>


        <!-- COMENTARIOS -->

        <div>

          <h3 class="
            text-lg
            font-bold
            mb-3
            dark:text-white
          ">
            Comentarios de entrevista
          </h3>

          <div class="
            space-y-2
            mb-4
            max-h-52
            overflow-y-auto
            pr-2
          ">

            ${observacionesHTML}

          </div>


          <textarea
            id="nuevaObservacion"
            rows="2"
            placeholder="Agregar Comentarios y observaciones..."
            class="
              w-full
              border
              rounded-xl
              p-3
              dark:bg-slate-800
              dark:text-white
              dark:border-slate-700
            "
          ></textarea>


          <div class="flex gap-2 mt-3">

            <button
              onclick="agregarObservacion(${index})"
              class="
                bg-slate-900
                hover:bg-slate-800
                text-white
                px-4
                py-2
                rounded-xl
              "
            >
              Guardar comentario
            </button>

          </div>

        </div>


        <!-- INFORMACIÓN -->

        <div>

          <h3 class="
            text-lg
            font-bold
            mb-3
            dark:text-white
          ">
            Información
          </h3>


          <div class="
            grid
            grid-cols-2
            gap-4
          ">

            <div class="border rounded-xl p-4">

              <p class="text-sm text-slate-500">
                Área
              </p>

              <p class="font-semibold dark:text-white">
                ${emp.area || "Sin registrar"}
              </p>

            </div>


            <div class="border rounded-xl p-4">

              <p class="text-sm text-slate-500">
                DNI
              </p>

              <p class="font-semibold dark:text-white">
                ${emp.dni || "Sin registrar"}
              </p>

            </div>


            <div class="border rounded-xl p-4">

              <p class="text-sm text-slate-500">
                Correo
              </p>

              <p class="font-semibold dark:text-white">
                ${emp.correo || "Sin registrar"}
              </p>

            </div>


            <div class="border rounded-xl p-4">

              <p class="text-sm text-slate-500">
                Celular
              </p>

              <p class="font-semibold dark:text-white">
                ${emp.celular || "Sin registrar"}
              </p>

            </div>


            <div class="border rounded-xl p-4">

              <p class="text-sm text-slate-500">
                Fecha de nacimiento
              </p>

              <p class="font-semibold dark:text-white">
                ${emp.fechaNacimiento || "Sin registrar"}
              </p>

            </div>


            <div class="border rounded-xl p-4">

              <p class="text-sm text-slate-500">
                Etapa
              </p>

              <span class="
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold

                ${
                  emp.etapa === "Postulante"
                    ? "bg-yellow-100 text-yellow-700"

                    : emp.etapa === "Entrevista virtual"
                    ? "bg-blue-100 text-blue-700"

                    : emp.etapa === "Entrevista presencial"
                    ? "bg-cyan-100 text-cyan-700"

                    : emp.etapa === "Seleccionado"
                    ? "bg-green-100 text-green-700"

                    : emp.etapa === "Postulante trunco"
                    ? "bg-red-100 text-red-700"

                    : "bg-emerald-100 text-emerald-700"
                }
              ">
                ${emp.etapa}
              </span>

            </div>


            <div class="border rounded-xl p-4">

              <p class="text-sm text-slate-500">
                Fecha de ingreso
              </p>

              <p class="font-semibold dark:text-white">
                ${emp.fechaIngreso || "Sin fecha"}
              </p>

            </div>

          </div>

        </div>


        <!-- INFORMACIÓN DE REGISTRO -->

        <div>

          <h3 class="
            text-lg
            font-bold
            mb-3
            dark:text-white
          ">
            Información de registro
          </h3>


          <div class="border rounded-xl p-4">

            <p class="text-sm text-slate-500">
              Origen
            </p>

            <p class="font-semibold dark:text-white">
              ${emp.origen || "Registro manual"}
            </p>

          </div>


          <div class="
            border
            rounded-xl
            p-4
            mt-3
          ">

            <p class="text-sm text-slate-500">
              Fecha de postulación
            </p>

            <p class="font-semibold dark:text-white">
              ${emp.fecha || "Sin registrar"}
            </p>

          </div>

        </div>


        <!-- HISTORIAL -->

        <div>

          <h3 class="
            text-lg
            font-bold
            mb-3
            dark:text-white
          ">
            Historial de etapas
          </h3>

          <div class="
            space-y-2
            mb-4
            max-h-52
            overflow-y-auto
            pr-2
          ">

            ${historialHTML}

          </div>

        </div>

      </div>

    `;


    // ===================== MOSTRAR MODAL =====================

    const contenido =
      document.getElementById(
        "perfilContenido"
      );

    modal.classList.remove("hidden");
    modal.classList.add("flex");


    setTimeout(() => {

      contenido.classList.remove(
        "scale-95",
        "opacity-0"
      );

      contenido.classList.add(
        "scale-100",
        "opacity-100"
      );

    }, 10);


  } catch (error) {

    console.error(
      "Error al cargar perfil:",
      error
    );

    notificar(
      "No se pudo cargar el perfil",
      "error"
    );

  }

}

export function cerrarPerfil() {

  const modal =
    document.getElementById("modalPerfil");

  const contenido =
    document.getElementById("perfilContenido");

  contenido.classList.remove("scale-100");
  contenido.classList.remove("opacity-100");

  contenido.classList.add("scale-95");
  contenido.classList.add("opacity-0");

  setTimeout(() => {

    modal.classList.add("hidden");
    modal.classList.remove("flex");

  }, 200);

}

const modal =
    document.getElementById("modalPerfil");

if (modal) {

  modal.classList.add("hidden");
  modal.classList.remove("flex");

}

  // ===================== OBSERVACIONES =====================

export async function agregarObservacion(index) {

  const empleado = empleados[index];

  if (!empleado) return;

  const textarea =
    document.getElementById("nuevaObservacion");

  if (!textarea) return;

  const texto =
    textarea.value.trim();

  if (!texto) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/empleados/${empleado.id}/observaciones`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          texto
        })
      }
    );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo guardar el comentario"
      );

    }

    textarea.value = "";

    notificar(
      "Comentario agregado",
      "success"
    );

    abrirPerfil(index);

  } catch (error) {

    console.error(
      "Error al guardar comentario:",
      error
    );

    notificar(
      "No se pudo guardar el comentario",
      "error"
    );

  }

}


export async function eliminarObservacion(
  indexEmpleado,
  indexObs
) {

  const empleado =
    empleados[indexEmpleado];

  if (!empleado) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/empleados/${empleado.id}/observaciones/${indexObs}`,
      {
        method: "DELETE"
      }
    );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo eliminar el comentario"
      );

    }

    notificar(
      "Comentario eliminado",
      "error"
    );

    abrirPerfil(indexEmpleado);

  } catch (error) {

    console.error(
      "Error al eliminar comentario:",
      error
    );

    notificar(
      "No se pudo eliminar el comentario",
      "error"
    );

  }

}
export async function eliminarHistorialEtapa(
  indexEmpleado,
  indexHistorial
) {

  const empleado =
    empleados[indexEmpleado];

  if (!empleado) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/empleados/${empleado.id}/historial/${indexHistorial}`,
      {
        method: "DELETE"
      }
    );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo eliminar el historial"
      );

    }

    notificar(
      "Registro eliminado",
      "error"
    );

    abrirPerfil(indexEmpleado);

  } catch (error) {

    console.error(
      "Error al eliminar historial:",
      error
    );

    notificar(
      "No se pudo eliminar el registro",
      "error"
    );

  }

}
window.agregarObservacion = agregarObservacion;
window.eliminarObservacion = eliminarObservacion;
window.eliminarHistorialEtapa = eliminarHistorialEtapa;


export function limpiarObservacion() {

  const textarea =
    document.getElementById("nuevaObservacion");

  if (textarea) {
    textarea.value = "";
  }

}

window.limpiarObservacion =
  limpiarObservacion;



window.abrirPerfil = abrirPerfil;
window.cerrarPerfil = cerrarPerfil;

window.agregarObservacion = agregarObservacion;
window.eliminarObservacion = eliminarObservacion;
window.eliminarHistorialEtapa = eliminarHistorialEtapa;
window.limpiarObservacion = limpiarObservacion;