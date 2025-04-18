// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/server'; // or however your server Supabase client is setup
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key'; // use env variable in production

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prn, password } = req.body;

  if (!prn || !password) {
    return res.status(400).json({ message: 'PRN and password are required' });
  }

  // Check user credentials in Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, email, prn, password') // get password for validation
    .eq('prn', prn)
    .eq('password', password) // In production, hash + compare
    .single();

  if (error || !user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, prn: user.prn },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Set JWT in HTTP-only cookie (accessible across *.arenahq-mitwpu.in)
  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    domain: '.arenahq-mitwpu.in',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  }));

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

