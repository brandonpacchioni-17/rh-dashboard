// ===================== DATA =====================

export let empleados = JSON.parse(localStorage.getItem("empleados")) || [
  
 {
  nombre: "Carlos Ramos",
  actividad: "Capacitación",
  area: "Marketing",
  etapa: "Postulante",
  fecha: "2026-05-28",
  fechaIngreso: "",
  historialEtapas: [],
   // MÓDULO 2
  actividadNombre: "",
  fechaInicioActividad: "",
  fechaFinActividad: ""
},

  {
  nombre: "Ana Torres",
  actividad: "Evaluación",
  area: "Recursos Humanos",
  etapa: "Contratado",
  fecha: "2026-05-20",
  fechaIngreso: "2026-06-01",
  historialEtapas: [],
   // MÓDULO 2
  actividadNombre: "",
  fechaInicioActividad: "",
  fechaFinActividad: ""
},

  {
  nombre: "Luis Medina",
  actividad: "Entrevista",
  area: "Finanzas",
  etapa: "Entrevista presencial",
  fecha: "2026-05-20",
  fechaIngreso: "2026-06-01",
  historialEtapas: [],
   // MÓDULO 2
  actividadNombre: "",
  fechaInicioActividad: "",
  fechaFinActividad: ""
},
];

export function guardar() {
  localStorage.setItem(
    "empleados",
    JSON.stringify(empleados)
  );
}

export function cargarEmpleados(){

  empleados.splice(
    0,
    empleados.length,
    ...(
      JSON.parse(
        localStorage.getItem("empleados")
      ) || []
    )
  );

}
