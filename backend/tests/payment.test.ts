import { POST as enrollHandler } from '@/app/api/student/courses/[id]/enroll/route';
import { POST as uploadSlipHandler } from '@/app/api/student/payments/route';
import { POST as approveHandler } from '@/app/api/admin/finance/payments/[id]/approve/route';
import { createTestServer } from './utils/testServer';
import { prismaMock } from './setup';

jest.mock('@/lib/jwt', () => ({
  verifyJwt: jest.fn((token) => {
    if (token === 'student.token') return { userId: 2, role: 'STUDENT' };
    if (token === 'admin.token') return { userId: 1, role: 'ADMIN' };
    return null;
  })
}));

const auditLogMock = jest.fn().mockResolvedValue(true);
jest.mock('@/lib/auditLog', () => ({
  createLog: auditLogMock
}));

describe('Payment Flow E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Auth Role
    prismaMock.user.findUnique.mockImplementation(async ({ where }: any) => {
      if (where.id === 1) return { id: 1, role: 'ADMIN', status: 'ACTIVE' } as any;
      if (where.id === 2) return { id: 2, role: 'STUDENT', status: 'ACTIVE', name: 'Test Student' } as any;
      return null;
    });

    // Mock Prisma Transaction
    (prismaMock.$transaction as any).mockImplementation(async (callback: any) => {
      return callback(prismaMock);
    });
  });

  it('should complete the full enrollment to payment approval flow', async () => {
    // 1. Student Enrollment
    prismaMock.course.findUnique.mockResolvedValue({ id: 1, title: 'Football', price: 100 } as any);
    prismaMock.enrollment.create.mockResolvedValue({ id: 1, studentId: 2, courseId: 1 } as any);
    prismaMock.payment.create.mockResolvedValue({ id: 10, studentId: 2, courseId: 1, amount: 100, status: 'PENDING' } as any);

    const enrollRes = await createTestServer(enrollHandler, { id: '1' })
      .post('/api/student/courses/1/enroll')
      .set('Authorization', 'Bearer student.token');
      
    expect(enrollRes.status).toBe(201);
    expect(auditLogMock).toHaveBeenCalledWith('CREATE', 'Enrollment', 1, 2, null, expect.any(Object), expect.any(String));

    // 2. Student Upload Slip
    prismaMock.payment.findUnique.mockResolvedValueOnce({ id: 10, studentId: 2, amount: 100, status: 'PENDING' } as any);
    prismaMock.payment.update.mockResolvedValueOnce({ id: 10, studentId: 2, amount: 100, slipUrl: 'http://slip.jpg', status: 'PENDING' } as any);

    const uploadRes = await createTestServer(uploadSlipHandler)
      .post('/api/student/payments')
      .set('Authorization', 'Bearer student.token')
      .send({ paymentId: '10', slipUrl: 'http://slip.jpg' });

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.data.slipUrl).toBe('http://slip.jpg');
    
    // 3. Admin Approve
    prismaMock.payment.findUnique.mockResolvedValueOnce({ 
      id: 10, studentId: 2, amount: 100, status: 'PENDING', 
      course: { title: 'Football' }, student: { name: 'Test Student' } 
    } as any);

    prismaMock.payment.update.mockResolvedValueOnce({ id: 10, status: 'APPROVED' } as any);
    prismaMock.financeRecord.create.mockResolvedValue({ id: 1, type: 'revenue' } as any);

    const approveRes = await createTestServer(approveHandler, { id: '10' })
      .post('/api/admin/finance/payments/10/approve')
      .set('Authorization', 'Bearer admin.token');

    expect(approveRes.status).toBe(200);
    expect(prismaMock.financeRecord.create).toHaveBeenCalledTimes(2); // One for Revenue, one for Auto-coach payout
    expect(auditLogMock).toHaveBeenCalledWith('APPROVE', 'Payment', 10, 1, expect.any(Object), expect.any(Object), expect.any(String));
  });
});
