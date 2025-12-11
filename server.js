
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import path from 'path';
import { fileURLToPath } from 'url';

import { conectarDB } from './database/conexion.js';
import { postSignup } from './controladores/postSignup.js';
import { postLogin } from './controladores/postLogin.js';
import { postAdminLogin } from './controladores/postAdminLogin.js';
import { getUsuariosBusqueda } from './controladores/getUsuariosBusqueda.js';
import { getRutinaUsuarios } from './controladores/getRutinaUsuarios.js';
import { postRutinaUsuarios } from './controladores/postRutinaUsuarios.js';
import { putRutinaUsuarios } from './controladores/putRutinaUsuarios.js';
import { deleteRutinaUsuarios } from './controladores/deleteRutinaUsuarios.js';
import { controlarSesion } from './middlewares/controlarSesion.js';
import { manejarErrores } from './middlewares/manejarErrores.js';


await conectarDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());   

app.use(express.static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'secciones', 'login.html'));
});

app.post('/signup', postSignup);
app.post('/login', postLogin);
app.post('/admin/login', postAdminLogin);

app.use(controlarSesion);

app.get('/usuarios',getUsuariosBusqueda);

app.get('/rutinas', getRutinaUsuarios);
app.post('/rutinas', postRutinaUsuarios);
app.put('/rutinas/:id', putRutinaUsuarios);
app.delete('/rutinas/:id', deleteRutinaUsuarios);

app.use(manejarErrores);


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});