import type { VercelRequest, VercelResponse } from '@vercel/node';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';
import { db } from '../db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const user = await db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const subscription = await db.subscriptions.findByUserId(user.id);

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      subscription
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}