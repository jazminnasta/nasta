(() => {
  const grilla = document.querySelector(".grilla");
  if (!grilla) return;
  // Las ocultas las esconde el CSS por [data-oculto]; con ?todos se les saca el
  // atributo y vuelven al juego como una más.
  const todas = [...grilla.querySelectorAll(".modelo")];
  if (window.TODOS) for (const t of todas) t.removeAttribute("data-oculto");
  const tarjetas = todas.filter((t) => !t.hasAttribute("data-oculto"));
  const botones = [...document.querySelectorAll(".filtro button")];
  const cuenta = document.querySelector(".filtro__cuenta");
  const quieto = matchMedia("(prefers-reduced-motion: reduce)");

  tarjetas.forEach((t, i) => (t.style.viewTransitionName = "m" + i));

  const aplicar = (linea) => {
    botones.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.linea === linea)));
    let n = 0;
    for (const t of tarjetas) {
      const entra = linea === "todas" || t.dataset.linea === linea;
      t.hidden = !entra;
      if (entra) n++;
    }
    cuenta.textContent = n === 1 ? "1 modelo" : n + " modelos";
  };

  const cambiar = (linea, historia = true) => {
    if (document.startViewTransition && !quieto.matches)
      document.startViewTransition(() => aplicar(linea));
    else aplicar(linea);
    if (historia)
      history.replaceState(null, "",
        linea === "todas" ? location.pathname + location.search : "#" + linea);
  };

  botones.forEach((b) =>
    b.addEventListener("click", () => cambiar(b.dataset.linea)));

  const inicial = location.hash.slice(1);
  aplicar(botones.some((b) => b.dataset.linea === inicial) ? inicial : "todas");
  addEventListener("hashchange", () =>
    cambiar(location.hash.slice(1) || "todas", false));
})();
