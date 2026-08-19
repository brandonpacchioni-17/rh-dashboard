// ===================== ACTIVIDADES =====================

export let actividades = [];


// ===================== CARGAR ACTIVIDADES =====================

export async function cargarActividades() {

  try {

    const respuesta =
      await fetch("http://localhost:3000/api/actividades");

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las actividades");
    }

    actividades =
      await respuesta.json();

    return actividades;

  } catch (error) {

    console.error(
      "Error al cargar actividades:",
      error
    );

    actividades = [];

    return [];

  }

}


// ===================== CREAR ACTIVIDAD =====================

export async function agregarActividad(datos) {

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

    await cargarActividades();

    return resultado;

  } catch (error) {

    console.error(
      "Error al crear actividad:",
      error
    );

    return null;

  }

}


// ===================== ACTUALIZAR ACTIVIDAD =====================

export async function actualizarActividad(index, valor) {

  const actividad = actividades[index];

  if (!actividad) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/actividades/${actividad.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          ...actividad,
          actividad: valor
        })
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.error ||
        "No se pudo actualizar la actividad"
      );
    }

    actividades[index].actividad = valor;

    console.log(
      "Actividad actualizada correctamente:",
      resultado
    );

  } catch (error) {

    console.error(
      "Error al actualizar actividad:",
      error
    );

  }

}


// ===================== ACTUALIZAR FECHA INICIO =====================

export async function actualizarFechaInicio(index, valor) {

  const actividad = actividades[index];

  if (!actividad) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/actividades/${actividad.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          ...actividad,
          fechaInicio: valor
        })
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.error ||
        "No se pudo actualizar la fecha de inicio"
      );
    }

    actividades[index].fechaInicio = valor;

    console.log(
      "Fecha de inicio actualizada:",
      resultado
    );

  } catch (error) {

    console.error(
      "Error al actualizar fecha de inicio:",
      error
    );

  }

}


// ===================== ACTUALIZAR FECHA FIN =====================

export async function actualizarFechaFin(index, valor) {

  const actividad = actividades[index];

  if (!actividad) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/actividades/${actividad.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          ...actividad,
          fechaFin: valor
        })
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.error ||
        "No se pudo actualizar la fecha de fin"
      );
    }

    actividades[index].fechaFin = valor;

    console.log(
      "Fecha de fin actualizada:",
      resultado
    );

  } catch (error) {

    console.error(
      "Error al actualizar fecha de fin:",
      error
    );

  }

}


// ===================== ACTUALIZAR ESTADO =====================

export async function actualizarEstado(index, valor) {

  const actividad = actividades[index];

  if (!actividad) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/actividades/${actividad.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          ...actividad,
          estado: valor
        })
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.error ||
        "No se pudo actualizar el estado"
      );
    }

    actividades[index].estado = valor;

    console.log(
      "Estado actualizado:",
      resultado
    );

  } catch (error) {

    console.error(
      "Error al actualizar estado:",
      error
    );

  }

}


// ===================== ACTUALIZAR ESTADO EMPLEADO =====================

export async function actualizarEstadoEmpleado(index, valor) {

  const actividad = actividades[index];

  if (!actividad) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/actividades/${actividad.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          ...actividad,
          estadoEmpleado: valor
        })
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.error ||
        "No se pudo actualizar el estado del empleado"
      );
    }

    actividades[index].estadoEmpleado = valor;

    console.log(
      "Estado del empleado actualizado:",
      resultado
    );

  } catch (error) {

    console.error(
      "Error al actualizar estado del empleado:",
      error
    );

  }

}

// ===================== ELIMINAR ACTIVIDAD =====================

export async function eliminarActividad(index) {

  const actividad = actividades[index];

  if (!actividad) return;

  try {

    const respuesta = await fetch(
      `http://localhost:3000/api/actividades/${actividad.id}`,
      {
        method: "DELETE"
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo eliminar la actividad"
      );

    }

    actividades.splice(index, 1);

    console.log(
      "Actividad eliminada correctamente:",
      resultado
    );

  } catch (error) {

    console.error(
      "Error al eliminar actividad:",
      error
    );

  }

}

// ===================== COMPATIBILIDAD =====================

export async function guardarActividades() {

  await cargarActividades();

}