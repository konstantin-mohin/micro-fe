import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';

test('renders sidebar with placeholder navigation links', () => {
  render(<Sidebar />);
  const link1 = screen.getByText(/Link 1/i);
  const link2 = screen.getByText(/Link 2/i);
  const link3 = screen.getByText(/Link 3/i);
  expect(link1).toBeInTheDocument();
  expect(link2).toBeInTheDocument();
  expect(link3).toBeInTheDocument();
});
