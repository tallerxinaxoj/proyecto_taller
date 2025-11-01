import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface JwtPayload {
  id: number;
  role: 'ADMIN' | 'MECANICO';
  name: string;
  email: string;
}

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' });

export const verifyToken = (token: string) =>
  jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

