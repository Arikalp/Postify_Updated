import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'Arikalp';

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
