
import { Usuario } from '../database/modeloUsuarios.js';
import { respuestaServidor } from '../respuestas/respuestaServidor.js';

export const postSignup = (req, res, next) => {
  const { actividad, nombre, documento, correo } = req.body;

  if (!actividad || !nombre || !documento || !correo) {
    return next(new Error('Debe completar todos los campos del registro'));
  }

  Usuario.findOne({ documento })
    .then((usuarioEncontrado) => {
      if (usuarioEncontrado) {
        throw new Error(`Ya existe un usuario con el documento ${documento}`);
      }

      const nuevoUsuario = new Usuario({
        actividad,
        nombre,
        documento,
        correo,
        rol: 'usuario',
        esActivo: true,
      });

      return nuevoUsuario.save();
    })
    .then(() => {
      return res.json(
        new respuestaServidor('Usuario registrado con éxito')
      );
    })
    .catch(next); 
};