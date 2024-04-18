import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header, HeaderLink } from './index';
import { HomeIcon } from 'evergreen-ui';

// Mock data for links without sub-headings and some disabled
const mockLinks: HeaderLink[] = [
  { name: 'Home', icon: HomeIcon, onClick: jest.fn(), disabled: false },
  { name: 'About', icon: HomeIcon, onClick: jest.fn(), disabled: true }
];

describe('Header', () => {
  it('renders the enabled and disabled links correctly', () => {
    // Given - We have a header with two links, one enabled and one disabled
    render(<Header links={mockLinks} />);

    // Then - We expect to see both links and check their opacity for disabled state
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Home').closest('div')).toHaveStyle('opacity: 1');
    expect(screen.getByText('About').closest('div')).toHaveStyle('opacity: 0.5');
  });

  it('handles click event on the enabled link', () => {
    // Given - We have a header with an enabled and a disabled link
    render(<Header links={mockLinks} />);

    // When - We click on the 'Home' link
    fireEvent.click(screen.getByText('Home'));

    // Then - The onClick handler for 'Home' should be called
    expect(mockLinks[0].onClick).toHaveBeenCalled();
  });

  it('does not respond to clicks on the disabled link', () => {
    // Given - We have a header with a disabled link
    render(<Header links={mockLinks} />);

    // When - We click on the 'About' link
    fireEvent.click(screen.getByText('About'));

    // Then - The onClick handler for 'About' should not be called
    expect(mockLinks[1].onClick).not.toHaveBeenCalled();
  });
});
