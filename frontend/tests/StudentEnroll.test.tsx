import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SubmitPaymentPage from '@/app/student/payment/submit/page';
import axios from '@/lib/axios';
import { useSearchParams } from 'next/navigation';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return { push: mockPush };
  },
  useSearchParams: jest.fn(),
}));

jest.mock('@/lib/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('Student Enroll (Submit Payment)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === 'courseId' ? '1' : null),
    });
  });

  it('handles enrollment and payment submission successfully', async () => {
    // Mock initial fetch
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: [] }, // No existing payment
    });

    render(<SubmitPaymentPage />);

    // Wait for initial render
    await screen.findByText('Submit Payment');

    // Mock API responses for submission
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Enrolled successfully!' },
    }); // 1. Enroll API
    
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { data: [{ id: 10, courseId: 1, amount: 100, course: 'Test Course' }] },
    }); // 2. Get payment created by enroll
    
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Payment slip submitted successfully' },
    }); // 3. Upload slip API

    // Fill form
    const tfRefInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(tfRefInput, { target: { value: 'TX123' } });

    // Mock file upload
    const file = new File(['dummy content'], 'slip.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Upload Payment Slip/i) || document.querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Submit Payment/i });
    fireEvent.click(submitBtn);

    expect(submitBtn).toHaveTextContent(/Submitting/i);

    await waitFor(() => {
      expect(axios.post).toHaveBeenNthCalledWith(1, '/api/student/courses/1/enroll');
      expect(mockPush).toHaveBeenCalledWith('/student/payment?success=true');
    });
  });
});
