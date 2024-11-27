// api/ai/generate-idea.ts
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
    const { industry, targetMarket, technology, problemSpace } = req.body;

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
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    return res.status(200).json(JSON.parse(completion.choices[0].message.content));
    
  } catch (error) {
    console.error('Idea generation error:', error);
    return res.status(500).json({ error: 'Failed to generate idea' });
  }
}