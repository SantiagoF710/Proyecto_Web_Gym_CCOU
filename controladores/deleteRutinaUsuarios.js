

import { modeloRutinas } from '../database/modeloRutinas.js';

export const deleteRutinaUsuarios = (req, res, next) => {
  const { id } = req.params;

  modeloRutinas.findByIdAndDelete(id)
    .then((rutinaEliminada) => {
      if (!rutinaEliminada) {
        return res
          .status(404)
          .json({ error: true, mensaje: 'No se encontró la rutina a eliminar' });
      }

      return res.json({ ok: true });
    })
    .catch(next);
};