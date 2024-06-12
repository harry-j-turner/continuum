import React, { useState, useCallback, useEffect } from 'react';

import { EditableText } from '@blueprintjs/core';
import { Tag, Thought } from '../../types';
import { Button, Pane, TrashIcon } from 'evergreen-ui';
import TagBar from '../TagBar';

interface ThoughtEditorProps {
  thought: Thought;
  onUpdate: (thought: Thought) => void;
  onDelete: (thought: Thought) => void;
  onUpdateTags: (tags: Tag[]) => void;
  allTags: Tag[];
  isDisabled: boolean;
}

const ThoughtEditor: React.FC<ThoughtEditorProps> = ({
  thought,
  onUpdate,
  onDelete,
  onUpdateTags,
  allTags,
  isDisabled
}) => {
  const [content, setContent] = useState<string>(thought.content);

  useEffect(() => {
    setContent(thought.content);
  }, [thought]);

  const handleChangeContent = useCallback(
    (content: string) => {
      onUpdate({ ...thought, content, tags: thought.tags });
    },
    [thought]
  );

  const onChangeTags = useCallback(
    (tags: string[]) => {
      onUpdate({ ...thought, content, tags });
    },
    [onUpdate, content]
  );

  return (
    <Pane
      width="100%"
      key={thought.id}
      marginBottom={16}
      backgroundColor="rgba(255, 255, 255, 0.7)"
      padding={16}
      borderRadius={4}
    >
      <Pane display="flex" justifyContent="space-between" marginBottom={16}>
        <TagBar tags={thought.tags} onSave={onChangeTags} updateTags={onUpdateTags} allTags={allTags} />
        {window.innerWidth > 800 && (
          <Button appearance="minimal" onClick={() => onDelete(thought)} iconBefore={TrashIcon} disabled={isDisabled}>
            Delete
          </Button>
        )}
      </Pane>
      <EditableText
        disabled={isDisabled}
        multiline={true}
        value={content}
        onConfirm={handleChangeContent}
        onChange={(content: string) => setContent(content)}
        className="thought-editor-editable-text"
      />
    </Pane>
  );
};

export default ThoughtEditor;
