

import { Usuario } from '../database/modeloUsuarios.js';
import { respuestaServidor } from '../respuestas/respuestaServidor.js';
import { sesionUsuario } from '../sesionUsuario.js';

export const postLogin = (req, res, next) => {
  const { documento } = req.body;

  if (!documento) {
    return next(new Error('Debe ingresar un documento.'));
  }

  if (!/^\d{8}$/.test(documento)) {
    return next(new Error('El documento debe tener exactamente 8 números.'));
  }

  Usuario.findOne({ documento })
    .then((usuario) => {
      if (!usuario) {
        throw new Error('Documento incorrecto o usuario inexistente.');
      }

      sesionUsuario.guardarSesion();

      const datosUsuario = {
        nombre: usuario.nombre,
        documento: usuario.documento,
        actividad: usuario.actividad,
        correo: usuario.correo,
      };

      return res.json(new respuestaServidor('Login exitoso', false, datosUsuario));
    })
    .catch(next);
};