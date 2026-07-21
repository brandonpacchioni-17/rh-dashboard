export let areas = JSON.parse(localStorage.getItem("areas")) || [
  "Marketing",
  "Recursos Humanos",
  "Finanzas"
];

export function guardarAreas() {
  localStorage.setItem("areas", JSON.stringify(areas));
}