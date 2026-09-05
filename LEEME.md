# Sitio NASTA

Catálogo de lámparas. HTML y CSS a mano, sin build ni dependencias: se abre
`index.html` con doble clic y anda.

## Archivos

    index.html            portada: las cuatro familias, el taller y pedidos
    index1/2/3.html       la misma portada con cada versión de logo, para comparar
    modelos.html          la grilla, con filtro por familia (veinte a la vista)
    modelo/<slug>.html    la ficha de cada lámpara, 25 páginas
    logos.html            las versiones de logo comparadas (no está enlazada)
    estilo.css            todo el CSS; colores y tipografías arriba, en :root
    filtro.js             el filtro de modelos.html, 40 líneas, sin librerías
    todos.js              lo que hace el ?todos, en todas las páginas
    favicon.svg           la N, con variante para modo oscuro del navegador
    logos/                los logos en SVG
    imagenes/familias/    las cuatro fotos de la portada, 4:3 (183 kB)
    imagenes/modelos/     una foto por modelo, cuadrada (519 kB)
    tipografias/          Instrument Serif y Archivo, subseteadas a woff2

Las herramientas que generan logos, dibujos y páginas están un nivel arriba,
en `../herramientas/`. **No se publican**: el sitio es sólo esta carpeta.

## Cómo está organizado el catálogo

Todas las lámparas son **de sobremesa**: una pantalla impresa arriba y la madera
abajo. Están agrupadas en cuatro **familias**, por lo que hace la pieza:

    Orgánicas y suaves   10 modelos   cuerpos blandos, torsiones, estrías
    Geométricas           5           un patrón calado que se repite
    Arquitectónicas       5           planos rectos, listones, láminas apiladas
    De autor              5           la madera curvada manda: aro, voladizo, brazo

La portada muestra las cuatro, cada una con la **foto** de un modelo real, en
`imagenes/familias/<clave>.webp`. Cuál es cada una está en el cuarto campo de
`FAMILIAS`, en `catalogo.py`, y las imágenes se recortan y exportan con
`../herramientas/fotos_familias.py`. Cada una linkea a
`modelos.html#organicas`, que abre la página ya filtrada. El filtro escribe el hash en la barra de direcciones,
así que el link a una familia se puede compartir.

Cada modelo apunta a su render en `../catalogo/modelo-<n>.png` (el cuarto campo
de `MODELOS`). La tabla de correspondencia entre nombre y archivo está en
`../nombres-modelos.txt`, y la genera `../herramientas/nombres.py`. Trae también la columna PREF, que es el
puesto de cada una en el orden de la grilla.

Cada lámpara tiene además su ficha en `modelo/<slug>.html`: foto grande, familia,
medidas, materiales, precio y un `mailto:` con el asunto ya puesto. La grilla
linkea a la ficha, y la ficha linkea a la anterior y la siguiente en el mismo
orden de la grilla.

**Ninguna pieza pasa de 18 cm**, que es lo que entra en la cama de la A1 mini.
Si alguna vez se imprime en una máquina más grande, ese tope se puede levantar.

Todo —nombres, medidas, maderas, precios, textos y el número de render— está en
un solo archivo: `../herramientas/catalogo.py`, un diccionario por modelo. Si cambiás algo ahí y corrés
`../herramientas/armar.py`, se regeneran las páginas. También podés editar el
HTML a mano y no volver a correr el script nunca más: son archivos normales, no
hay build. Lo que no se puede es hacer las dos cosas: el script pisa el HTML.

## Modelos ocultos: el `?todos`

Cinco modelos no se muestran: **Cardenal, Chajá, Chingolo, Doradito y Chiví**.
La lista está en `OCULTOS`, en `catalogo.py`. Agregar o sacar un slug de ahí y
correr `armar.py` es todo lo que hace falta.

Un oculto sigue teniendo su ficha en `modelo/<slug>.html` y se puede entrar por
la URL directa: sirve como link suelto para mandarle a alguien. Lo que cambia es
que no sale en la grilla, no lo cuenta el filtro, y el recorrido
anterior/siguiente de las fichas lo saltea.

Agregando **`?todos`** a la URL vuelven a aparecer los cinco:
`modelos.html?todos`. Una vez adentro, el `?todos` se pega solo a los links
internos, así que se puede navegar todo el sitio sin volver a escribirlo. Los
textos que dicen una cantidad ("Veinte modelos", "Ver los veinte modelos")
también cambian a veinticinco.

**No es un candado.** Los cinco modelos están en el HTML de `modelos.html`
—escondidos con CSS— y sus fichas están publicadas. Cualquiera que mire el
fuente los ve. Sirve para no mostrarlos, no para que no se puedan ver.

Cómo está hecho, por si hay que tocarlo:

    catalogo.py   OCULTOS, y vecinos(m, entre=…) para el recorrido salteado
    armar.py      cuantos() escupe <span data-todos="Veinticinco">Veinte</span>
                  las tarjetas ocultas llevan data-oculto
                  los links de al lado llevan data-todos-href con el otro destino
    estilo.css    .grilla .modelo[data-oculto]{display:none}
    todos.js      con ?todos: cambia los [data-todos], los [data-todos-href],
                  y le pega ?todos a los links internos
    filtro.js     si hay ?todos, le saca data-oculto a las tarjetas y listo

El orden importa: `todos.js` va antes que `filtro.js` en `modelos.html`, y el
CSS es el que esconde (no el JS), así que no hay parpadeo al cargar.

## Las fotos

Las 29 imágenes del sitio salen de los renders de `../catalogo/`, recortadas y
pasadas a WebP por `../herramientas/fotos.py`. Ese script hace todo:

    ./entorno/bin/python herramientas/fotos.py

Las de familia van a 4:3 y las de modelo a cuadrado. Cuando un recorte queda mal
—se corta la base, la lámpara está descentrada— se arregla con una línea en el
diccionario `FOCO` de `fotos.py`: `(x, y)` entre 0 y 1, dónde centrar el recorte.

Para cambiar la foto de un modelo, reemplazá el render en `../catalogo/` y volvé
a correr el script. Para cambiar cuál foto representa a una familia, cambiá el
cuarto campo de `FAMILIAS` en `catalogo.py`.

**Ojo con el origen.** Los renders son los que estaban en `catalogo/` como
referencia. Los que quedaron en el sitio no tienen marca de nadie a la vista,
pero antes de publicar conviene confirmar que son propios.

## Los dibujos de línea

El sitio arrancó con dibujos generados en vez de fotos. Ya no se usan, pero el
generador sigue vivo en `../herramientas/dibujos.py` y los SVG quedaron en
`../herramientas/dibujos/`. Se rehacen con:

    ./entorno/bin/python -c "import catalogo, dibujos; [open(f'dibujos/{m[0]}.svg','w').write(dibujos.dibujar(m[4],m[5],m[6])) for m in catalogo.MODELOS]"

Combinan tres ejes: **cuerpo** (la forma de la pantalla), **montaje** (lo que hace
la madera) y **textura** (el calado), y la textura se recorta contra el contorno
del cuerpo con un `clipPath`. Los tres ejes de cada modelo son los campos 5, 6 y
7 de `MODELOS`, así que siguen ahí por si hace falta un placeholder.

## Cambiar el logo

El sitio trae puesta la **de diseño** (`nasta-3-diseño.svg`). Los logos son SVG
inline dentro del HTML (no `<img>`) para que hereden el color del texto: el mismo
archivo sirve en el encabezado oscuro de la portada y en el pie claro.

Para cambiarlo, cambiá `LOGO` arriba de `../herramientas/paginas.py` y corré
`armar.py`. A mano también se puede: copiá el contenido del archivo de `logos/`
y reemplazá el bloque `<svg class="barra__marca" …>` del encabezado, en
`index.html` **y** en `modelos.html`, y lo mismo con `<svg class="pie__marca" …>`
en los dos pies. Dejá la clase puesta: es la que le da el tamaño.

`index1.html`, `index2.html` e `index3.html` son la misma portada con cada logo,
para compararlos. No están enlazadas desde el sitio.

**El tamaño se normaliza solo.** Cada logo dibuja en una parte distinta de su
`viewBox`: el de diseño ocupaba el 66 % de su caja y el editorial el 93 %, así que
a la misma altura en CSS uno se veía mucho más chico. Al meterlos inline se les
recorta el `viewBox` a lo que realmente dibujan, usando la tabla `CAJAS` de
`../herramientas/paginas.py`. Si cambiás un logo, hay que volver a medirlo:

    ./bbox.sh file:///tmp/bbox.html

Un logo que no esté en esa tabla se deja como viene y puede verse desparejo.

**Cuidado con el color.** Un logo sirve para los dos fondos sólo si usa
`currentColor`. Si el archivo trae el color fijo (por ejemplo `fill="#171717"`),
al inlinearlo se lo convierto, pero el archivo suelto sigue con el color fijo.
`logos.html` avisa cuáles tienen ese problema.

## Sobre el dibujo del taller

`imagenes/taller.svg` (las láminas encoladas sobre el molde) **ya no se usa**. La
sección del taller pasó a hablar de madera recuperada y ese dibujo contaba otra
cosa. El archivo sigue ahí por si la sección vuelve al laminado curvo.

## Qué falta completar

Es todo texto de relleno escrito para que el sitio se vea con contenido real:

- Los nombres de las cuatro familias y de los veinticinco pájaros.
- Las medidas y maderas de cada modelo, y el texto de una línea de cada ficha.
- **Los precios**: los inventé yo, escalonados entre 150.000 y 500.000 ARS según
  qué tan buena me parece cada pieza. Están en la grilla y en las 25 fichas.
- El mail `hola@nasta.com.ar` y el Instagram `@nasta`, en la sección Pedidos.
- La ciudad: dice "Buenos Aires, Argentina" porque hacía falta poner algo.
- El plazo de entrega (dice dos a tres semanas).
- El texto del taller: dice que la madera sale de descartes de carpintería y de
  muebles viejos. Revisá de dónde sale de verdad y el grano de lijado.

## Publicar

Es un sitio estático: no hay build ni dependencias. Se sube la carpeta entera y
listo, con cualquier hosting que sirva archivos.

Los enlaces internos llevan la extensión puesta (`modelos.html`, no `/modelos`),
así que funcionan igual abriendo el `index.html` con doble clic que servidos
desde una carpeta. No hace falta configurar nada.

Las fichas de los cinco modelos ocultos también se suben: son parte del sitio,
sólo que no están enlazadas. Si no querés que existan, sacalas de `MODELOS` en
`catalogo.py` en vez de ponerlas en `OCULTOS`.

Ojo con dos archivos que quedan públicos si se sube todo: `logos.html` (la hoja
de comparación de logos) e `index1/2/3.html` (la misma portada con cada logo).
Son de trabajo, no del sitio; borralos antes de subir si no los querés a la vista.

## Detalles que conviene saber

- Las tipografías son **locales**, no de Google Fonts: el sitio no le pide nada
  a ningún servidor de terceros y anda sin internet. Están subseteadas al
  alfabeto castellano (Archivo pesa 60 kB, Instrument Serif 15 kB).
- `estilo.css` no usa `mask-image` a propósito: en Chrome, un SVG externo usado
  como máscara se bloquea por origen y desaparece al abrir el archivo con doble
  clic (`file://`). Por eso los logos van inline.
- Todos los SVG llevan `width` y `height` además del `viewBox`. Sin eso, un SVG
  metido en un `<img>` dentro de un grid item colapsa a cero y no se ve.
- El filtro usa la View Transitions API si el navegador la tiene (Chrome,
  Safari 18) y si no, cambia sin animación. Respeta `prefers-reduced-motion`.
- La única otra animación es la luz de la portada al cargar, una vez.
