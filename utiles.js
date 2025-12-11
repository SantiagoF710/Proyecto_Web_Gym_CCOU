

export const crearFiltroDB = (valor) =>
  valor ? new RegExp(valor, 'gi') : undefined;

export const crearOrdenadorDB = (criterio) =>
  criterio === 'asc' || criterio === 'desc' ? criterio : undefined;