# Interfase — atlas de sistemas

Atlas personal de matemáticas, sistemas e inteligencia artificial: ocho proyectos interactivos donde cada idea se puede intervenir, medir y llevar de vuelta a la teoría. Pensado para estudiantes universitarios y docentes.

**En línea:** <https://laboratorio-visual-bay.vercel.app>

## Qué hay dentro

- **Teorema de la Tierra (Borsuk–Ulam)** con datos reales de NOAA: climatología mensual 1991–2020 de temperatura y presión, curvas ΔT = 0 y ΔP = 0, fondo por signo antipodal, gemelo al pasar el cursor, búsqueda numérica de la coincidencia y globo 3D en WebGL2 con media vuelta hasta la antípoda.
- **Mesa inestable:** valor intermedio aplicado a una mesa sobre suelos continuos, con bisección instrumentada.
- **Parqués RL:** laboratorio de dados tradicionales frente a dados de Sicherman, con la explicación de su generatriz, lo que cambia en el Parqués y los resultados medidos en el proyecto [Parqués RL](https://parques-lab.vercel.app).
- **Cadenas de Markov, Paisaje de gradiente, Atlas de activaciones, Mapa logístico y Monte Carlo:** visualizadores con manipulación directa.
- **Constelación** de conceptos navegable con ruta de estudio, **Ideas que engañan** (errores frecuentes con su caso abierto en el instrumento) y **Cómo leer un proyecto**.

La página es autocontenida: cada instrumento explica en pantalla sus símbolos, colores y regla («Cómo leer el instrumento»), y cada concepto de las tarjetas está definido dentro de su proyecto.

Las escenas ilustran los argumentos; no sustituyen sus demostraciones ni son simulaciones físicas. Cada proyecto declara sus hipótesis y límites en la interfaz.

## Ejecutar en local

```bash
cd laboratorio-visual
python3 -m http.server 4173
```

Abrir <http://127.0.0.1:4173/>. Es un sitio estático sin dependencias ni compilación. Si una recarga muestra una versión anterior, forzarla con Ctrl+Shift+R: hay un service worker para uso sin conexión.

## Estructura

| Ruta | Contenido |
|---|---|
| `index.html` | Estructura semántica y contenido editorial |
| `projects.js` | Catálogo de proyectos, teoría y pasos de cada aplicación |
| `lab-math.js` | Lógica pura compartida con los tests: dados, climatología NOAA y búsqueda antipodal |
| `app.js` | Interfaz: filtros, diálogos, visualizadores Canvas, globo WebGL2 y animaciones |
| `styles.css` | Sistema visual responsive, temas claro y oscuro, tokens `--lab-*` |
| `sw.js`, `manifest.webmanifest` | Instalación como PWA y uso sin conexión |
| `assets/data/noaa-climatology.json` | Climatología NCEP/NCAR empaquetada (5°, 13 cortes mensuales) |
| `assets/fonts/` | Newsreader, Hanken Grotesk y JetBrains Mono autoalojadas |
| `assets/SOURCES.md` | Procedencia y licencias de datos, imágenes y fuentes |
| `PRODUCT.md` | Contexto del producto: público, propósito y principios |
| `tests/` | `smoke.py` (estructura y contratos) y `lab_math.test.js` (lógica) |

## Tests

```bash
python3 tests/smoke.py
node --test tests/lab_math.test.js
```

La CI de GitHub corre ambos en cada push y pull request.

## Publicar

```bash
npx vercel deploy --prod --yes
```

`.vercelignore` deja fuera del despliegue `.claude/`, `tests/`, `.github/` y los documentos internos. Si el repositorio se conecta a Vercel desde *Settings → Git*, cada merge a `main` se publica solo.

## Datos y créditos

- Clima: NCEP/NCAR Reanalysis 1, NOAA Physical Sciences Laboratory (dominio público). Kalnay et al. (1996), *Bull. Amer. Meteor. Soc.* 77, 437–471.
- Textura terrestre: ejemplos públicos de Three.js.
- Fuentes: SIL Open Font License 1.1.

Detalle completo en `assets/SOURCES.md`.
