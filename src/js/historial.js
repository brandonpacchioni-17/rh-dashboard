export let historial = [];

const API = "http://localhost:3000/api/historial";


// ===================== CARGAR HISTORIAL =====================

export async function cargarHistorial() {

  try {

    const respuesta = await fetch(API);

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el historial");
    }

    const datos = await respuesta.json();

    historial.length = 0;

    historial.push(...datos);

    window.dispatchEvent(
      new CustomEvent("historial-actualizado")
    );

  } catch (error) {

    console.error(
      "Error al cargar historial:",
      error
    );

  }

}


// ===================== AGREGAR HISTORIAL =====================

export async function agregarHistorial(mensaje) {

  if (!mensaje || !mensaje.trim()) {
    return;
  }

  const fecha =
    new Date().toLocaleString();


  historial.unshift({
    mensaje,
    fecha
  });

  if (historial.length > 20) {
    historial.pop();
  }

  window.dispatchEvent(
    new CustomEvent("historial-actualizado")
  );


  try {

    const respuesta = await fetch(API, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        mensaje
      })

    });

    if (!respuesta.ok) {
      throw new Error(
        "No se pudo guardar el historial"
      );
    }

  } catch (error) {

    console.error(
      "Error al guardar historial:",
      error
    );

  }

}


// ===================== LIMPIAR HISTORIAL =====================

export async function limpiarHistorial() {

  try {

    const respuesta = await fetch(API, {
      method: "DELETE"
    });

    if (!respuesta.ok) {
      throw new Error(
        "No se pudo eliminar el historial"
      );
    }

    historial.length = 0;

    window.dispatchEvent(
      new CustomEvent("historial-actualizado")
    );

  } catch (error) {

    console.error(
      "Error al limpiar historial:",
      error
    );

  }

}