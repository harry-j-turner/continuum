import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ThoughtEditor from './index';
import { Thought, Tag } from '../../types';

const mockOnUpdate = jest.fn();
const mockOnDelete = jest.fn();
const mockOnUpdateTags = jest.fn();

const thought: Thought = {
  id: '1',
  content: 'This is a test thought',
  created_at: '2021-01-01T00:00:00.000Z',
  tags: []
};

const allTags: Tag[] = [];

describe('ThoughtEditor', () => {
  it('displays the content of the provided thought', () => {
    render(
      <ThoughtEditor
        thought={thought}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onUpdateTags={mockOnUpdateTags}
        allTags={allTags}
        isDisabled={false}
      />
    );

    const contentSpan = screen.getByText('This is a test thought');
    expect(contentSpan).toBeInTheDocument();
    expect(contentSpan).toHaveClass('bp5-editable-text-content');
  });
});
