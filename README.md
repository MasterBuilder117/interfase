# Interfase — laboratorio de ideas

Portafolio/blog estático para reunir proyectos interactivos, visualizadores y sus fundamentos teóricos.

Incluye ocho proyectos. Los módulos **Teorema de la Tierra** y **Mesa inestable** combinan vistas 2D/3D, controles sincronizados y demostraciones interactivas paso a paso, con las hipótesis y límites matemáticos expuestos en la interfaz.

## Ejecutar

```bash
cd /home/gravemind/Documentos
python3 -m http.server 4173
```

Abrir `http://127.0.0.1:4173/laboratorio-visual/`. Servir desde `Documentos` también permite que la tarjeta de Parqués abra la aplicación real en `../parques/app/index.html`.

## Estructura

- `index.html`: estructura semántica y contenido editorial.
- `projects.js`: catálogo normalizado de proyectos y teoría.
- `app.js`: filtros, diálogo, mapa conceptual y visualizadores Canvas.
- `styles.css`: sistema visual responsive y temas claro/oscuro.
- `sw.js` + `manifest.webmanifest`: instalación y uso offline.

Parqués RL enlaza a `../parques/app/index.html` cuando ambos proyectos se sirven desde `/home/gravemind/Documentos` como raíz. Si se sirve sólo esta carpeta, el resto del sitio funciona pero ese enlace queda fuera del servidor.
