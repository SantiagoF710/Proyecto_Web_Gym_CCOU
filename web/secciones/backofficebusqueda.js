import { MiServidor } from '../MiServidor.js';
import { obtenerValorInput } from '../Miutiles.js'; 

const btnBuscar = document.querySelector('.backoffice-search-btn');
const contenedorResultados = document.querySelector('.backoffice-results');

const validarDocumentoParcial = (valor) => {
  if (!valor) {
    throw new Error('Debe ingresar al menos un número del documento');
  }
  if (!/^\d+$/.test(valor)) {
    throw new Error('El documento solo puede contener números');
  }
  if (valor.length > 8) {
    throw new Error('El documento no puede tener más de 8 dígitos');
  }
};

const renderMensaje = (mensaje) => {
  contenedorResultados.innerHTML = `
    <article class="backoffice-result-card">
      <div class="backoffice-result-info">
        <p class="result-name solo-mensaje">${mensaje}</p>
      </div>
    </article>
  `;
};

const renderResultados = (usuarios, filtro) => {
  if (!usuarios || usuarios.length === 0) {
    renderMensaje(`No se encontraron usuarios para "${filtro}"`);
    return;
  }

  contenedorResultados.innerHTML = '';

  usuarios.forEach((usuario) => {
    const article = document.createElement('article');
    article.classList.add('backoffice-result-card');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('backoffice-result-info');
    infoDiv.innerHTML = `
      <p class="result-name">${usuario.nombre}</p>
      <p class="result-doc">Documento: ${usuario.documento}</p>
      <p class="result-activity">Actividad: ${usuario.actividad}</p>
    `;

    const btnRutina = document.createElement('button');
    btnRutina.className = 'btn-secondary result-btn';
    btnRutina.textContent = 'Ver rutina';

    btnRutina.addEventListener('click', () => {
      const datosUsuario = {
        documento: usuario.documento,
        nombre: usuario.nombre,
        actividad: usuario.actividad,
      };

      sessionStorage.setItem('usuarioBackoffice', JSON.stringify(datosUsuario));

      window.location.href = 'backofficeusuarios.html';
    });

    article.appendChild(infoDiv);
    article.appendChild(btnRutina);
    contenedorResultados.appendChild(article);
  });
};

btnBuscar.addEventListener('click', () => {
  const valor = obtenerValorInput('documentoBusqueda');

  try {
    validarDocumentoParcial(valor);
  } catch (error) {
    renderMensaje(error.message);
    return;
  }

  MiServidor.buscarUsuariosPorDocumento(valor)
    .then((data) => {
      renderResultados(data.datos || [], valor);
    })
    .catch((error) => {
      renderMensaje(error);
    });
});