import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

describe('Layout', () => {
    test('renders Header component with "Application Title" text', () => {
        render(<Header />);
        expect(screen.getByText(/Application Title/i)).toBeInTheDocument();
    });

    test('renders Footer component with "Copyright 2026" text', () => {
        render(<Footer />);
        expect(screen.getByText(/Copyright 2026/i)).toBeInTheDocument();
    });

    test('renders Sidebar component with "Link 1" text', () => {
        render(<Sidebar />);
        expect(screen.getByText(/Link 1/i)).toBeInTheDocument();
    });
});
