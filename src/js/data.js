// ===================== DATA =====================

export let empleados = [];

const API_URL = "http://localhost:3000/api/empleados";


// ===================== CARGAR EMPLEADOS =====================

export async function cargarEmpleados() {

  try {

    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error(
        `No se pudo obtener los empleados. HTTP ${respuesta.status}`
      );
    }

    const datos = await respuesta.json();

    empleados.splice(
      0,
      empleados.length,
      ...datos
    );

    console.log(
      "Empleados cargados desde SQLite:",
      empleados
    );

    return empleados;

  } catch (error) {

    console.error(
      "Error al conectar con el backend:",
      error
    );

    empleados.splice(
      0,
      empleados.length
    );

    return [];

  }

}


// ===================== CREAR EMPLEADO =====================

export async function guardarEmpleadoBackend(empleado) {

  try {

    const respuesta = await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(empleado)
      }
    );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo guardar el empleado"
      );

    }

    console.log(
      "Empleado guardado en SQLite:",
      resultado
    );

    return resultado;

  } catch (error) {

    console.error(
      "Error al guardar empleado:",
      error
    );

    return null;

  }

}


// ===================== ACTUALIZAR EMPLEADO =====================

export async function actualizarEmpleadoBackend(
  id,
  empleado
) {

  try {

    const respuesta = await fetch(
      `${API_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(empleado)
      }
    );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo actualizar el empleado"
      );

    }

    console.log(
      "Empleado actualizado en SQLite:",
      resultado
    );

    return resultado;

  } catch (error) {

    console.error(
      "Error al actualizar empleado:",
      error
    );

    return null;

  }

}


// ===================== ELIMINAR EMPLEADO =====================

export async function eliminarEmpleadoBackend(id) {

  try {

    const respuesta = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo eliminar el empleado"
      );

    }

    console.log(
      "Empleado eliminado de SQLite:",
      resultado
    );

    return resultado;

  } catch (error) {

    console.error(
      "Error al eliminar empleado:",
      error
    );

    return null;

  }

}


// ===================== COMPATIBILIDAD =====================


export function guardarLocal() {
  return true;
}

export function guardar() {
  return true;
}