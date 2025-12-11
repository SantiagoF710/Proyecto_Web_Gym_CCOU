

import { Usuario } from '../database/modeloUsuarios.js';
import { respuestaServidor } from '../respuestas/respuestaServidor.js';

export const getUsuariosBusqueda = async (req, res, next) => {
  try {
    const { documento = '' } = req.query;

    if (!documento) {
      throw new Error('Debe ingresar al menos un número de documento');
    }

    if (!/^\d+$/.test(documento)) {
      throw new Error('El documento solo puede contener números');
    }

    if (documento.length > 8) {
      throw new Error('El documento no puede tener más de 8 dígitos');
    }

    const regex = new RegExp(`^${documento}`);

  const usuarios = await Usuario.find({
  documento: { $regex: regex },
  rol: { $ne: 'admin' } 
}).select('nombre documento actividad');

    const respuesta = new respuestaServidor('', false);
    respuesta.datos = usuarios;

    return res.json(respuesta);
  } catch (error) {
    next(error);
  }
};