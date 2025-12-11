
import { MiServidor } from '../MiServidor.js';

const usuario = JSON.parse(sessionStorage.getItem('usuarioBackoffice') || 'null') || {};

if (!usuario || !usuario.documento) {
  document.location.replace('backofficebusqueda.html');
}

let diaActual = '';
let ejerciciosDia = [];
let ejercicioEditando = null;
let modoModal = 'crear';

const lblNombre = document.getElementById('routineUserName');
const lblDocumento = document.getElementById('routineUserDoc');
const lblActividad = document.getElementById('routineUserActivity');
const lblDiaTitulo = document.getElementById('routineDayTitle');

const selectDia = document.getElementById('routineDaySelect');
const btnAgregar = document.getElementById('routineAddBtn');
const grid = document.getElementById('routineExercisesGrid');

const modalOverlay = document.getElementById('routineModalOverlay');
const modalTitle = document.getElementById('routineModalTitle');
const selectEjercicio = document.getElementById('modalEjercicio');
const inputSeries = document.getElementById('modalSeries');
const inputReps = document.getElementById('modalReps');
const lblModalError = document.getElementById('modalError');
const btnModalCancelar = document.getElementById('modalCancelar');
const btnModalGuardar = document.getElementById('modalGuardar');

const confirmOverlay = document.getElementById('routineConfirmOverlay');
const btnConfirmCancelar = document.getElementById('confirmCancelar');
const btnConfirmAceptar = document.getElementById('confirmAceptar');
let ejercicioEliminarId = null;


(function inicializar() {
  if (lblNombre) lblNombre.textContent = `Rutina de ${usuario.nombre}`;
  if (lblDocumento) lblDocumento.textContent = `Documento: ${usuario.documento}`;
  if (lblActividad) lblActividad.textContent = `Actividad: ${usuario.actividad}`;
  if (lblDiaTitulo) lblDiaTitulo.textContent = 'Selecciona un día';

  if (grid) {
    grid.innerHTML = `
      <p style="color:#fff; text-align:center; padding:1rem 0;">
        Selecciona un día para ver o agregar la rutina.
      </p>
    `;
  } else {
    console.error('No se encontró el contenedor de la grid: #routineExercisesGrid');
  }
})();


const limpiarGrid = (mensaje = 'Selecciona un día') => {
  if (!grid) return;
  grid.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = mensaje;
  p.style.color = '#fff';
  p.style.textAlign = 'center';
  p.style.padding = '1rem 0';
  grid.appendChild(p);
};

const renderEjercicios = (ejercicios = []) => {
  ejerciciosDia = ejercicios;
  if (!grid) return;

  grid.innerHTML = '';

  if (!ejercicios.length) {
    limpiarGrid('No hay ejercicios cargados para este día.');
    return;
  }

  ejercicios.forEach(ej => {
    const card = document.createElement('article');
    card.className = 'routine-exercise-card';
    card.dataset.id = ej._id;

    card.innerHTML = `
      <div>
        <h3>${ej.ejercicio}</h3>
        <p class="routine-series">${ej.series} series</p>
        <p class="routine-reps">${ej.repeticiones} repeticiones</p>
      </div>
      <div class="routine-card-actions">
        <button type="button" class="btn-small btn-outline btn-edit">Modificar</button>
        <button type="button" class="btn-small btn-outline btn-delete">Eliminar</button>
      </div>
    `;

    grid.appendChild(card);
  });
};

const limpiarModal = () => {
  if (selectEjercicio) selectEjercicio.selectedIndex = 0;
  if (inputSeries) inputSeries.value = '';
  if (inputReps) inputReps.value = '';
  if (lblModalError) lblModalError.textContent = '';
};

const mostrarModal = (mostrar) => {
  if (!modalOverlay) {
    console.warn('No existe el modalOverlay en el HTML');
    return;
  }
  if (mostrar) {
    modalOverlay.classList.add('open');
  } else {
    modalOverlay.classList.remove('open');
  }
};

const abrirModalCrear = () => {
  modoModal = 'crear';
  ejercicioEditando = null;
  if (modalTitle) modalTitle.textContent = 'Agregar ejercicio';
  limpiarModal();
  mostrarModal(true);
};

const abrirModalEditar = (ejercicio) => {
  modoModal = 'editar';
  ejercicioEditando = ejercicio;
  if (modalTitle) modalTitle.textContent = 'Modificar ejercicio';
  limpiarModal();
  if (selectEjercicio) selectEjercicio.value = ejercicio.ejercicio;
  if (inputSeries) inputSeries.value = ejercicio.series;
  if (inputReps) inputReps.value = ejercicio.repeticiones;
  mostrarModal(true);
};

const cerrarModal = () => {
  mostrarModal(false);
};


if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) cerrarModal();
  });
}

if (btnModalCancelar) {
  btnModalCancelar.addEventListener('click', cerrarModal);
}

if (btnModalGuardar) {
  btnModalGuardar.addEventListener('click', async () => {
    if (lblModalError) lblModalError.textContent = '';

    if (!diaActual) {
      if (lblModalError) lblModalError.textContent = 'Primero selecciona un día.';
      return;
    }

    const ejercicio = selectEjercicio ? selectEjercicio.value : '';
    const series = inputSeries ? inputSeries.value.trim() : '';
    const repeticiones = inputReps ? inputReps.value.trim() : '';

    if (!ejercicio || !series || !repeticiones) {
      if (lblModalError) lblModalError.textContent = 'Todos los campos son obligatorios.';
      return;
    }

    if (!/^\d+$/.test(series) || Number(series) <= 0) {
      if (lblModalError) lblModalError.textContent = 'Las series deben ser un número mayor a 0.';
      return;
    }

  const basePayload = {
    ejercicio,
    series: Number(series),
    repeticiones
  };

  try {
    if (modoModal === 'crear') {
      const payloadCrear = {
        ...basePayload,
        documento: usuario.documento,
        dia: diaActual
      };
      await MiServidor.agregarEjercicio(payloadCrear);
    } else if (modoModal === 'editar' && ejercicioEditando) {
      await MiServidor.actualizarEjercicio(ejercicioEditando._id, basePayload);
    }

    cerrarModal();
    await cargarRutina(diaActual);
  } catch (error) {
    console.error(error);
    if (lblModalError) {
      lblModalError.textContent = error.message || String(error);
    }
  }
  });
}


const abrirConfirmarEliminar = (id) => {
  ejercicioEliminarId = id;
  if (!confirmOverlay) {
    const ok = window.confirm('¿Seguro que querés eliminar este ejercicio?');
    if (ok) {
      btnConfirmAceptar?.click();
    }
    return;
  }
  confirmOverlay.classList.add('open');
};

const cerrarConfirmarEliminar = () => {
  ejercicioEliminarId = null;
  if (confirmOverlay) confirmOverlay.classList.remove('open');
};

if (confirmOverlay) {
  confirmOverlay.addEventListener('click', (e) => {
    if (e.target === confirmOverlay) cerrarConfirmarEliminar();
  });
}

if (btnConfirmCancelar) {
  btnConfirmCancelar.addEventListener('click', cerrarConfirmarEliminar);
}

if (btnConfirmAceptar) {
  btnConfirmAceptar.addEventListener('click', async () => {
    if (!ejercicioEliminarId) return;

    try {
      await MiServidor.eliminarEjercicio(ejercicioEliminarId);
      cerrarConfirmarEliminar();
      await cargarRutina(diaActual);
    } catch (error) {
      console.error(error);
      alert(error.message || String(error));
    }
  });
}


const cargarRutina = async (dia) => {
  limpiarGrid('Cargando rutina...');

  try {
    const respuesta = await MiServidor.obtenerRutina(usuario.documento, dia);

    console.log('Rutina recibida:', respuesta);

    const ejercicios = Array.isArray(respuesta)
      ? respuesta
      : (respuesta.datos || []);

    renderEjercicios(ejercicios);
  } catch (error) {
    console.error(error);
    limpiarGrid(error.message || 'Error cargando rutina');
  }
};


if (selectDia) {
  selectDia.addEventListener('change', async () => {
    const opcion = selectDia.options[selectDia.selectedIndex];
    diaActual = opcion.value || opcion.textContent;

    if (lblDiaTitulo) lblDiaTitulo.textContent = `${diaActual} - Rutina`;
    await cargarRutina(diaActual);
  });
} else {
  console.error('No se encontró el select de día: #routineDaySelect');
}

if (btnAgregar) {
  btnAgregar.addEventListener('click', () => {
    if (!diaActual) {
      limpiarGrid('Primero selecciona un día.');
      return;
    }
    abrirModalCrear();
  });
} else {
  console.error('No se encontró el botón de agregar rutina: #routineAddBtn');
}


if (grid) {
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.routine-exercise-card');
    if (!card) return;

    const id = card.dataset.id;
    if (!id) return;

    const ejercicio = ejerciciosDia.find((ej) => ej._id === id);

    if (e.target.closest('.btn-edit')) {
      if (ejercicio) abrirModalEditar(ejercicio);
      return;
    }

    if (e.target.closest('.btn-delete')) {
      abrirConfirmarEliminar(id);
    }
  });
}
