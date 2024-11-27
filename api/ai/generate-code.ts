// api/ai/generate-code.ts
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
    const { template, specifications, technology, features } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert software developer. Generate production-ready, well-documented code based on the provided specifications. 
          Include error handling, best practices, and comments explaining key functionality.`
        },
        {
          role: 'user',
          content: `Generate code for a ${template} with the following:
          Tech Stack: ${technology}
          Features: ${JSON.stringify(features)}
          Specifications: ${JSON.stringify(specifications)}
          
          Provide:
          1. Main implementation code
          2. Required dependencies
          3. Setup instructions
          4. API documentation (if applicable)
          5. Testing guidelines`
        }
      ],
      temperature: 0.2,
      max_tokens: 4000
    });

    return res.status(200).json({
      code: completion.choices[0].message.content,
      template,
      technology
    });
    
  } catch (error) {
    console.error('Code generation error:', error);
    return res.status(500).json({ error: 'Failed to generate code' });
  }
}