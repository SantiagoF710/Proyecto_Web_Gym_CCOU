
import { respuestaServidor } from '../respuestas/respuestaServidor.js';

export const manejarErrores = (error, req, res, next) => {
  console.error('\x1b[31m', 'Ha ocurrido un error:', error.stack);
  return res
    .status(500)
    .json(new respuestaServidor(error.message || 'Error interno', true));
};