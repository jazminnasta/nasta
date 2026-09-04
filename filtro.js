(() => {
  const grilla = document.querySelector(".grilla");
  if (!grilla) return;
  const tarjetas = [...grilla.querySelectorAll(".modelo")];
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
        linea === "todas" ? location.pathname : "#" + linea);
  };

  botones.forEach((b) =>
    b.addEventListener("click", () => cambiar(b.dataset.linea)));

  const inicial = location.hash.slice(1);
  aplicar(botones.some((b) => b.dataset.linea === inicial) ? inicial : "todas");
  addEventListener("hashchange", () =>
    cambiar(location.hash.slice(1) || "todas", false));
})();
