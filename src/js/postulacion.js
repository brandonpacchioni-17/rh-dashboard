const paso1 = document.getElementById("paso-1");

// ===================== DATOS DE POSTULACIÓN =====================

const postulacion = {

    datosPersonales: {},

    laboral: {},

    cuestionario: {},

    final: {}

};

const paso2 = document.getElementById("paso-2");
const paso3 = document.getElementById("paso-3");
const paso4 = document.getElementById("paso-4");


const btnSiguiente1 = document.getElementById("btn-siguiente-1");
const btnAnterior2 = document.getElementById("btn-anterior-2");

const btnSiguiente2 = document.getElementById("btn-siguiente-2");
const btnAnterior3 = document.getElementById("btn-anterior-3");

const btnSiguiente3 = document.getElementById("btn-siguiente-3");
const btnAnterior4 = document.getElementById("btn-anterior-4");


// PASO 1 → PASO 2
if (btnSiguiente1) {

    btnSiguiente1.addEventListener("click", () => {


    postulacion.datosPersonales = {

        nombres:
        document.querySelectorAll("#paso-1 input")[0].value,

        apellidos:
        document.querySelectorAll("#paso-1 input")[1].value,

        dni:
        document.getElementById("dni").value,

        correo:
        document.querySelectorAll("#paso-1 input")[2].value,

        celular:
        document.querySelectorAll("#paso-1 input")[3].value,

        fechaNacimiento:
        document.getElementById("fechaNacimiento").value

    };


    paso1.classList.add("hidden");
    paso2.classList.remove("hidden");

});

}


// PASO 2 → PASO 1
if (btnAnterior2) {

    btnAnterior2.addEventListener("click", () => {

        paso2.classList.add("hidden");
        paso1.classList.remove("hidden");

    });

}


// PASO 2 → PASO 3
if (btnSiguiente2) {

    btnSiguiente2.addEventListener("click", () => {


    postulacion.laboral = {


        area:
        document.querySelectorAll("#paso-2 select")[0].value,


        puesto:
        document.querySelectorAll("#paso-2 input")[0].value,


        experiencia:
        document.querySelectorAll("#paso-2 input")[1].value,


        disponibilidad:
        document.querySelectorAll("#paso-2 input")[2].value


    };


    paso2.classList.add("hidden");
    paso3.classList.remove("hidden");

});

}


// PASO 3 → PASO 2
if (btnAnterior3) {

    btnAnterior3.addEventListener("click", () => {

        paso3.classList.add("hidden");
        paso2.classList.remove("hidden");

    });

}


// PASO 3 → PASO 4
if (btnSiguiente3) {

    btnSiguiente3.addEventListener("click", () => {


    postulacion.cuestionario = {


        motivacion:
        document.getElementById("motivacion").value,


        habilidades:
        document.getElementById("habilidades").value,


        logro:
        document.getElementById("logro").value


    };


    paso3.classList.add("hidden");
    paso4.classList.remove("hidden");

});

}


// PASO 4 → PASO 3
if (btnAnterior4) {

    btnAnterior4.addEventListener("click", () => {

        paso4.classList.add("hidden");
        paso3.classList.remove("hidden");

    });

}

// Terminos y Condiciones 

const modalLegal = document.getElementById("modal-legal");

const tituloLegal = document.getElementById("titulo-legal");
const contenidoLegal = document.getElementById("contenido-legal");

const abrirTerminos = document.getElementById("abrir-terminos");
const abrirPrivacidad = document.getElementById("abrir-privacidad");

const cerrarLegal = document.getElementById("cerrar-legal");

if (abrirTerminos) {

    abrirTerminos.addEventListener("click", () => {

        tituloLegal.textContent = "Términos y Condiciones";

        contenidoLegal.innerHTML = `
            <p>
                Al enviar esta postulación aceptas que la información proporcionada será utilizada exclusivamente para procesos de selección de personal de Mejicorp.
            </p>

            <br>

            <p>
                La empresa podrá conservar tu información y tu currículum para futuras oportunidades laborales relacionadas con tu perfil.
            </p>

            <br>

            <p>
                Toda la información será tratada de manera confidencial y únicamente por el área de Recursos Humanos.
            </p>
        `;

        modalLegal.classList.remove("hidden");
        modalLegal.classList.add("flex");

    });

}

// Politica de privacidad

if (abrirPrivacidad) {

    abrirPrivacidad.addEventListener("click", () => {

        tituloLegal.textContent = "Política de Privacidad";

        contenidoLegal.innerHTML = `
            <p>
                Mejicorp protege la información personal de todos los postulantes.
            </p>

            <br>

            <p>
                Tus datos no serán compartidos con terceros y serán utilizados únicamente para fines de reclutamiento y selección.
            </p>

            <br>

            <p>
                Puedes solicitar la actualización o eliminación de tu información comunicándote con el área de Recursos Humanos.
            </p>
        `;

        modalLegal.classList.remove("hidden");
        modalLegal.classList.add("flex");

    });

}

if (cerrarLegal) {

    cerrarLegal.addEventListener("click", () => {

        modalLegal.classList.remove("flex");
        modalLegal.classList.add("hidden");

    });

}

// ===================== CV =====================

const inputCV = document.getElementById("cv");
const nombreCV = document.getElementById("nombre-cv");


let archivoCV = null;
let archivoCVBase64 = "";
let archivoBase64 = "";


if (inputCV) {

    inputCV.addEventListener("change", () => {

        archivoCV = inputCV.files[0];

        if (!archivoCV) return;

        nombreCV.textContent =
            `CV seleccionado: ${archivoCV.name}`;

        nombreCV.classList.remove("hidden");


        const lector = new FileReader();

        lector.onload = function(e){

            archivoBase64 = e.target.result;

        };

        lector.readAsDataURL(archivoCV);

    });

}


// ===================== DATOS FINALES =====================

const btnEnviar =
    document.getElementById("btn-enviar");


if (btnEnviar) {


btnEnviar.addEventListener("click", async () => {


    const terminos =
        document.getElementById("terminos");


    if (!terminos.checked) {

        alert(
          "Debes aceptar los términos y condiciones"
        );

        return;

    }


    if (!archivoCV) {

        alert(
          "Debes adjuntar tu CV"
        );

        return;

    }



    postulacion.final = {

        linkedin:
        document.getElementById("linkedin").value,

        github:
        document.getElementById("github").value,

        cv: {

            nombre: archivoCV.name,

            archivo: archivoBase64

        }

    };

const nuevoPostulante = {


    id: Date.now(),


    ...postulacion.datosPersonales,


    ...postulacion.laboral,


    ...postulacion.cuestionario,


    ...postulacion.final,


    estado:"En evaluación",


    fecha:
    new Date().toISOString().split("T")[0]


};

try {

    const respuesta = await fetch(
        "http://localhost:3000/api/postulantes",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                ...nuevoPostulante,

                cvNombre:
                    nuevoPostulante.cv?.nombre || "",

                cvArchivo:
                    nuevoPostulante.cv?.archivo || ""

            })
        }
    );


    if (!respuesta.ok) {

        throw new Error(
            "No se pudo registrar la postulación"
        );

    }


    const resultado =
        await respuesta.json();


    console.log(
        "Postulación registrada:",
        resultado
    );


    mostrarNotificacionPostulacion();


    setTimeout(() => {

        window.location.href = "empleos";

    }, 4000);


} catch (error) {

    console.error(
        "Error al enviar postulación:",
        error
    );


    alert(
        "No se pudo enviar la postulación. Verifica la conexión con el servidor."
    );

}



});


}



function mostrarNotificacionPostulacion() {


    const alerta = document.createElement("div");


    alerta.innerHTML = `

        <div class="flex items-center gap-4">

            <div class="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl">
                ✓
            </div>

            <div>

                <h3 class="font-bold text-slate-800">
                    ¡Postulación enviada correctamente!
                </h3>

                <p class="text-sm text-slate-500">
                    Recursos Humanos revisará tu información.
                </p>

            </div>

        </div>

    `;


    alerta.className = `

        fixed
        top-6
        right-6
        bg-white
        shadow-2xl
        rounded-2xl
        p-5
        border
        border-green-200
        z-50
        animate-bounce

    `;


    document.body.appendChild(alerta);



    setTimeout(() => {

        alerta.remove();

    },4000);


}


// ===================== DEBUG =====================

window.postulacion = postulacion;