# VocaContext en Netlify

## Acceso
- **Profesor:** `https://TU-SITIO.netlify.app/` → Set-up → Preview → **Copy link**.
- **Alumno:** abre el enlace copiado (`…/#alumno=…`). Solo ve la bienvenida, las 4 fases y su resumen; nunca el set-up ni la preview.
- La lección viaja dentro del enlace: si editas la lección, vuelve a copiar el enlace.
- Al terminar, el alumno pulsa **Copy results for my teacher** y lo pega en Classroom/correo.

## Publicar (Git o Netlify CLI — arrastrar y soltar no publica la función de IA)
1. Sube esta carpeta a un repositorio de GitHub y conéctalo en Netlify (o `npx netlify deploy --prod` desde la carpeta).
2. En Netlify → Site configuration → Environment variables, añade `ANTHROPIC_API_KEY` con tu clave de console.anthropic.com.
3. Opcional: `ANTHROPIC_MODEL` (por defecto `claude-haiku-4-5`).

## Voz neuronal (opcional)
Añade `OPENAI_API_KEY` en las variables de entorno y la lectura en voz alta usa una voz neuronal (igual en todos los dispositivos, con acento UK/US). Sin ella se usa la mejor voz del navegador: en Windows, Edge ofrece voces "Natural"; en iPad/Mac, descarga voces "Mejorada/Premium" en Ajustes › Accesibilidad › Contenido leído.

Sin clave la herramienta sigue funcionando con la muestra offline y la autoevaluación.
