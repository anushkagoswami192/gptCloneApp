import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index("chatgpt"); // ✅ lowercase index

// Helper: retry wrapper
async function withRetry(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Pinecone request failed. Retrying ${i + 1}/${retries}...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

// Save memory
export async function createMemory(payload) {
  try {
    await withRetry(() =>
      index.upsert([
        {
          id: payload.id,
          values: payload.values,
          metadata: {
            chat: payload.metadata.chat,
            user: payload.metadata.user,
            text: payload.metadata.text,
          },
        },
      ])
    );
    console.log("✅ Memory saved:", payload.id);
  } catch (err) {
    console.error("❌ Failed to save memory:", err.message);
  }
}

// Query memory
export async function queryMemory({ queryVector, limit = 5, metadata }) {
  try {
    const filter = (metadata && Object.keys(metadata).length > 0) ? metadata : undefined;

    const data = await withRetry(() =>
      index.query({
        vector: queryVector,
        topK: limit,
        filter,
        includeMetadata: true,
      })
    );

    return data.matches || [];
  } catch (err) {
    console.error("❌ Query failed:", err.message);
    return [];
  }
}

