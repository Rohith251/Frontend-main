import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgetPassword from '../ForgetPassword';

describe('ForgetPassword Component', () => {
  test('renders forgot password form', () => {
    render(
      <BrowserRouter>
        <ForgetPassword />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument();
  });
}); 