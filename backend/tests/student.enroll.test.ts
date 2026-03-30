import { POST as enrollHandler } from '@/app/api/student/courses/[id]/enroll/route';
import { createTestServer } from './utils/testServer';
import { prismaMock } from './setup';

jest.mock('@/lib/jwt', () => ({
  verifyJwt: jest.fn((token) => {
    if (token === 'student.token') return { userId: 2, role: 'STUDENT' };
    return null;
  })
}));

jest.mock('@/lib/auditLog', () => ({
  createLog: jest.fn().mockResolvedValue(true)
}));

describe('Student Enrollment API', () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 2, role: 'STUDENT', status: 'ACTIVE' } as any);
  });

  describe('POST /api/student/courses/:id/enroll', () => {
    it('should successfully enroll student', async () => {
      prismaMock.course.findUnique.mockResolvedValue({
        id: 1, title: 'Test Course', price: 100
      } as any);

      prismaMock.enrollment.create.mockResolvedValue({
        id: 1, studentId: 2, courseId: 1
      } as any);

      prismaMock.payment.create.mockResolvedValue({
        id: 1, studentId: 2, courseId: 1, amount: 100, status: 'PENDING'
      } as any);

      const res = await createTestServer(enrollHandler, { id: '1' })
        .post('/api/student/courses/1/enroll')
        .set('Authorization', 'Bearer student.token');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(prismaMock.enrollment.create).toHaveBeenCalled();
      expect(prismaMock.payment.create).toHaveBeenCalled();
    });

    it('should fail if course is invalid', async () => {
      prismaMock.course.findUnique.mockResolvedValue(null);

      const res = await createTestServer(enrollHandler, { id: '99' })
        .post('/api/student/courses/99/enroll')
        .set('Authorization', 'Bearer student.token');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Course not found');
    });

    it('should handle already enrolled (Prisma P2002 error)', async () => {
      prismaMock.course.findUnique.mockResolvedValue({ id: 1, price: 100 } as any);
      
      const error: any = new Error();
      error.code = 'P2002';
      prismaMock.enrollment.create.mockRejectedValue(error);

      const res = await createTestServer(enrollHandler, { id: '1' })
        .post('/api/student/courses/1/enroll')
        .set('Authorization', 'Bearer student.token');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Already enrolled in this course');
    });
  });
});
