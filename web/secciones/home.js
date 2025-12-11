
import { MiServidor } from '../MiServidor.js';
const usuario = JSON.parse(sessionStorage.getItem('usuarioApp') || 'null');

if (!usuario || !usuario.documento) {
  window.location.replace('login.html');
}

let ejerciciosHoy = [];
let ejerciciosCompletados = new Set();
let tiempoEstimadoMin = 0;


const lblWelcome = document.getElementById('homeWelcome');
const lblSubtitle = document.getElementById('homeSubtitle');
const lblActivity = document.getElementById('homeActivity');
const listContainer = document.getElementById('exerciseList');
const statProgress = document.getElementById('statProgress');
const statCompleted = document.getElementById('statCompleted');
const statTime = document.getElementById('statTime');


const obtenerDiaRutinaDesdeFecha = (fecha) => {
  const day = fecha.getDay(); 

  if (day === 0 || day === 6) {
    return 'Sábado/Domingo';
  }

  const mapa = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
  };

  return mapa[day];
};

const formatearFechaLarga = (fecha) => {
  return fecha.toLocaleDateString('es-UY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const generarTiempoEstimado = (cantidadEjercicios) => {
  const base = 60;
  const extra = Math.floor(Math.random() * 31);
  return base + extra;
};


const actualizarEstadisticas = () => {
  const total = ejerciciosHoy.length;
  const completados = ejerciciosCompletados.size;

  if (statCompleted) {
    statCompleted.textContent = `${completados}/${total}`;
  }

  if (statProgress) {
    const porcentaje = total === 0 ? 0 : Math.round((completados / total) * 100);
    statProgress.textContent = `${porcentaje}%`;
  }

  if (statTime) {
    statTime.textContent = `${tiempoEstimadoMin || 60} min`;
  }
};


const renderRutinaHoy = (ejercicios) => {
  ejerciciosHoy = ejercicios || [];
  ejerciciosCompletados.clear();

  if (!listContainer) return;
  listContainer.innerHTML = '';

  if (!ejerciciosHoy.length) {
    listContainer.innerHTML =
      '<p style="padding: 1rem 0;">No hay ejercicios cargados para hoy.</p>';
    tiempoEstimadoMin = generarTiempoEstimado(0);
    actualizarEstadisticas();
    return;
  }

  tiempoEstimadoMin = generarTiempoEstimado(ejerciciosHoy.length);

  ejerciciosHoy.forEach((ej, index) => {
    const div = document.createElement('div');
    div.className = 'exercise';
    div.dataset.index = String(index);

    div.innerHTML = `
      <button class="circle-btn" type="button"></button>
      <div class="exercise-info">
        <h4>${ej.ejercicio}</h4>
        <p>${ej.series} series × ${ej.repeticiones} repeticiones</p>
      </div>
      <div class="exercise-weight">
        <strong>${ej.peso ? ej.peso + 'kg' : ''}</strong>
      </div>
    `;
    listContainer.appendChild(div);
  });

  actualizarEstadisticas();
};

if (listContainer) {
  listContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.circle-btn');
    if (!btn) return;

    const card = btn.closest('.exercise');
    if (!card) return;

    const index = Number(card.dataset.index);
    if (Number.isNaN(index)) return;

    if (ejerciciosCompletados.has(index)) {
      ejerciciosCompletados.delete(index);
      card.classList.remove('completed');
      btn.classList.remove('active');
    } else {
      ejerciciosCompletados.add(index);
      card.classList.add('completed');
      btn.classList.add('active');
    }

    actualizarEstadisticas();
  });
}

(async function initHome() {
  const hoy = new Date();
  const diaTexto = obtenerDiaRutinaDesdeFecha(hoy);
  const fechaLarga = formatearFechaLarga(hoy);

  if (lblWelcome) {
    lblWelcome.textContent = `¡Bienvenido, ${usuario.nombre}!`;
  }

  if (lblSubtitle) {
    lblSubtitle.innerHTML = `Hoy es ${fechaLarga}. Tu rutina de <strong>${usuario.actividad}</strong> te espera.`;
  }

  if (lblActivity) {
    lblActivity.textContent = usuario.actividad;
  }

  try {
    const ejercicios = await MiServidor.obtenerRutina(usuario.documento, diaTexto);
    console.log('Rutina de hoy:', ejercicios);
    renderRutinaHoy(ejercicios);
  } catch (err) {
    console.error(err);
    if (listContainer) {
      listContainer.innerHTML =
        '<p style="padding: 1rem 0; color:red;">Error cargando la rutina.</p>';
    }
    ejerciciosHoy = [];
    ejerciciosCompletados.clear();
    tiempoEstimadoMin = generarTiempoEstimado(0);
    actualizarEstadisticas();
  }
})();