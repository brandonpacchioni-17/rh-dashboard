// ===================== POSTULANTES =====================

export let postulantes =
  JSON.parse(
    localStorage.getItem("postulantes")
  ) || [];


// ===================== GUARDAR =====================

export function guardarPostulantes(){

  localStorage.setItem(
    "postulantes",
    JSON.stringify(postulantes)
  );

}


export function agregarPostulante(datos){

  postulantes.push(datos);

  guardarPostulantes();

}


export function renderPostulantes(){

  const tabla =
    document.getElementById("tabla-postulantes");


  if(!tabla) return;


  if(postulantes.length === 0){

    tabla.innerHTML = `

      <tr>

        <td 
        colspan="6"
        class="text-center p-10 text-slate-400">

          No hay postulaciones registradas.

        </td>

      </tr>

    `;

    return;

  }


  tabla.innerHTML = postulantes.map((p,index)=>`

    <tr class="border-b">

      <td class="p-4">
        ${p.nombres} ${p.apellidos}
      </td>


      <td class="p-4">
        ${p.area}
      </td>


      <td class="p-4">
        ${p.puesto}
      </td>


      <td class="p-4">
        ${p.fecha}
      </td>


      <td class="p-4">
        ${p.estado}
      </td>


      <td class="p-4 text-center space-x-2">

        <button
            class="btn-ver bg-blue-600 text-white px-3 py-1 rounded-lg"
            data-index="${index}">
            Ver
        </button>

        <button
            class="btn-aceptar bg-green-600 text-white px-3 py-1 rounded-lg"
            data-index="${index}">
            Aceptar
        </button>

        <button
            class="btn-rechazar bg-red-500 text-white px-3 py-1 rounded-lg"
            data-index="${index}">
            Rechazar
        </button>

        </td>

    </tr>


  `).join("");

  const botonesAceptar =
document.querySelectorAll(".btn-aceptar");

const botonesRechazar =
document.querySelectorAll(".btn-rechazar");

const botonesVer =
document.querySelectorAll(".btn-ver");


botonesVer.forEach(btn => {

    btn.addEventListener("click", () => {

        const index = btn.dataset.index;

        mostrarPostulante(index);

    });

});

botonesAceptar.forEach(btn => {

  btn.addEventListener("click", () => {

    const index = btn.dataset.index;

    postulantes[index].estado = "Aceptado";

    guardarPostulantes();

    renderPostulantes();

  });

});

botonesRechazar.forEach(btn => {

  btn.addEventListener("click", () => {

    const index = btn.dataset.index;

    postulantes[index].estado = "Rechazado";

    guardarPostulantes();

    renderPostulantes();

  });

});


}

function mostrarPostulante(index){

    const p = postulantes[index];

    const modal =
    document.getElementById("modal-postulante");

    const contenido =
    document.getElementById("contenido-postulante");

    contenido.innerHTML = `

    <div class="space-y-6">

        <div class="bg-slate-50 rounded-xl p-5">

            <h3 class="text-lg font-bold mb-4">
                👤 Datos personales
            </h3>

            <div class="grid md:grid-cols-2 gap-4">

                <p><strong>Nombres:</strong> ${p.nombres}</p>

                <p><strong>Apellidos:</strong> ${p.apellidos}</p>

                <p><strong>Correo:</strong> ${p.correo}</p>

                <p><strong>Celular:</strong> ${p.celular}</p>

            </div>

        </div>

        <div class="bg-slate-50 rounded-xl p-5">

            <h3 class="text-lg font-bold mb-4">
                💼 Información laboral
            </h3>

            <div class="grid md:grid-cols-2 gap-4">

                <p><strong>Área:</strong> ${p.area}</p>

                <p><strong>Puesto:</strong> ${p.puesto}</p>

                <p><strong>Experiencia:</strong> ${p.experiencia} años</p>

                <p><strong>Disponibilidad:</strong> ${p.disponibilidad}</p>

            </div>

        </div>

        <div class="bg-slate-50 rounded-xl p-5">

            <h3 class="text-lg font-bold mb-4">
                📝 Cuestionario
            </h3>

            <div class="space-y-4">

                <div>

                    <strong>¿Por qué deseas trabajar con nosotros?</strong>

                    <p class="mt-2 text-slate-600">
                        ${p.motivacion}
                    </p>

                </div>

                <div>

                    <strong>Habilidades</strong>

                    <p class="mt-2 text-slate-600">
                        ${p.habilidades}
                    </p>

                </div>

                <div>

                    <strong>Logro</strong>

                    <p class="mt-2 text-slate-600">
                        ${p.logro}
                    </p>

                </div>

            </div>

        </div>

    </div>

    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

}

const cerrar =
document.getElementById("cerrar-modal-postulante");

if(cerrar){

    cerrar.addEventListener("click",()=>{

        document
        .getElementById("modal-postulante")
        .classList.add("hidden");

        document
        .getElementById("modal-postulante")
        .classList.remove("flex");

    });

}
