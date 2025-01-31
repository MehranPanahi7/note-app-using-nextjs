// lib/tokenMiddleware.ts

/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const secret = process.env.JWT_SECRET as string;
dotenv.config();

export function generateToken(
  user_id: number,
  username: string,
  email: string,
  role: string
) {
  return jwt.sign(
    {
      user: {
        user_id,
        username,
        email,
        role,
      },
    },
    secret,
    { expiresIn: "2h" }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hashPassword: string) {
  return bcrypt.compare(password, hashPassword);
}
