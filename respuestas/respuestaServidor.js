
export class respuestaServidor {
  mensaje = '';
  error = false;
  datos;

  constructor(mensaje, error = false, datos = null) {
    this.mensaje = mensaje;
    this.error = error;
    this.datos = datos;
  }
}