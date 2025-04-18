// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/server'; // or however your server Supabase client is setup
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key'; // use env variable in production

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { prn, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('prn', prn)
      .eq('password', password)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' });

    res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    }));

    return res.status(200).json({ user });

  } catch (err: any) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

  // Return basic user info
  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      prn: user.prn,
    },
  });
}

