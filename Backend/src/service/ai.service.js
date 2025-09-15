import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function generateResponse(contents, socket) {
  const result = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: contents,
  });

  let finalResponse = "";

  for await (const chunk of result) {
    if (chunk.text) {
      socket.emit("aiResponseChunk", { content: chunk.text });
      process.stdout.write(chunk.text); 
      finalResponse += chunk.text;
    }
  }

  return finalResponse;
}


async function generateVectorResponse(contents) {

  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: contents,
    config: {
      outputDimensionality: 768,
    }

  });
  return response.embeddings[0].values;

}
export { generateResponse, generateVectorResponse }