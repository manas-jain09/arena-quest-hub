
// We're using a simplified approach for browser compatibility
// Instead of jsonwebtoken which requires Node.js buffer

export interface JWTPayload {
  userId: string;
  questionId: string;
}

// This should be a secure random string in production
// In a real app, this should be stored in environment variables
export const JWT_SECRET = "AstraCodeArenaHQSecretKey2025";

// Simple function to base64 encode a string
const base64Encode = (str: string): string => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
};

// Simple function to create a JWT token manually
export const generateToken = (payload: JWTPayload): string => {
  // Create JWT header (always the same for this simple implementation)
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  // Add an expiration time (1 hour from now)
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60; // 1 hour in seconds
  
  // Create JWT payload with expiration
  const jwtPayload = {
    ...payload,
    exp: now + expiresIn,
    iat: now
  };
  
  // Encode header and payload
  const encodedHeader = base64Encode(JSON.stringify(header));
  const encodedPayload = base64Encode(JSON.stringify(jwtPayload));
  
  // Create the base string for signature
  const baseString = `${encodedHeader}.${encodedPayload}`;
  
  // In a full implementation, we would sign this with a crypto library
  // Since we're just passing this to our own backend that knows the secret,
  // we'll use a simplified approach for demo purposes
  // NOTE: In production, you should use a proper JWT library on the server side
  
  // Create a simple "signature" by encoding the baseString + secret
  // This is NOT cryptographically secure but serves our purpose for the demo
  const signature = base64Encode(baseString + JWT_SECRET);
  
  // Return the complete JWT token
  return `${baseString}.${signature}`;
};
