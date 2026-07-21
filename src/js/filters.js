// ===================== FILTROS =====================

let filtro = "todos";
let textoBusqueda = "";

export function setFiltro(valor) {
  filtro = valor;
}

export function getFiltro() {
  return filtro;
}

export function setBusqueda(valor) {
  textoBusqueda = valor;
}

export function getBusqueda() {
  return textoBusqueda;
}