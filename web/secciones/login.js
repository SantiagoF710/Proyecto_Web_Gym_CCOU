
import { MiServidor } from '../MiServidor.js';
import { imprimir, obtenerValorInput } from '../Miutiles.js';

const formLogin = document.querySelector('.login-form');

if (formLogin) {
  formLogin.addEventListener('submit', (event) => {
    event.preventDefault();

    imprimir('mensajeLogin', '');

    const documento = obtenerValorInput('documento').trim();

    if (!/^\d{8}$/.test(documento)) {
      imprimir('mensajeLogin', 'El documento debe tener exactamente 8 números.');
      return;
    }

    MiServidor.login(documento)
      .then((usuario) => {
        console.log('Usuario logueado:', usuario);
        if (!usuario || !usuario.documento) {
          throw new Error('Respuesta del servidor inválida.');
        }

        sessionStorage.setItem('sesionActiva', 'TRUE');
        sessionStorage.setItem('usuarioApp', JSON.stringify(usuario));

        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error(error);
        imprimir('mensajeLogin', error.message || 'Error al iniciar sesión.');
      });
  });
}