const paso1 = document.getElementById("paso-1");
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