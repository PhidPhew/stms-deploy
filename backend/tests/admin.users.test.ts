import { GET as getUsersHandler, POST as createUserHandler } from '@/app/api/admin/users/route';
import { PUT as updateUserHandler, DELETE as deleteUserHandler } from '@/app/api/admin/users/[id]/route';
import { createTestServer } from './utils/testServer';
import { prismaMock } from './setup';
import bcrypt from 'bcryptjs';

jest.mock('@/lib/jwt', () => ({
  verifyJwt: jest.fn((token) => {
    if (token === 'admin.token') return { userId: 1, role: 'ADMIN' };
    if (token === 'student.token') return { userId: 2, role: 'STUDENT' };
    return null;
  })
}));

jest.mock('@/lib/auditLog', () => ({
  createLog: jest.fn().mockResolvedValue(true)
}));

describe('Admin Users API', () => {
  beforeEach(() => {
    // Mock requireRole inner fetching
    prismaMock.user.findUnique.mockImplementation(async ({ where }: any) => {
      if (where.id === 1) return { id: 1, role: 'ADMIN', status: 'ACTIVE' } as any;
      if (where.id === 2) return { id: 2, role: 'STUDENT', status: 'ACTIVE' } as any;
      return null;
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return users for admin', async () => {
      prismaMock.user.findMany.mockResolvedValue([
        { id: 2, name: 'Student', email: 's@test.com', role: 'STUDENT', status: 'ACTIVE', createdAt: new Date() } as any
      ]);

      const res = await createTestServer(getUsersHandler)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer admin.token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    it('should deny access for non-admin', async () => {
      const res = await createTestServer(getUsersHandler)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer student.token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/admin/users', () => {
    it('should create user', async () => {
      prismaMock.user.create.mockResolvedValue({
        id: 3,
        name: 'New User',
        email: 'new@test.com',
        role: 'COACH',
        status: 'ACTIVE'
      } as any);

      const res = await createTestServer(createUserHandler)
        .post('/api/admin/users')
        .set('Authorization', 'Bearer admin.token')
        .send({ name: 'New User', email: 'new@test.com', role: 'COACH' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('new@test.com');
    });
  });

  describe('PUT /api/admin/users/:id', () => {
    it('should update user', async () => {
      // Overriding the default mock for findUnique
      prismaMock.user.findUnique.mockImplementation(async ({ where }: any) => {
        if (where.id === 1) return { id: 1, role: 'ADMIN', status: 'ACTIVE' } as any;
        if (where.id === 3) return { id: 3, role: 'COACH', status: 'ACTIVE' } as any;
        return null;
      });

      prismaMock.user.update.mockResolvedValue({
        id: 3, name: 'Updated', email: 'updated@test.com', role: 'COACH', status: 'ACTIVE'
      } as any);

      const res = await createTestServer(updateUserHandler, { id: '3' })
        .put('/api/admin/users/3')
        .set('Authorization', 'Bearer admin.token')
        .send({ name: 'Updated' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated');
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('should suspend user', async () => {
      prismaMock.user.findUnique.mockImplementation(async ({ where }: any) => {
        if (where.id === 1) return { id: 1, role: 'ADMIN', status: 'ACTIVE' } as any;
        if (where.id === 3) return { id: 3, role: 'COACH', status: 'ACTIVE' } as any;
        return null;
      });

      prismaMock.user.update.mockResolvedValue({
        id: 3, name: 'Sus', email: 'sus@test.com', status: 'SUSPENDED'
      } as any);

      const res = await createTestServer(deleteUserHandler, { id: '3' })
        .delete('/api/admin/users/3')
        .set('Authorization', 'Bearer admin.token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('SUSPENDED');
    });
  });
});
