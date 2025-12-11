
import { MiServidor } from '../MiServidor.js';

const usuario = JSON.parse(sessionStorage.getItem('usuarioApp') || 'null');

if (!usuario || !usuario.documento) {
  window.location.replace('login.html');
}


const grid = document.getElementById('routineGrid');
const lblActivity = document.getElementById('routineActivity');

if (lblActivity) {
  lblActivity.textContent = usuario.actividad || 'tu actividad';
}

const DIAS_SEMANA = [
  { id: 'Lunes', titulo: 'Lunes' },
  { id: 'Martes', titulo: 'Martes' },
  { id: 'Miércoles', titulo: 'Miércoles' },
  { id: 'Jueves', titulo: 'Jueves' },
  { id: 'Viernes', titulo: 'Viernes' },
  { id: 'Sábado/Domingo', titulo: 'Sábado / Domingo' },
];

const calcularTiempo = (ejercicios) => {
  if (!ejercicios || !ejercicios.length) return '--';
  const base = 30;
  const extra = ejercicios.length * 5;
  return base + extra; 
};


const crearCardDia = (dia, ejercicios) => {
  const card = document.createElement('div');
  card.className = 'day-card';

  const tiempo = calcularTiempo(ejercicios);

  let contenidoPrincipal = '';

  if (ejercicios.length) {
    const items = ejercicios
      .map(
        (ej) =>
          `<li>${ej.ejercicio} - ${ej.series} series × ${ej.repeticiones} repeticiones</li>`,
      )
      .join('');

    contenidoPrincipal = `
      <h3>Ejercicios</h3>
      <ul>
        ${items}
      </ul>
    `;
  } else {

    const tituloDescanso =
      dia.id === 'Sábado/Domingo' ? 'Descanso' : 'Sin rutina asignada';

    contenidoPrincipal = `
      <h3>${tituloDescanso}</h3>
      <p class="no-routine">
        No hay ejercicios asignados para este día.
      </p>
    `;
  }

  card.innerHTML = `
    <h2>${dia.titulo} <span class="time">${tiempo}min</span></h2>
    ${contenidoPrincipal}
  `;

  return card;
};

(async function initRutinaSemanal() {
  if (!grid) return;

  grid.innerHTML =
    '<p style="padding: 1rem 0;">Cargando rutina semanal...</p>';

  try {
    const promesas = DIAS_SEMANA.map((dia) =>
      MiServidor.obtenerRutina(usuario.documento, dia.id).catch((err) => {
        console.error(`Error cargando rutina de ${dia.id}:`, err);
        return [];
      }),
    );

    const resultados = await Promise.all(promesas);
    grid.innerHTML = '';

    DIAS_SEMANA.forEach((dia, index) => {
      const ejerciciosDia = resultados[index] || [];
      const card = crearCardDia(dia, ejerciciosDia);
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML =
      '<p style="padding: 1rem 0; color:red;">Error cargando la rutina semanal.</p>';
  }
})();
