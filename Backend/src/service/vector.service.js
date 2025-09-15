import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
})

const index = pc.Index("chatgpt")
export async function createMemory( payload){
 
  await index.upsert([
    {
      id : payload.id,
      values : payload.values,
      metadata : {
        chat : payload.metadata.chat,
        user : payload.metadata.user,
        text : payload.metadata.text,
      }
    }
  ])
}

export async function queryMemory({queryVector, limit = 5, metadata}){
  const data = await index.query({
    vector : queryVector,
    topK : limit,
    filter : metadata ? {metadata} : undefined,
    includeMetadata: true,
  })

  return data.matches
}