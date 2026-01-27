import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

test('renders header with title', () => {
  render(<Header />);
  const linkElement = screen.getByText(/Application Title/i);
  expect(linkElement).toBeInTheDocument();
});
