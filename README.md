# Interfase — laboratorio de ideas

Portafolio/blog estático para reunir proyectos interactivos, visualizadores y sus fundamentos teóricos.

## Ejecutar

```bash
python3 -m http.server 4173
```

Abrir `http://localhost:4173/`.

## Estructura

- `index.html`: estructura semántica y contenido editorial.
- `projects.js`: catálogo normalizado de proyectos y teoría.
- `app.js`: filtros, diálogo, mapa conceptual y visualizadores Canvas.
- `styles.css`: sistema visual responsive y temas claro/oscuro.
- `sw.js` + `manifest.webmanifest`: instalación y uso offline.

Parqués RL enlaza a `../parques/app/index.html` cuando ambos proyectos se sirven desde `/home/gravemind/Documentos` como raíz. Si se sirve sólo esta carpeta, el resto del sitio funciona pero ese enlace queda fuera del servidor.
