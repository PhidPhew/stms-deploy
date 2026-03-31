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
    URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    class MockFileReader {
      result: string | ArrayBuffer | null = 'data:image/png;base64,mock';
      onload: null | ((this: FileReader, ev: ProgressEvent<FileReader>) => any) = null;
      onerror: null | ((this: FileReader, ev: ProgressEvent<FileReader>) => any) = null;
      readAsDataURL() {
        if (this.onload) {
          this.onload.call(this as unknown as FileReader, {} as ProgressEvent<FileReader>);
        }
      }
    }
    (global as any).FileReader = MockFileReader;
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => (key === 'courseId' ? '1' : null),
    });
  });

  it('handles enrollment and payment submission successfully', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: { data: [{ id: 10, courseId: 1, amount: 100, course: 'Test Course' }] },
    });

    render(<SubmitPaymentPage />);

    // Wait for initial render
    await screen.findByRole('heading', { name: 'Submit Payment' });

    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Payment slip submitted successfully' },
    });

    // Fill form
    const tfRefInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(tfRefInput, { target: { value: 'TX123' } });

    // Mock file upload
    const file = new File(['dummy content'], 'slip.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Submit Payment/i });
    fireEvent.submit(submitBtn.closest('form') as HTMLFormElement);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/student/payments', expect.objectContaining({
        paymentId: 10,
        txRef: 'TX123',
      }));
      expect(mockPush).toHaveBeenCalledWith('/student/payment?success=true');
    });
  });
});
