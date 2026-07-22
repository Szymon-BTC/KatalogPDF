import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));

  // API Route for AI Catalog Assistant
  app.post("/api/catalog-ai", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Brak klucza GEMINI_API_KEY w konfiguracji serwera." });
      }

      const { prompt, catalogContext, currentPageText } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `Jesteś profesjonalnym Asystentem Katalogu i Magazynu Produktywnego. 
Twoim zadaniem jest odpowiadanie na pytania czytelnika odnośnie zawartości przeglądanego katalogu PDF.
Gdy odpowiadasz, bądź pomocny, zwięzły i elegancki. Odpowiadaj w języku polskim.
Kontekst katalogu ( fragmenty tekstu / podsumowanie ):
${catalogContext ? catalogContext.substring(0, 3000) : "Brak tekstu"}

Tekst z aktualnej strony:
${currentPageText ? currentPageText.substring(0, 1500) : "Brak tekstu z tej strony"}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nPytanie użytkownika: ${prompt}` }] }
        ]
      });

      res.json({ answer: response.text || "Nie udało się wygenerować odpowiedzi." });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: err?.message || "Błąd podczas komunikacji z AI." });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
