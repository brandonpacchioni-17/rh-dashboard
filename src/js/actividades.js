export let actividades =
  JSON.parse(
    localStorage.getItem("actividades")
  ) || [];

export function guardarActividades() {

  localStorage.setItem(
    "actividades",
    JSON.stringify(actividades)
  );

}

