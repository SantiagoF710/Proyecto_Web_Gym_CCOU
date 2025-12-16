
const manejarErrores = (error = new Error('Error desconocido')) => {
  console.error('Ha ocurrido un error:', error.message);
  throw error;
};

const getApiBase = () => {
  const LOCAL_API = 'http://localhost:3000';

  try {
    if (typeof window === 'undefined') {
      return LOCAL_API;
    }

    const { hostname, origin } = window.location;

    if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
      return LOCAL_API;
    }

    return origin;
  } catch {
    return LOCAL_API;
  }
};

const API_BASE = getApiBase();

const obtenerUrl = (ruta) => `${API_BASE}/${ruta}`;

const procesarRespuesta = (res) => {
  return res.json().then((data) => {
    if (data.error) {
      throw new Error(data.mensaje || 'Error en el servidor');
    }
    return data.mensaje || data;
  });
};

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export class MiServidor {
  static urlBase = API_BASE;

  static obtenerUrl(ruta) {
    return `${MiServidor.urlBase}/${ruta}`;
  }

  static signup(actividad, nombre, documento, correo) {
    const body = JSON.stringify({ actividad, nombre, documento, correo });

    return fetch(obtenerUrl('signup'), {
      method: 'POST',
      headers,
      body,
    })
      .then(procesarRespuesta)
      .catch(manejarErrores);
  }

  static async login(documento) {
    const body = JSON.stringify({ documento });

    try {
      const res = await fetch(obtenerUrl('login'), {
        method: 'POST',
        headers,
        body,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.mensaje || 'Error al iniciar sesión');
      }

      return data.datos;
    } catch (error) {
      manejarErrores(error);
      throw error;
    }
  }

  static adminLogin(documento) {
    const body = JSON.stringify({ documento });

    return fetch(obtenerUrl('admin/login'), {
      method: 'POST',
      headers,
      body,
    })
      .then(procesarRespuesta)
      .catch(manejarErrores);
  }

  static buscarUsuariosPorDocumento(documentoParcial) {
    const query = `usuarios?documento=${encodeURIComponent(documentoParcial)}`;
    return fetch(obtenerUrl(query), { method: 'GET', headers })
      .then(procesarRespuesta)
      .catch(manejarErrores);
  }

  static obtenerRutina(documento, dia) {
    const params = new URLSearchParams({ documento, dia }).toString();
    return fetch(obtenerUrl(`rutinas?${params}`), {
      method: 'GET',
    })
      .then(procesarRespuesta)
      .catch(manejarErrores);
  }

  static agregarEjercicio({ documento, dia, ejercicio, series, repeticiones }) {
    const body = JSON.stringify({
      documento,
      dia,
      ejercicio,
      series,
      repeticiones,
    });

    return fetch(obtenerUrl('rutinas'), {
      method: 'POST',
      headers,
      body,
    })
      .then(procesarRespuesta)
      .catch(manejarErrores);
  }

  static async actualizarEjercicio(id, datos) {
    const respuesta = await fetch(obtenerUrl(`rutinas/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
      const texto = await respuesta.text();
      throw new Error(`Error actualizando ejercicio: ${texto}`);
    }

    return respuesta.json();
  }

  static eliminarEjercicio(id) {
    return fetch(obtenerUrl(`rutinas/${id}`), {
      method: 'DELETE',
      headers,
    }).then(procesarRespuesta);
  }
}
