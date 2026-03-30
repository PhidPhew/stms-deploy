import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UsersPage from '@/app/(protected)/admin/users/page';
import axios from '@/lib/axios';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

jest.mock('@/lib/axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  post: jest.fn(),
}));

describe('Admin Dashboard - Users Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially and then data table after fetch', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'STUDENT', status: 'ACTIVE' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'COACH', status: 'ACTIVE' },
    ];

    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: mockUsers, success: true },
    });

    render(<UsersPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/admin/users');
    });

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<UsersPage />);

    expect(await screen.findByText('Failed to load users')).toBeInTheDocument();
  });
});
