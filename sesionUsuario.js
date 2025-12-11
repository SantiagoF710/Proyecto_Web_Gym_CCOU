
let estaLogueado = false;

export class sesionUsuario {
  static guardarSesion() {
    estaLogueado = true;
  }

  static obtenerSesionActual() {
    return estaLogueado;
  }

  static finalizarSesionActual() {
    estaLogueado = false;
  }
}