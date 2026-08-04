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

    console.log(p);

    const modal =
    document.getElementById("modal-postulante");

    const contenido =
    document.getElementById("contenido-postulante");

    let colorEstado = "bg-yellow-500";

  if (p.estado === "Aceptado") {
      colorEstado = "bg-green-600";
  }

  if (p.estado === "Rechazado") {
      colorEstado = "bg-red-600";
  }

    contenido.innerHTML = `

    <div class="space-y-6">

      <div class="flex items-center justify-between mb-6">

      <div>

          <h2 class="modal-nombre text-2xl font-bold text-slate-800">
              ${p.nombres} ${p.apellidos}
          </h2>

          <p class="text-slate-500 dark:text-slate-400">
              ${p.puesto}
          </p>

      </div>

      <span class="${colorEstado} text-white px-4 py-2 rounded-full font-semibold">

          ${p.estado}

      </span>

  </div>

        <div class="modal-card bg-slate-50 rounded-xl p-5 transition-all">

            <h3 class="modal-title text-lg font-bold mb-4 text-slate-800">
                Datos personales
            </h3>

            <div class="grid md:grid-cols-2 gap-4">

                <p class="modal-text text-slate-700">
                    <strong>Nombres:</strong> ${p.nombres}
                </p>

                <p class="modal-text text-slate-700">
                    <strong>Apellidos:</strong> ${p.apellidos}
                </p>

                <p class="modal-text text-slate-700">
                    <strong>Correo:</strong> ${p.correo}
                </p>

                <p class="modal-text text-slate-700">
                    <strong>Celular:</strong> ${p.celular}
                </p>

                <p class="modal-text text-slate-700">
                    <strong>Fecha de postulación:</strong> ${p.fecha}
                </p>

            </div>

        </div>

        <div class="modal-card bg-slate-50 rounded-xl p-5 transition-all">

            <h3 class="modal-title text-lg font-bold mb-4 text-slate-800">
                Información laboral
            </h3>

            <div class="grid md:grid-cols-2 gap-4">

                <p class="modal-text text-slate-700">
                    <strong>Área:</strong> ${p.area}
                </p>

                <p class="modal-text text-slate-700">
                    <strong>Puesto:</strong> ${p.puesto}
                </p>

                <p class="modal-text text-slate-700">
                    <strong>Experiencia:</strong> ${p.experiencia} años
                </p>

                <p class="modal-text text-slate-700">
                    <strong>Disponibilidad:</strong> ${p.disponibilidad}
                </p>

            </div>

        </div>

        <div class="modal-card bg-slate-50 rounded-xl p-5 transition-all">

            <h3 class="modal-title text-lg font-bold mb-4 text-slate-800">
                Cuestionario
            </h3>

            <div class="space-y-4">

                <div>

                    <strong>¿Por qué deseas trabajar con nosotros?</strong>

                    <p class="mt-2 text-slate-600 dark:text-slate-300">
                        ${p.motivacion}
                    </p>

                </div>

                <div>

                    <strong>Habilidades</strong>

                    <p class="mt-2 text-slate-600 dark:text-slate-300">
                        ${p.habilidades}
                    </p>

                </div>

                <div>

                    <strong>Logro</strong>

                    <p class="mt-2 text-slate-600 dark:text-slate-300">
                        ${p.logro}
                    </p>

                </div>

            </div>

        </div>

        <div class="modal-card bg-slate-50 rounded-xl p-5 transition-all">

          <h3 class="modal-title text-lg font-bold mb-4 text-slate-800">
            Currículum
          </h3>

          <div class="flex items-center justify-between">

              <div>

                  <p class="modal-title font-semibold text-slate-800">
                      ${p.cv.nombre}
                  </p>

                  <p class="text-sm text-slate-500 dark:text-slate-400">
                      Archivo adjunto
                  </p>

              </div>

              <button
                  id="btn-ver-cv"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl">

                  Ver CV

              </button>

          </div>

      </div>

    </div>

    `;

    const body = document.getElementById("body");

    const modalNombre =
document.querySelector(".modal-nombre");


if(modalNombre){

    if(body.classList.contains("bg-slate-900")){

        modalNombre.classList.remove("text-slate-800");
        modalNombre.classList.add("text-white");

    }else{

        modalNombre.classList.remove("text-white");
        modalNombre.classList.add("text-slate-800");

    }

}

    const modalContainer =
document.querySelector(".modal-container");

const modalHeaderTitle =
document.querySelector(".modal-header-title");


if(body.classList.contains("bg-slate-900")){


    modalContainer.classList.remove("bg-white");
    modalContainer.classList.add("bg-slate-800");


    modalHeaderTitle.classList.remove("text-slate-800");
    modalHeaderTitle.classList.add("text-white");


}else{


    modalContainer.classList.remove("bg-slate-800");
    modalContainer.classList.add("bg-white");


    modalHeaderTitle.classList.remove("text-white");
    modalHeaderTitle.classList.add("text-slate-800");


}

    const modalCards = document.querySelectorAll(".modal-card");

modalCards.forEach(card => {

    if(body.classList.contains("bg-slate-900")){

        card.classList.remove("bg-slate-50");
        card.classList.add("bg-slate-700");

    }else{

        card.classList.remove("bg-slate-700");
        card.classList.add("bg-slate-50");

    }

});


    const modalTitles = document.querySelectorAll(".modal-title");

modalTitles.forEach(title => {

  if (body.classList.contains("bg-slate-900")) {

    title.classList.remove("text-slate-800");
    title.classList.add("text-white");

  } else {

    title.classList.remove("text-white");
    title.classList.add("text-slate-800");

  }

});

const modalTexts = document.querySelectorAll(".modal-text");

modalTexts.forEach(text => {

  if (body.classList.contains("bg-slate-900")) {

    text.classList.remove("text-slate-700");
    text.classList.add("text-slate-200");

  } else {

    text.classList.remove("text-slate-200");
    text.classList.add("text-slate-700");

  }

});

const modalSubtexts = document.querySelectorAll(".modal-subtext");

modalSubtexts.forEach(text => {

  if (body.classList.contains("bg-slate-900")) {

    text.classList.remove("text-slate-600");
    text.classList.add("text-slate-300");

  } else {

    text.classList.remove("text-slate-300");
    text.classList.add("text-slate-600");

  }

});
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    const btnVerCV =
    document.getElementById("btn-ver-cv");

    if(btnVerCV){

        btnVerCV.addEventListener("click",()=>{

            window.open(p.cv.archivo,"_blank");

        });

    }

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
