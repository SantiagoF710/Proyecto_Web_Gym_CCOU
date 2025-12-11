

const usuario = JSON.parse(sessionStorage.getItem('usuarioApp') || 'null');

if (!usuario || !usuario.documento) {
  window.location.replace('login.html');
}
const $ = (id) => document.getElementById(id);


const nombre = usuario.nombre || 'Usuario';
const documento = usuario.documento || '';
const actividad = usuario.actividad || 'Actividad';

const correo =
  usuario.correoElectronico ||
  usuario.email ||
  usuario.correo ||
  'No especificado';


const nameEl = $('profileName');
const docHeaderEl = $('profileDocHeader');
const actHeaderEl = $('profileActivityHeader');

if (nameEl) nameEl.textContent = nombre;
if (docHeaderEl) docHeaderEl.textContent = `Documento: ${documento}`;
if (actHeaderEl) actHeaderEl.textContent = `Actividad: ${actividad}`;

const entrenamientos = Math.floor(Math.random() * 10) + 1;
const horas = Math.floor(Math.random() * 12) + 1;
const dias = Math.floor(Math.random() * 30) + 1;

const statTrainingsEl = $('statTrainings');
const statHoursEl = $('statHours');
const statDaysEl = $('statDays');
const statActivityEl = $('statActivity');

if (statTrainingsEl) statTrainingsEl.textContent = entrenamientos;
if (statHoursEl) statHoursEl.textContent = horas;
if (statDaysEl) statDaysEl.textContent = dias;
if (statActivityEl) statActivityEl.textContent = actividad;

const fullNameInput = $('profileFullNameInput');
const docInput = $('profileDocInput');
const emailInput = $('profileEmailInput');
const activityInput = $('profileActivityInput');

if (fullNameInput) fullNameInput.value = nombre;
if (docInput) docInput.value = documento;
if (emailInput) emailInput.value = correo;
if (activityInput) activityInput.value = actividad;