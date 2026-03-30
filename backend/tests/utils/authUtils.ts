import jwt from 'jsonwebtoken';

export const getAuthToken = (role: string = 'STUDENT', id: number = 100) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
};
