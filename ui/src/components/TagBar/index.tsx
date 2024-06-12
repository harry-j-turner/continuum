import { TagInput } from 'evergreen-ui';
import React, { useCallback } from 'react';
import { useAPI } from '../../hooks';
import { hsvToRgb } from '../../colourConversionAlgorithms';
import { Tag } from '../../types';
import theme from '../../theme';

interface TagBarProps {
  tags: string[];
  allTags: Tag[];
  onSave: (tags: string[]) => void;
  updateTags: (tags: Tag[]) => void;
  padding?: number;
}

const getRandomTagColour = () => {
  const hue = Math.random() * 360;
  const saturation = 0.1;
  const value = 0.8;
  const [r, g, b] = hsvToRgb(hue, saturation, value);
  return `rgb(${r},${g},${b})`;
};

const TagBar = React.forwardRef(({ tags, onSave, allTags, updateTags, padding = 0 }: TagBarProps, ref) => {
  const api = useAPI();

  const onChange = useCallback(
    (values: string[]) => {
      // First figure out which tags already exist, and which need to be created.
      const existingTagIds: string[] = [];
      const newTagNames: string[] = [];
      for (const value of values) {
        const tag = allTags.find((t) => t.name === value.toLowerCase());
        if (tag) {
          existingTagIds.push(tag.id);
        } else {
          newTagNames.push(value.toLowerCase());
        }
      }

      // Create any new tags if necessary and wait for all creations to complete.
      const newTagsPromises = newTagNames.map((name) =>
        api.createTag({ tag: { name, description: 'not used', colour: getRandomTagColour() } })
      );

      Promise.all(newTagsPromises).then((newTags) => {
        const successfulNewTags = newTags.filter((tag): tag is Tag => tag !== null && tag !== undefined);

        // Update the list of tags with the newly created ones.
        const updatedTags = [...allTags, ...successfulNewTags];
        updateTags(updatedTags);

        // Ensure we include the IDs of the newly created tags as well.
        const allTagIds = [...existingTagIds, ...successfulNewTags.map((tag) => tag.id)];
        onSave(allTagIds);
      });
    },
    [allTags, onSave]
  );

  const getTagProps = useCallback(
    (value: string) => {
      const tag = allTags.find((t) => t.name === value.toLowerCase());
      if (tag) {
        return {
          color: theme.colors.primary,
          backgroundColor: tag.colour,
          padding: 11
        };
      }
      return {};
    },
    [allTags]
  );

  const values = tags.map((tag) => allTags.find((t) => t.id === tag)?.name || tag);
  const allValues = allTags.map((tag) => tag.name);
  const autocompleteItems: string[] = allValues.filter((i) => !values.includes(i));

  const editableUI = (
    <TagInput
      width="auto"
      inputRef={ref as React.RefObject<HTMLInputElement>}
      inputProps={{ placeholder: 'Tags', height: 34 }}
      autocompleteItems={autocompleteItems}
      values={values}
      onChange={onChange}
      tagProps={(value: string) => getTagProps(value)}
      padding={padding}
    />
  );

  return editableUI;
});

export default TagBar;
