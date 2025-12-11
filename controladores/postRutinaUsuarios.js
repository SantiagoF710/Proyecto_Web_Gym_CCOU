

import { modeloRutinas } from '../database/modeloRutinas.js';
import { respuestaServidor } from '../respuestas/respuestaServidor.js';

export const postRutinaUsuarios = (req, res, next) => {
  try {
    const { documento, dia, ejercicio, series, repeticiones } = req.body;

    console.log('POST /rutinas body =>', req.body);

    if (!documento || !dia || !ejercicio || !series || !repeticiones) {
      throw new Error('Todos los campos de la rutina son obligatorios');
    }

    const nuevaRutina = new modeloRutinas({
      documento,
      dia,
      ejercicio,
      series,
      repeticiones,
    });

    return nuevaRutina
      .save()
      .then(() => {
        const resp = new respuestaServidor('Ejercicio agregado a la rutina', false);
        return res.json(resp);
      })
      .catch(next);
  } catch (error) {
    return next(error);
  }
};