# Centro de Incidencias · Planimatik (concepto)

Prototipo de triaje de incidencias con IA para un TMS de transporte.
Un conductor o cliente escribe un mensaje informal ("se me ha pinchado en la
GC-1, envío #4821, llego 2 h tarde") y la app lo convierte en una **incidencia
estructurada** —tipo, gravedad, envío, resumen y acción sugerida— y la acumula
en una bandeja de operaciones con KPIs y filtros.

Encaja con la tesis de Planimatik: *convertir la comunicación informal
(emails, llamadas, mensajes) en datos accionables.*

## Stack

- **Vue 3 + TypeScript + Vite** (Composition API, `<script setup>`)
- **Tailwind CSS v4**
- **IA: Google Gemini** vía función serverless (`/api/triage`), con **respaldo
  local** (clasificador por palabras clave) cuando no hay key o no hay red.
- **Vitest** para el clasificador de respaldo.

## Arranque local

```bash
npm install
npm run dev        # http://localhost:5173
```

En `npm run dev` **no hay función serverless**, así que la app usa siempre el
clasificador local (verás la etiqueta "Clasificador local" en el resultado).
El demo funciona igualmente, sin internet ni key.

### Probar la IA real de Gemini en local

```bash
npm i -g vercel
vercel dev         # sirve el front + /api/triage
```

Necesitas una key gratuita de Google AI Studio (https://aistudio.google.com):
crea `.env` en la raíz con:

```
GEMINI_API_KEY=tu_key_aqui
# opcional: GEMINI_MODEL=gemini-2.0-flash
```

## Tests y build

```bash
npm run test       # Vitest — 10 pruebas del clasificador
npm run build      # typecheck (vue-tsc) + build de producción
```

## Deploy a Vercel

1. `vercel` (o conectar el repo en el dashboard).
2. En *Settings → Environment Variables* añade `GEMINI_API_KEY`.
3. Deploy. En producción la key vive solo en el servidor (nunca en el front);
   si la llamada falla, el front cae al clasificador local automáticamente.

## Estructura

```
api/triage.ts               Serverless: recibe mensaje → Gemini → JSON
src/services/triage.ts      Cliente: llama a /api/triage + fallback local
src/composables/useIncidents.ts   Estado + persistencia en localStorage
src/components/             TriageInput, TriageResult, IncidentBoard, KpiRow, SeverityBadge
src/types.ts                Tipos e etiquetas de incidencia
src/data/examples.ts        Mensajes de ejemplo para el demo
```
