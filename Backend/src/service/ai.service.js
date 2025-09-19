import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function withRetry(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err; // last try → throw
      console.warn(`Gemini request failed. Retrying ${i + 1}/${retries}...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function generateResponse(contents, socket) {
  try {
    const result = await withRetry(() =>
      ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents,
      })
    );

    let finalResponse = "";

    for await (const chunk of result) {
      if (chunk.text) {
        socket.emit("aiResponseChunk", { content: chunk.text });
        process.stdout.write(chunk.text);
        finalResponse += chunk.text;
      }
    }

    return finalResponse;
  } catch (err) {
    console.error("❌ Gemini generateResponse failed:", err.message);
    socket.emit("aiResponseChunk", {
      content: "⚠️ AI service is busy. Please try again later.",
    });
    return "AI service unavailable";
  }
}

async function generateVectorResponse(contents) {
  try {
    const response = await withRetry(() =>
      ai.models.embedContent({
        model: "gemini-embedding-001",
        contents,
        config: {
          outputDimensionality: 768,
        },
      })
    );

    return response.embeddings[0].values;
  } catch (err) {
    console.error("❌ Gemini generateVectorResponse failed:", err.message);
    return [];
  }
}
export { generateResponse, generateVectorResponse }