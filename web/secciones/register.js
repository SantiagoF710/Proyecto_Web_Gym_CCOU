
import { MiServidor } from '../MiServidor.js';
import { imprimir, obtenerValorInput } from '../Miutiles.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form'); 

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const actividad = obtenerValorInput('actividad');
    const nombre = obtenerValorInput('nombre');
    const documento = obtenerValorInput('documento');
    const correo = obtenerValorInput('correo');

    imprimir('mensajeSignup', '');

    if (!actividad || !nombre || !documento || !correo) {
      imprimir('mensajeSignup', 'Todos los campos son obligatorios.');
      return;
    }

    if (documento.length !== 8) {
      imprimir('mensajeSignup', 'El documento debe tener exactamente 8 números.');
      return;
    }

    MiServidor.signup(actividad, nombre, documento, correo)
      .then((mensaje) => {
        imprimir('mensajeSignup', mensaje || 'Registro exitoso.');
        window.location.href = 'login.html';
      })
      .catch((error) => {
        imprimir('mensajeSignup', error.message || 'Error en el registro.');
      });
  });
});