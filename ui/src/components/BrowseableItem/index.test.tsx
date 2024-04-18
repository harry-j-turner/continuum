import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BrowseableItem from './index';
import { Entry } from '../../types';

// Given - Mock data for the tests
const mockEntry: Entry = {
  id: '1',
  date: '2023-04-01T12:00:00Z',
  thoughts: [
    {
      id: '1',
      entry: '1',
      tags: [],
      mood: 3,
      actions: '',
      content:
        'A long thought that is definitely over sixty-four characters needs to be truncated to fit within the bounds.'
    }
  ]
};

describe('BrowseableItem', () => {
  it('renders without crashing', () => {
    // When - We render the component
    render(<BrowseableItem entry={mockEntry} selected={false} onSelect={jest.fn()} />);

    // Then - The expected text is displayed
    expect(screen.getByText('Sat Apr 01 2023')).toBeInTheDocument();
    expect(screen.getByText('A long thought that is definitely over sixty-four characters nee...')).toBeInTheDocument();
  });

  it('has correct opacity when not selected', () => {
    // Given - Setup the initial render with selected=false
    render(<BrowseableItem entry={mockEntry} selected={false} onSelect={jest.fn()} />);

    // Then - Check initial opacity for not selected
    expect(screen.getByTestId('browseable-item')).toHaveStyle('opacity: 0.5');

    // When - The item is hovered over
    fireEvent.mouseEnter(screen.getByTestId('browseable-item'));

    // Then - Check opacity for hovered
    expect(screen.getByTestId('browseable-item')).toHaveStyle('opacity: 0.6');

    // When - The mouse leaves the item
    fireEvent.mouseLeave(screen.getByTestId('browseable-item'));

    // Then - Check opacity returns to normal when not hovered
    expect(screen.getByTestId('browseable-item')).toHaveStyle('opacity: 0.5');
  });

  it('has correct opacity when selected', () => {
    // Given - Setup the initial render with selected=true
    render(<BrowseableItem entry={mockEntry} selected={true} onSelect={jest.fn()} />);

    // Then - Check initial opacity for selected
    expect(screen.getByTestId('browseable-item')).toHaveStyle('opacity: 0.8');
  });

  it('calls onSelect when the item is clicked', () => {
    // Given - A mock onSelect function
    const onSelectMock = jest.fn();

    // When - We render the component and click on it
    render(<BrowseableItem entry={mockEntry} selected={false} onSelect={onSelectMock} />);
    fireEvent.click(screen.getByTestId('browseable-item'));

    // Then - onSelect is called with the correct argument
    expect(onSelectMock).toHaveBeenCalledWith('1');
  });
});
