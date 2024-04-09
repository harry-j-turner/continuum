import '../../App.css';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, NewObjectIcon, SearchInput } from 'evergreen-ui';

import { Pane } from 'evergreen-ui';
import { AppDispatch, selectItem } from '../../state/store';
import { selectAllItems, setEntries } from '../../state/navigator';
import { useSelector, useDispatch } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';

import { setEntry } from '../../state/item';
import BrowseableItem from '../../components/BrowseableItem';

// Utilities
import { debounce } from 'lodash';
import useAPI from '../../hooks/useAPI';

function Navigator() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectAllItems);
  const activeItem = useSelector(selectItem);
  const [searchTerm, setSearchTerm] = useState('');
  const searchBoxRef = React.useRef<HTMLInputElement>(null);
  const api = useAPI();

  const refreshNavigator = useCallback(
    ({ searchTerm }: { searchTerm?: string }) => {
      api.listEntries({ searchTerm }).then((items) => {
        if (items) dispatch(setEntries(items));
      });
    },
    [dispatch]
  );

  //TODO: Get some more filter options in here!
  // TODO: Add confidence bars back in.

  // Load all items on mount.
  useEffect(() => refreshNavigator({}), []);

  const debouncedRefreshItems = useCallback(
    debounce((searchTerm: string) => {
      refreshNavigator({ searchTerm });
    }, 250),
    []
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedRefreshItems(e.target.value);
  };

  useHotkeys(
    'ctrl+q',
    (event) => {
      event.preventDefault();
      searchBoxRef.current?.focus();
    },
    [searchBoxRef]
  );

  const onItemSelect = useCallback(
    (id: string) => {
      api.retrieveEntry({ id }).then((item) => {
        if (item) dispatch(setEntry({ entry: item }));
      });
    },
    [dispatch]
  );

  const onAddEntry = useCallback(() => {
    api
      .createEntry({
        entry: {
          thoughts: [],
          date: new Date().toISOString().split('T')[0]
        }
      })
      .then((item) => {
        if (item) {
          dispatch(setEntry({ entry: item }));
          refreshNavigator({});
        }
      });
  }, []);

  const showNewEntryButton = items.length === 0 || items[0].date !== new Date().toISOString().split('T')[0];

  return (
    <Pane>
      <Pane id="browseHeader" display="flex" flexDirection="row" alignItems="center" userSelect="none" width="100%">
        <SearchInput
          height={40}
          width="100%"
          placeholder="Search"
          ref={searchBoxRef}
          onChange={onSearchChange}
          value={searchTerm}
          style={{ borderRadius: 4 }}
        />
      </Pane>
      <Pane id="browseBody" userSelect="none" className="browseBodyNoScrollbar">
        {items.map((item) => (
          <Pane key={item.id}>
            <BrowseableItem entry={item} selected={item.id === activeItem?.id} onSelect={onItemSelect} />
          </Pane>
        ))}
      </Pane>
      {showNewEntryButton && (
        <Button
          appearance="primary"
          iconBefore={NewObjectIcon}
          onClick={onAddEntry}
          marginTop={16}
          width="100%"
          borderRadius={4}
        >
          Add Today's Entry
        </Button>
      )}
    </Pane>
  );
}

export default Navigator;
