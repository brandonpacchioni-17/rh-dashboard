// ===================== LOGIN =====================

export async function login(usuario, password, rol) {

  try {

    const respuesta = await fetch(
      "http://localhost:3000/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario,
          password,
          rol
        })
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {

      return {
        success: false,
        mensaje: resultado.error || "Credenciales incorrectas"
      };

    }

    localStorage.setItem(
      "sesion",
      JSON.stringify(resultado.usuario)
    );

    localStorage.setItem(
      "usuarioActivo",
      JSON.stringify(resultado.usuario)
    );

    return {
      success: true
    };

  } catch (error) {

    console.error("Error de conexión con el backend:", error);

    return {
      success: false,
      mensaje: "No se pudo conectar con el servidor"
    };

  }

}


// ===================== LOGOUT =====================

export function logout() {

  localStorage.removeItem("sesion");

  localStorage.removeItem("usuarioActivo");

  location.reload();

}


// ===================== VALIDAR SESIÓN =====================

export function haySesion() {

  return localStorage.getItem("sesion") !== null;

}


// ===================== OBTENER USUARIO =====================

export function obtenerUsuario() {

  return JSON.parse(
    localStorage.getItem("sesion")
  );

}


// ===================== OBTENER ROL =====================

export function obtenerRol() {

  const usuario =
    JSON.parse(localStorage.getItem("sesion"));

  return usuario?.rol || null;

}