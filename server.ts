/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { GoogleGenAI, Type } from "@google/genai";
import { CADDesign, AnalysisResult } from './src/shared/types.ts';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

app.post('/api/analyze', async (req, res) => {
  const design: CADDesign = req.body;

  if (!design || !design.elements || design.elements.length === 0) {
    return res.status(400).json({ error: 'Invalid design data' });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this CAD design for structural integrity and aesthetics. Provide a score (0-100), a summary, and 3-5 specific fix suggestions.
      
      Design Name: ${design.name}
      Elements: ${JSON.stringify(design.elements)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            structuralIntegrity: { 
              type: Type.STRING,
              enum: ["Low", "Medium", "High"]
            },
            aestheticRating: { type: Type.NUMBER }
          },
          required: ["score", "summary", "suggestions", "structuralIntegrity", "aestheticRating"]
        }
      }
    });

    const result: AnalysisResult = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze design' });
  }
});

async function startServer() {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
