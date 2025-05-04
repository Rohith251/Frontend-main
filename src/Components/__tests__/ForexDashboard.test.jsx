import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ForexDashboard from '../Userpage/ForexDashboard';
import instance from '../../axios';

// Mock axios instance
jest.mock('../../axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ForexDashboard Component', () => {
  const mockForexData = {
    cardNumber: '1234567890123456',
    expiryDate: '2025-12',
    cvv: '123',
    balance: 1000,
    maxLimit: 5000,
    status: 'Active',
  };

  const mockUserData = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case 'jwt':
          return 'mock-token';
        case 'id':
          return '123';
        default:
          return null;
      }
    });
    instance.get.mockImplementation((url) => {
      if (url.includes('/card/')) {
        return Promise.resolve({ data: mockForexData });
      }
      if (url.includes('/user/')) {
        return Promise.resolve({ data: mockUserData });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  // 1. Initial Rendering Tests
  test('renders loading spinner initially', () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders welcome message with user name after loading', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, John Doe/)).toBeInTheDocument();
    });
  });

  test('renders market update alert', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Market Update:/)).toBeInTheDocument();
      expect(screen.getByText(/RBI has revised forex card limits/)).toBeInTheDocument();
    });
  });

  // 2. Card Details Display Tests
  test('displays masked card number by default', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/•••• •••• •••• 3456/)).toBeInTheDocument();
    });
  });

  test('shows full card number when show details is clicked', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Show Details/));
      expect(screen.getByText('1234 5678 9012 3456')).toBeInTheDocument();
    });
  });

  test('displays masked CVV by default', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('•••')).toBeInTheDocument();
    });
  });

  // 3. Balance and Limits Tests
  test('displays formatted balance correctly', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('₹1,000.00')).toBeInTheDocument();
    });
  });

  test('displays formatted card limit correctly', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('₹5,000.00')).toBeInTheDocument();
    });
  });

  // 4. Card Status Tests
  test('displays active card status with correct badge color', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('bg-success');
    });
  });

  test('displays blocked status after blocking card', async () => {
    instance.post.mockResolvedValueOnce({ data: 'Card blocked successfully' });
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Block Card/));
    });
    
    fireEvent.click(screen.getByText(/Confirm Block/));
    
    await waitFor(() => {
      expect(screen.getByText('Blocked')).toBeInTheDocument();
    });
  });

  // 5. Notification Tests
  test('shows notification badge with correct count', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      const badge = screen.getByText('2');
      expect(badge).toHaveClass('badge');
      expect(badge).toHaveClass('bg-danger');
    });
  });

  test('displays notifications when bell icon is clicked', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
      expect(screen.getByText('Forex Rate Change')).toBeInTheDocument();
      expect(screen.getByText('Security Update')).toBeInTheDocument();
    });
  });

  test('marks notification as read when clicked', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
      fireEvent.click(screen.getByText('Forex Rate Change'));
      const notificationItem = screen.getByText('Forex Rate Change').closest('.notification-item');
      expect(notificationItem).not.toHaveClass('unread');
    });
  });

  // 6. Card Flip Animation Tests
  test('flips card when clicked', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      const card = screen.getByText(/META FOREXCARD/).closest('.card-container');
      fireEvent.click(card);
      expect(card).toHaveClass('flipped');
    });
  });

  // 7. Error Handling Tests
  test('handles card data fetch error gracefully', async () => {
    instance.get.mockRejectedValueOnce(new Error('Failed to fetch card data'));
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
    });
  });

  test('handles block card error gracefully', async () => {
    instance.post.mockRejectedValueOnce(new Error('Failed to block card'));
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Block Card/));
    });
    
    fireEvent.click(screen.getByText(/Confirm Block/));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to block card')).toBeInTheDocument();
    });
  });

  // 8. Modal Tests
  test('opens block card confirmation modal', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Block Card/));
      expect(screen.getByText(/Block Card Confirmation/)).toBeInTheDocument();
    });
  });

  test('closes block card modal when cancel is clicked', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Block Card/));
      fireEvent.click(screen.getByText(/Cancel/));
      expect(screen.queryByText(/Block Card Confirmation/)).not.toBeInTheDocument();
    });
  });

  // 9. Quick Actions Tests
  test('toggles card details visibility', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      const toggleButton = screen.getByText(/Show Details/);
      fireEvent.click(toggleButton);
      expect(screen.getByText(/Hide Details/)).toBeInTheDocument();
    });
  });

  test('disables block card button when card is already blocked', async () => {
    instance.get.mockImplementationOnce((url) => {
      if (url.includes('/card/')) {
        return Promise.resolve({ data: { ...mockForexData, status: 'Blocked' } });
      }
      return Promise.resolve({ data: mockUserData });
    });

    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      const blockButton = screen.getByText(/Block Card/);
      expect(blockButton).toBeDisabled();
    });
  });

  // 10. Authentication Tests
  test('redirects to login when token is missing', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  // 11. Component Updates Tests
  test('updates notification count when marking all as read', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
      fireEvent.click(screen.getByText(/Mark all read/));
      expect(screen.queryByText('2')).not.toBeInTheDocument();
    });
  });

  // 12. Loading State Tests
  test('shows loading spinner while blocking card', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      fireEvent.click(screen.getByText(/Block Card/));
    });
    
    fireEvent.click(screen.getByText(/Confirm Block/));
    
    expect(screen.getByText(/Blocking/)).toBeInTheDocument();
  });

  // 13. External Link Tests
  test('renders RBI link with correct attributes', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      const link = screen.getByText(/View details/);
      expect(link).toHaveAttribute('href', 'https://www.rbi.org.in/Home.aspx');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  // 14. Card Information Tests
  test('displays bank name correctly', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Meta ForexCard')).toBeInTheDocument();
    });
  });

  test('displays card type correctly', async () => {
    render(
      <BrowserRouter>
        <ForexDashboard />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('VISA PLATINUM')).toBeInTheDocument();
    });
  });
}); 