// ===================== USUARIOS =====================

const usuarios = [

  {
    usuario: "admin",
    password: "Mej&corp%111$2026",
    rol: "admin"
  },

  {
    usuario: "rrhh",
    password: "Mej&corp%111$2026",
    rol: "rrhh"
  },

  {
    usuario: "supervisor",
    password: "Mej&corp%111$2026",
    rol: "supervisor"
  }

];

// ===================== LOGIN =====================

export function login(usuario, password, rol) {

  const encontrado = usuarios.find(
  u =>
    u.usuario === usuario &&
    u.password === password &&
    u.rol === rol
);

  if (!encontrado) {
    return {
      success: false,
      mensaje: "Credenciales incorrectas"
    };
  }

  
    localStorage.setItem(
    "sesion",
    JSON.stringify(encontrado)
);

  localStorage.setItem(
    "usuarioActivo",
    JSON.stringify(encontrado)
  );

  return {
    success: true
  };
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