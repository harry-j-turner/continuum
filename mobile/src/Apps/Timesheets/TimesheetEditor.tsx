import React, { useCallback } from 'react';

// Styles
import style from './styles';

// Components
import { FlatList, ListRenderItem, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import TimesheetEntryCard from './TimesheetEntry';
import ActionBar, { ActionBarButton } from '../../Components/ActionBar/ActionBar';
import ConfirmationPopup, { ConfirmationPopupHandle } from '../../Components/ConfirmationPopup';
import Icon from 'react-native-vector-icons/Ionicons';

// Types
import { Timesheet, TimesheetEntry, UpdateTimesheetEntryRequest } from '../../Services/API/types';
import theme from '../../theme';

interface TimesheetEditor {
  timesheet: Timesheet;
  onNewTimesheetEntry: () => void;
  onDeleteTimesheetEntry: (timesheetEntryID: string) => void;
  onCloseTimesheet: () => void;
  onDeleteTimesheet: () => void;
  onUpdateTimesheetEntry: (timesheetEntryID: string, body: UpdateTimesheetEntryRequest) => void;
}

// TODO: Reload the timesheets when the app is opened.
// TODO: If no timesheetEntries, show a message to the user.
function TimesheetEditor({
  timesheet,
  onNewTimesheetEntry,
  onCloseTimesheet,
  onDeleteTimesheetEntry,
  onDeleteTimesheet,
  onUpdateTimesheetEntry
}: TimesheetEditor): JSX.Element {
  const confirmDeleteRef = React.createRef<ConfirmationPopupHandle>();

  const renderEntry: ListRenderItem<TimesheetEntry> = useCallback(({ item }) => {
    return (
      <TimesheetEntryCard
        timesheetEntry={item}
        onDeleted={() => onDeleteTimesheetEntry(item.id)}
        onUpdated={(body: UpdateTimesheetEntryRequest) => onUpdateTimesheetEntry(item.id, body)}
      />
    );
  }, []);

  const actionBarButtons: ActionBarButton[] = [
    { icon: 'chevron-back', onPress: onCloseTimesheet, text: 'Back', position: 'left' },

    {
      icon: 'trash-can-outline',
      onPress: () => confirmDeleteRef.current?.show(),
      text: 'Delete',
      position: 'menu'
    },
    { icon: 'add', onPress: onNewTimesheetEntry, text: 'Add time', position: 'right' }
  ];

  return (
    <View style={style.container}>
      <ConfirmationPopup
        ref={confirmDeleteRef}
        onConfirm={onDeleteTimesheet}
        title="Delete entire timesheet?"
        body="This will delete the whole timesheet, are you sure you want to do this? This action cannot be undone."
      />
      <ActionBar buttons={actionBarButtons} />
      {timesheet.entries.length === 0 && (
        <View style={[style.container, { paddingTop: '20%' }]}>
          <Icon name="time-outline" size={48} color={theme.colors.mediumGray} />
          <Text
            variant="headlineSmall"
            style={{ fontFamily: 'Nunito-Regular', paddingTop: 32, color: theme.colors.mediumGray }}
          >
            No entries
          </Text>
          <Text
            variant="titleMedium"
            style={{ paddingTop: 32, fontFamily: 'Nunito-Regular', color: theme.colors.mediumGray }}
          >
            Click 'Add time' to get started.
          </Text>
        </View>
      )}
      {timesheet.entries.length > 0 && (
        <>
          <View style={style.sectionHeader}>
            <Text variant="bodyLarge" style={style.timesheetCardTitle}>
              Time Entries
            </Text>
          </View>
          <View style={style.timesheetEditorBody}>
            <FlatList
              keyExtractor={(item) => item.id}
              data={timesheet.entries}
              renderItem={renderEntry}
            />
          </View>
        </>
      )}
    </View>
  );
}

export default TimesheetEditor;
