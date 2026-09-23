/// <reference types="node" />
// Función serverless de Vercel: recibe un mensaje y lo triaje con Gemini.
// La API key vive SOLO aquí (process.env), nunca en el front.
// Si no hay key configurada, responde 501 y el front cae a su clasificador local.

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash'

const SYSTEM = `Eres un asistente de operaciones de una empresa de transporte de mercancías (TMS).
Recibes un mensaje informal de un conductor o cliente y lo conviertes en una incidencia estructurada.
Responde SIEMPRE en español y SOLO con el JSON pedido, sin texto adicional.
- tipo: uno de "retraso", "averia", "direccion_erronea", "cliente_ausente", "mercancia_danada", "otro".
- gravedad: "baja", "media", "alta" o "critica" (accidentes/heridos/vía cortada = critica).
- envioId: el identificador del envío si aparece (formato "#1234"), o null.
- resumen: una frase corta y neutra de la incidencia.
- accionSugerida: la siguiente acción concreta que debería tomar el operador.
- confianza: número entre 0 y 1 con tu seguridad en la clasificación.`

const schema = {
  type: 'object',
  properties: {
    tipo: { type: 'string', enum: ['retraso', 'averia', 'direccion_erronea', 'cliente_ausente', 'mercancia_danada', 'otro'] },
    gravedad: { type: 'string', enum: ['baja', 'media', 'alta', 'critica'] },
    envioId: { type: 'string', nullable: true },
    resumen: { type: 'string' },
    accionSugerida: { type: 'string' },
    confianza: { type: 'number' },
  },
  required: ['tipo', 'gravedad', 'resumen', 'accionSugerida', 'confianza'],
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' })
    return
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    // Sin key → el front usará su clasificador local.
    res.status(501).json({ error: 'GEMINI_API_KEY no configurada' })
    return
  }

  const mensaje = typeof req.body === 'string' ? JSON.parse(req.body).mensaje : req.body?.mensaje
  if (!mensaje || typeof mensaje !== 'string') {
    res.status(400).json({ error: 'Falta el campo "mensaje"' })
    return
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`
    const gRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: mensaje }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.2,
        },
      }),
    })

    if (!gRes.ok) {
      const detail = await gRes.text()
      res.status(502).json({ error: 'Error de Gemini', detail })
      return
    }

    const data = await gRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    const parsed = JSON.parse(text)
    res.status(200).json(parsed)
  } catch (err: any) {
    res.status(500).json({ error: 'Fallo al procesar', detail: String(err?.message ?? err) })
  }
}
