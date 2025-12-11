
import { Usuario } from '../database/modeloUsuarios.js';
import { respuestaServidor } from '../respuestas/respuestaServidor.js';
import { sesionUsuario } from '../sesionUsuario.js';

export const postAdminLogin = (req, res, next) => {
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
        throw new Error(`No existe un usuario con el documento ${documento}.`);
      }

      if (usuario.rol !== 'admin') {
        throw new Error('El documento ingresado no pertenece a un administrador.');
      }

      sesionUsuario.guardarSesion();

      return res.json(new respuestaServidor('Login de administrador exitoso.'));
    })
    .catch(next);
};