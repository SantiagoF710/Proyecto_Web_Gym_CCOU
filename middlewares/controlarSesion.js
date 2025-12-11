
import { respuestaServidor } from '../respuestas/respuestaServidor.js';
import { sesionUsuario } from '../sesionUsuario.js';

export const controlarSesion = (req, res, next) => {
  if (sesionUsuario.obtenerSesionActual()) {
    next();
  } else {
    return res
      .status(401)
      .json(new respuestaServidor('Acceso no autorizado', true));
  }
};