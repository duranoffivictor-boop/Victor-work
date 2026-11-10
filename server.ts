import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// API endpoint for AI Writing Assistant
app.post('/api/ai', async (req, res) => {
  try {
    const { action, text, prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'API key not configured on server.',
        fallback: true
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    let systemInstruction = 'Eres un asistente editorial y de redacción profesional integrado en un procesador de textos similar a Microsoft Word. Tu tarea es ayudar al usuario a redactar, corregir, pulir o transformar su texto manteniendo coherencia, formato y calidad profesional en español.';
    let userPrompt = '';

    switch (action) {
      case 'grammar':
        userPrompt = `Revisa y corrige la ortografía, acentuación, puntuación y gramática del siguiente texto. Devuelve ÚNICAMENTE el texto corregido, sin explicaciones ni saludos:\n\n${text}`;
        break;
      case 'improve':
        userPrompt = `Mejora la redacción, claridad, fluidez y tono profesional del siguiente texto. Conserva el significado original pero hazlo más elegante y persuasivo. Devuelve ÚNICAMENTE el texto mejorado:\n\n${text}`;
        break;
      case 'summarize':
        userPrompt = `Resume de manera concisa y clara los puntos principales del siguiente texto. Utiliza viñetas o párrafos breves según convenga:\n\n${text}`;
        break;
      case 'expand':
        userPrompt = `Expande el siguiente texto agregando detalles relevantes, ejemplos o explicaciones más profundas manteniendo un tono profesional:\n\n${text}`;
        break;
      case 'translate_en':
        userPrompt = `Traduce el siguiente texto fielmente al idioma inglés:\n\n${text}`;
        break;
      case 'translate_es':
        userPrompt = `Traduce el siguiente texto fielmente al idioma español:\n\n${text}`;
        break;
      case 'custom':
      default:
        userPrompt = `Instrucción del usuario: ${prompt}\n\nTexto base:\n${text}`;
        break;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    const resultText = response.text || '';
    return res.json({ result: resultText });
  } catch (err: any) {
    console.error('Error in /api/ai:', err);
    return res.status(500).json({ error: err.message || 'Error processing AI request' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VICTOR WORK DOCUMENTATION Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
