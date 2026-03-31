import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import { GET as meHandler } from '@/app/api/auth/me/route';
import { createTestServer } from './utils/testServer';
import { prismaMock } from './setup';
import bcrypt from 'bcryptjs';
import * as jwtObject from 'jsonwebtoken';

jest.mock('@/lib/jwt', () => ({
  signJwt: jest.fn(() => 'mocked.jwt.token'),
  verifyJwt: jest.fn(() => ({ userId: 1, email: 'test@example.com', role: 'STUDENT' }))
}));

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('should success with valid email and password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'STUDENT',
        status: 'ACTIVE',
        sports: null,
        dob: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createTestServer(loginHandler)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBe('mocked.jwt.token');
    });

    it('should fail with wrong password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'STUDENT',
        status: 'ACTIVE',
        sports: null,
        dob: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createTestServer(loginHandler)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 2,
        email: 'new@example.com',
        password: 'hashedpassword',
        name: 'New User',
        role: 'STUDENT',
        status: 'ACTIVE',
        sports: null,
        dob: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createTestServer(registerHandler)
        .post('/api/auth/register')
        .send({ email: 'new@example.com', password: 'password123', name: 'New User' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should fail if email is duplicate', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'duplicate@example.com',
        password: 'hashedpassword',
        name: 'Existing User',
        role: 'STUDENT',
        status: 'ACTIVE',
        sports: null,
        dob: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createTestServer(registerHandler)
        .post('/api/auth/register')
        .send({ email: 'duplicate@example.com', password: 'password123', name: 'Existing User' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info with valid token', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: 'STUDENT',
        status: 'ACTIVE',
        sports: null,
        dob: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await createTestServer(meHandler)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid.token');

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('should fail with invalid token', async () => {
      const jwt = require('jsonwebtoken');
      // Temporarily mock jwt to throw error for invalid token
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error('Invalid token'); });

      // Assuming meHandler checks Authorization header and falls back or directly returns 401 when verifying fails.
      // Wait: actually @/lib/jwt might handle verification. I'll mock that instead.
      const libJwt = require('@/lib/jwt');
      libJwt.verifyJwt.mockReturnValueOnce(null);

      const res = await createTestServer(meHandler)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid token');
    });
  });
});
