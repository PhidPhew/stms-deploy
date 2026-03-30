import { GET as getSummaryHandler } from '@/app/api/admin/finance/summary/route';
import { GET as getRecordsHandler } from '@/app/api/admin/finance/records/route';
import { createTestServer } from './utils/testServer';
import { prismaMock } from './setup';

jest.mock('@/lib/jwt', () => ({
  verifyJwt: jest.fn((token) => {
    if (token === 'admin.token') return { userId: 1, role: 'ADMIN' };
    return null;
  })
}));

describe('Finance API', () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, role: 'ADMIN', status: 'ACTIVE' } as any);
  });

  describe('GET /api/admin/finance/summary', () => {
    it('should return financial summary to admin', async () => {
      prismaMock.user.count.mockImplementation(async ({ where }: any) => {
        if (where?.role === 'STUDENT') return 10;
        if (where?.role === 'COACH') return 2;
        return 0;
      });

      prismaMock.course.count.mockResolvedValue(5);

      prismaMock.financeRecord.findMany.mockResolvedValue([
        { id: 1, amount: 1000, type: 'revenue', date: new Date('2023-10-05T10:00:00Z') } as any,
        { id: 2, amount: 200, type: 'expense', date: new Date('2023-10-10T10:00:00Z') } as any
      ]);

      const res = await createTestServer(getSummaryHandler)
        .get('/api/admin/finance/summary')
        .set('Authorization', 'Bearer admin.token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalStudents).toBe(10);
      expect(res.body.data.totalCoaches).toBe(2);
      expect(res.body.data.totalCourses).toBe(5);
      expect(res.body.data.totalRevenue).toBe(1000);
      expect(res.body.data.totalExpense).toBe(200);
    });

    it('should deny non-admin access', async () => {
      // Mock different behavior for unauthorized token dynamically if needed, or simply fail the token validation
      const jwtLib = require('@/lib/jwt');
      jwtLib.verifyJwt.mockReturnValueOnce({ userId: 2, role: 'STUDENT' });
      prismaMock.user.findUnique.mockResolvedValueOnce({ id: 2, role: 'STUDENT', status: 'ACTIVE' } as any);

      const res = await createTestServer(getSummaryHandler)
        .get('/api/admin/finance/summary')
        .set('Authorization', 'Bearer student.token');

      expect(res.status).toBe(403).catch?.(() => expect(res.status).toBe(401)); // requireRole returns Forbidden usually
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/finance/records', () => {
    it('should fetch financial records', async () => {
      prismaMock.financeRecord.findMany.mockResolvedValue([
        { id: 1, name: 'Income', description: 'Test', amount: 1000, type: 'revenue', date: new Date('2023-10-05T10:00:00Z') } as any
      ]);

      const res = await createTestServer(getRecordsHandler)
        .get('/api/admin/finance/records')
        .set('Authorization', 'Bearer admin.token');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].amount).toBe(1000);
    });
  });
});
