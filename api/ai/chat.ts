// api/ai/chat.ts
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an AI co-founder assistant, helping entrepreneurs build and grow their startups. Provide strategic advice, answer questions, and help with planning.'
        },
        ...messages
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
    
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to process chat request' });
  }
}