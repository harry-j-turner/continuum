import React, { useState, useCallback, useEffect } from 'react';

import { EditableText } from '@blueprintjs/core';
import { Tag, Thought } from '../../types';
import { Button, Heading, Pane, Text, TrashIcon } from 'evergreen-ui';
import TagBar from '../TagBar';

interface ThoughtEditorProps {
  thought: Thought;
  onUpdate: (thought: Thought) => void;
  onClickDelete: () => void;
  onUpdateTags: (tags: Tag[]) => void;
  allTags: Tag[];
  isDisabled: boolean;
}

const ThoughtEditor: React.FC<ThoughtEditorProps> = ({
  thought,
  onUpdate,
  onClickDelete,
  onUpdateTags,
  allTags,
  isDisabled
}) => {
  const [content, setContent] = useState<string>(thought.content);
  const [isTooLong, setIsTooLong] = useState<boolean>(false);

  useEffect(() => {
    setContent(thought.content);
  }, [thought]);

  const handleConfirmContent = useCallback(
    (content: string) => {
      onUpdate({ ...thought, content, tags: thought.tags });
    },
    [thought]
  );

  const handleChangeContent = useCallback(
    (content: string) => {
      if (content.length > 360) {
        setIsTooLong(true);
      } else {
        setIsTooLong(false);
        setContent(content);
      }
    },
    [setContent]
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
        <Pane display="flex" flexDirection="row" alignItems="center">
          <Heading size={600} marginRight={16}>
            {new Date(thought.created_at).toDateString()}
          </Heading>
          <TagBar tags={thought.tags} onSave={onChangeTags} updateTags={onUpdateTags} allTags={allTags} />
        </Pane>
        {window.innerWidth > 800 && (
          <Button appearance="minimal" onClick={onClickDelete} iconBefore={TrashIcon} disabled={isDisabled}>
            Delete
          </Button>
        )}
      </Pane>
      <EditableText
        disabled={isDisabled}
        multiline={true}
        value={content}
        onConfirm={handleConfirmContent}
        onChange={handleChangeContent}
        className="thought-editor-editable-text"
      />
      {isTooLong && <Text color="red600">Thoughts are limited to 360 characters.</Text>}
    </Pane>
  );
};

export default ThoughtEditor;
