// api/ai/chat.ts
import OpenAI from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { messages } = await req.json();

    const stream = await openai.chat.completions.create({
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

    // Stream the responses
    for await (const part of stream) {
      const chunk = part.choices[0]?.delta?.content || '';
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    res.end();
    
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    if (error.response) {
      res.status(error.response.status).json({ 
        error: error.response.data?.error?.message || 'OpenAI API error'
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}