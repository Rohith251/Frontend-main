import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ActivateCard from '../Userpage/ActivateCard';

describe('ActivateCard Component', () => {
  test('renders activation form', () => {
    render(
      <BrowserRouter>
        <ActivateCard />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText('4444 5555 6666 7777')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter 4-digit PIN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /activate card/i })).toBeInTheDocument();
  });
}); 