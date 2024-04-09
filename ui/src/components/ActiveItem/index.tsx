import '../../App.css';
import React, { useCallback, useEffect } from 'react';
import theme from '../../theme';
import { Button, CleanIcon, Heading, Icon, PlusIcon } from 'evergreen-ui';
import { Tag, Thought } from '../../types';
import { Pane } from 'evergreen-ui';
import { AppDispatch, selectItem as selectEntry } from '../../state/store';
import { useSelector, useDispatch } from 'react-redux';

import ThoughtEditor from '../ThoughtEditor';

import useAPI from '../../hooks/useAPI';
import { setEntry } from '../../state/item';

function ActiveItem() {
  const activeEntry = useSelector(selectEntry);
  const api = useAPI();
  const dispatch = useDispatch<AppDispatch>();

  const [allTags, setAllTags] = React.useState<Tag[]>([]);
  useEffect(() => {
    api.listTags().then((tags) => {
      console.log(tags?.map((tag) => tag.name));
      if (tags) setAllTags(tags);
    });
  }, []);

  const handleUpdateTags = useCallback(
    (tags: Tag[]) => {
      setAllTags(tags);
    },
    [setAllTags]
  );

  const handleNewThought = useCallback(() => {
    if (!activeEntry) return;
    const newThought: Omit<Thought, 'id' | 'entry'> = {
      content: '',
      tags: []
    };
    api.createThought({ entryId: activeEntry.id, item: newThought }).then((thought) => {
      if (!thought) return;
      dispatch(setEntry({ entry: { ...activeEntry, thoughts: [...activeEntry.thoughts, thought] } }));
    });
  }, [activeEntry, dispatch]);

  const handleDeleteThought = useCallback(
    (thought: Thought) => {
      if (!activeEntry) return;
      api.deleteThought({ entryId: activeEntry.id, thoughtId: thought.id }).then(() => {
        const updatedThoughts = activeEntry.thoughts.filter((t) => t.id !== thought.id);
        dispatch(setEntry({ entry: { ...activeEntry, thoughts: updatedThoughts } }));
      });
    },
    [activeEntry, dispatch]
  );

  const handleUpdateThought = useCallback(
    (thought: Thought) => {
      if (!activeEntry) return;
      api.updateThought({ entryId: activeEntry.id, thoughtId: thought.id, item: thought }).then((thought) => {
        if (!thought) return;
        const updatedThoughts = activeEntry.thoughts.map((t) => (t.id === thought.id ? thought : t));
        dispatch(setEntry({ entry: { ...activeEntry, thoughts: updatedThoughts } }));
      });
    },
    [activeEntry, dispatch]
  );

  if (!activeEntry) {
    return (
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex={1}
        padding={16}
        borderRadius={4}
        backgroundColor="rgba(255, 255, 255, 0.5)"
      >
        <Icon icon={CleanIcon} size={96} color={theme.colors.primary} marginBottom={32} opacity={0.5} />
        <Heading size={800} color={theme.colors.primary} paddingLeft={16}>
          Nothing selected
        </Heading>
        <Heading size={600} color={theme.colors.primary} paddingLeft={16}>
          Choose an item from the sidebar
        </Heading>
      </Pane>
    );
  }

  return (
    <Pane
      id="active-item"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      borderRadius={4}
      flex="1"
      maxHeight="calc(100vh - 80px)"
      position="relative"
      paddingLeft={16}
    >
      <Pane display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
        {/* Header showing entry date in human-readable format */}
        <Heading size={700} color={theme.colors.white}>
          {new Date(activeEntry.date).toDateString()}
        </Heading>

        <Button onClick={handleNewThought} appearance="primary" iconBefore={PlusIcon}>
          Add thought
        </Button>
      </Pane>
      <Pane flex="1" width="100%" className="browseBodyNoScrollbar" marginTop={16}>
        <Pane width="100%" flex={1} display="flex" flexDirection="column">
          {activeEntry.thoughts.map((thought) => (
            <ThoughtEditor
              key={thought.id}
              thought={thought}
              onUpdate={handleUpdateThought}
              onDelete={handleDeleteThought}
              updateTags={handleUpdateTags}
              allTags={allTags}
            />
          ))}
        </Pane>
      </Pane>
    </Pane>
  );
}

export default ActiveItem;
