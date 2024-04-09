import React from 'react';
import theme from '../../theme';
import { Entry } from '../../types';
import { Card, Strong, Text } from 'evergreen-ui';

interface BrowseableItemProps {
  entry: Entry;
  selected: boolean;
  onSelect: (id: string) => void;
}

function BrowseableItem({ entry, selected, onSelect }: BrowseableItemProps) {
  const [hover, setHover] = React.useState<boolean>(false);
  const opacity = selected ? 0.8 : hover ? 0.6 : 0.5;

  const firstThought = entry.thoughts[0] || null;
  const firstThoughtText = firstThought ? `${firstThought.content.slice(0, 64)}...` : '';

  const convertIsoDateToHumanReadable = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toDateString();
  };

  return (
    <Card
      key={entry.id}
      display="flex"
      padding={8}
      marginTop={8}
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
      cursor="pointer"
      userSelect="none"
      opacity={opacity}
      onClick={() => onSelect(entry.id)}
      style={{ backgroundColor: 'white', transition: 'opacity 0.1s' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* {entry.tags && entry.tags.length > 0 && (
        <Pane style={{ marginBottom: 4 }}>
          <TagBar tags={entry.tags} onSave={() => null} frozen={true} />
        </Pane>
      )} */}
      <Strong color={theme.colors.primary} textAlign="left">
        {convertIsoDateToHumanReadable(entry.date)}
      </Strong>
      {firstThought && (
        <Text color={theme.colors.primary} textAlign="left">
          {firstThoughtText}
        </Text>
      )}
    </Card>
  );
}

export default BrowseableItem;
