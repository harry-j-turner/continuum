import React, { useState, useCallback, useEffect } from 'react';

import { debounce } from 'lodash';
import { EditableText } from '@blueprintjs/core';
import { Tag, Thought } from '../../types';
import { Button, Pane, TrashIcon } from 'evergreen-ui';
import TagBar from '../TagBar';

interface ThoughtEditorProps {
  thought: Thought;
  onUpdate: (thought: Thought) => void;
  onDelete: (thought: Thought) => void;
  updateTags: (tags: Tag[]) => void;
  allTags: Tag[];
}

const ThoughtEditor: React.FC<ThoughtEditorProps> = ({ thought, onUpdate, onDelete, updateTags, allTags }) => {
  const [content, setContent] = useState<string>(thought.content);

  useEffect(() => {
    setContent(thought.content);
  }, [thought]);

  const debouncedSave = useCallback(
    debounce(({ content, tags }: { content: string; tags: string[] }) => {
      onUpdate({ ...thought, content, tags });
    }, 500),
    [onUpdate]
  ); // Adjust debounce time (in ms) as needed

  const handleChangeContent = useCallback(
    (content: string) => {
      setContent(content);
      debouncedSave({ content, tags: thought.tags });
    },
    [debouncedSave, thought]
  );

  const onChangeTags = useCallback(
    (tags: string[]) => {
      onUpdate({ ...thought, content, tags });
    },
    [onUpdate, content]
  );

  return (
    <Pane key={thought.id} marginBottom={16} backgroundColor="rgba(255, 255, 255, 0.5)" padding={16} borderRadius={4}>
      <Pane display="flex" justifyContent="space-between" marginBottom={16}>
        <TagBar tags={thought.tags} onSave={onChangeTags} updateTags={updateTags} allTags={allTags} />
        <Button appearance="minimal" onClick={() => onDelete(thought)} iconBefore={TrashIcon}>
          Delete
        </Button>
      </Pane>
      <EditableText
        multiline={true}
        value={content}
        onChange={handleChangeContent}
        className="thought-editor-editable-text"
      />
    </Pane>
  );
};

export default ThoughtEditor;
