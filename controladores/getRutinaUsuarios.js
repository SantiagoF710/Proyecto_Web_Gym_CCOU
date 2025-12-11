

import { modeloRutinas } from '../database/modeloRutinas.js';
import { respuestaServidor } from '../respuestas/respuestaServidor.js';

export const getRutinaUsuarios = (req, res, next) => {
  const { documento, dia } = req.query;

  modeloRutinas.find({ documento, dia })
    .then((rutinas) => {
      console.log('GET /rutinas query =>', { documento, dia });
      console.log('GET /rutinas resultado =>', rutinas.length);

      return res.json(rutinas);
    })
    .catch(next);
};
