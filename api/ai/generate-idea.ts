// api/ai/generate-idea.ts
import OpenAI from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Set a longer timeout
export const config = {
  maxDuration: 300 // 5 minutes in seconds
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the request body
    let { industry, targetMarket, technology, problemSpace } = 
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a startup idea generator that creates innovative, market-viable business concepts. Format your response as detailed JSON.'
        },
        {
          role: 'user',
          content: `Generate a detailed startup idea with the following parameters:
          Industry: ${industry}
          Target Market: ${targetMarket}
          Technology: ${technology}
          Problem Space: ${problemSpace}
          
          Include: 
          - Startup name
          - One-line pitch
          - Detailed description
          - Key features (as array)
          - Target audience
          - Revenue model
          - Potential challenges
          - Growth strategy`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    // Send the response
    return res.status(200).json(JSON.parse(completion.choices[0].message.content));
    
  } catch (error: any) {
    console.error('Idea generation error:', error);
    
    // Handle specific types of errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      return res.status(504).json({ 
        error: 'Request timed out. Please try again.' 
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.' 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to generate idea',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}