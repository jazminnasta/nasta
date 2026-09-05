// ?todos en la URL muestra también los modelos ocultos. No es un candado: las
// fichas siguen publicadas y los modelos están en el HTML de la grilla.
(() => {
  window.TODOS = new URLSearchParams(location.search).has("todos");
  if (!window.TODOS) return;

  for (const e of document.querySelectorAll("[data-todos]"))
    e.textContent = e.dataset.todos;
  for (const a of document.querySelectorAll("[data-todos-href]"))
    a.setAttribute("href", a.dataset.todosHref);

  // Se pega a los links internos para no perderlo al navegar.
  for (const a of document.querySelectorAll("a[href]")) {
    const [ruta, hash] = a.getAttribute("href").split("#");
    if (!ruta || /^[a-z]+:/i.test(ruta) || ruta.includes("?")) continue;
    a.setAttribute("href", ruta + "?todos" + (hash ? "#" + hash : ""));
  }
})();
