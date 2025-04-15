
import jwt from 'jsonwebtoken';

// This should be a secure random string in production
// In a real app, this should be stored in environment variables
export const JWT_SECRET = "AstraCodeArenaHQSecretKey2025";

export interface JWTPayload {
  userId: string;
  questionId: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};
