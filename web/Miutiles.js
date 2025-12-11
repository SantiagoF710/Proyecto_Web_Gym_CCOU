


export const imprimir = (idElemento, contenido) => {
  const nodo = document.getElementById(idElemento);
  if (nodo) nodo.textContent = contenido;
};


export const obtenerValorInput = (idInput) =>
  document.getElementById(idInput)?.value.trim() || '';

