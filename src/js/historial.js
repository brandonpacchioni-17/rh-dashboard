export let historial = JSON.parse(localStorage.getItem("historial")) || [];

export function agregarHistorial(mensaje) {
  historial.unshift({
    mensaje,
    fecha: new Date().toLocaleString()
  });

  if (historial.length > 20) historial.pop();

  localStorage.setItem("historial", JSON.stringify(historial));
}

import { render } from "./ui.js";

export function limpiarHistorial() {

  historial.length = 0;

  localStorage.removeItem("historial");

  render();
}