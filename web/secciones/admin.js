

import { MiServidor } from '../MiServidor.js';
import { obtenerValorInput, imprimir } from '../Miutiles.js';

const formAdmin = document.getElementById('formAdmin');

formAdmin.addEventListener('submit', (e) => {
  e.preventDefault();

  const documento = obtenerValorInput('documento');
  const mensajeId = 'mensajeAdmin';

  imprimir(mensajeId, '');


  if (!/^\d{8}$/.test(documento)) {
    imprimir(mensajeId, 'El documento debe tener exactamente 8 números.');
    return;
  }

  MiServidor.adminLogin(documento)
    .then(() => {
      sessionStorage.setItem('adminActivo', 'TRUE');
      window.location.replace('backofficebusqueda.html');
    })
    .catch((error) => {
      imprimir(mensajeId, error.message || 'Error al iniciar sesión como administrador.');
    });
});