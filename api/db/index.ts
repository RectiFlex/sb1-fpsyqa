import { sql } from '@vercel/postgres';
import { z } from 'zod';

export const db = {
  users: {
    create: async (data: { email: string; name: string; passwordHash: string }) => {
      const result = await sql`
        INSERT INTO users (email, name, password_hash)
        VALUES (${data.email}, ${data.name}, ${data.passwordHash})
        RETURNING id, email, name, created_at;
      `;
      return result.rows[0];
    },
    findByEmail: async (email: string) => {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email};
      `;
      return result.rows[0];
    }
  },
  ideas: {
    create: async (data: { userId: string; title: string; description: string; keyFeatures: string[]; targetAudience: string; revenueModel: string }) => {
      const result = await sql`
        INSERT INTO ideas (user_id, title, description, key_features, target_audience, revenue_model)
        VALUES (${data.userId}, ${data.title}, ${data.description}, ${JSON.stringify(data.keyFeatures)}, ${data.targetAudience}, ${data.revenueModel})
        RETURNING *;
      `;
      return result.rows[0];
    },
    findByUserId: async (userId: string) => {
      const result = await sql`
        SELECT * FROM ideas WHERE user_id = ${userId} ORDER BY created_at DESC;
      `;
      return result.rows;
    }
  },
  documents: {
    create: async (data: { userId: string; type: string; title: string; content: any }) => {
      const result = await sql`
        INSERT INTO documents (user_id, type, title, content)
        VALUES (${data.userId}, ${data.type}, ${data.title}, ${JSON.stringify(data.content)})
        RETURNING *;
      `;
      return result.rows[0];
    },
    findByUserId: async (userId: string) => {
      const result = await sql`
        SELECT * FROM documents WHERE user_id = ${userId} ORDER BY created_at DESC;
      `;
      return result.rows;
    }
  },
  subscriptions: {
    create: async (data: { userId: string; plan: string; status: string; expiresAt: Date }) => {
      const result = await sql`
        INSERT INTO subscriptions (user_id, plan, status, expires_at)
        VALUES (${data.userId}, ${data.plan}, ${data.status}, ${data.expiresAt})
        RETURNING *;
      `;
      return result.rows[0];
    },
    findByUserId: async (userId: string) => {
      const result = await sql`
        SELECT * FROM subscriptions 
        WHERE user_id = ${userId} 
        AND status = 'active' 
        AND expires_at > NOW()
        ORDER BY created_at DESC 
        LIMIT 1;
      `;
      return result.rows[0];
    }
  }
};