

import { modeloRutinas } from '../database/modeloRutinas.js';

export const putRutinaUsuarios = (req, res, next) => {
  const { id } = req.params;
  const { ejercicio, series, repeticiones } = req.body;

  modeloRutinas.findByIdAndUpdate(
    id,
    { ejercicio, series, repeticiones },
    { new: true, runValidators: true }
  )
    .then((rutinaActualizada) => {
      if (!rutinaActualizada) {
        return res
          .status(404)
          .json({ error: true, mensaje: 'No se encontró la rutina a modificar' });
      }
      return res.json(rutinaActualizada);
    })
    .catch(next);
};