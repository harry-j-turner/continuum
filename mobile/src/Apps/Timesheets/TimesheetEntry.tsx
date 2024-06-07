import React from 'react';

// Components
import { TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import ConfirmationPopup, { ConfirmationPopupHandle } from '../../Components/ConfirmationPopup';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Types
import { TimesheetEntry, UpdateTimesheetEntryRequest } from '../../Services/API/types';

// Styles
import style from './styles';
import { TouchableHighlight, Platform } from 'react-native';

// Utils
import { formatDate } from './utils';
import theme from '../../theme';
import TextButton from '../../Components/TextButton';

interface TimesheetEntryProps {
  onDeleted: () => void;
  onUpdated: (body: UpdateTimesheetEntryRequest) => void;
  timesheetEntry: TimesheetEntry;
}

interface AbstractDateTimePickerProps {
  mode: 'date' | 'time';
  value: Date;
  onChange: (event: DateTimePickerEvent, selectedDate: Date | undefined) => void;
}

function LaunchableAndroidDateTimePicker({ mode, value, onChange }: AbstractDateTimePickerProps) {
  const [visible, setVisible] = React.useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setVisible(false);
    onChange(event, selectedDate);
  };

  return (
    <>
      {visible && (
        <DateTimePicker
          mode={mode}
          value={new Date(value)}
          onChange={handleChange}
          positiveButton={{ label: 'OK', textColor: theme.colors.primary }}
          negativeButton={{ label: 'Cancel', textColor: theme.colors.primary }}
        />
      )}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          backgroundColor: theme.colors.lightGray,
          padding: 8,
          margin: 8,
          borderRadius: 8,
          marginLeft: 24
        }}
      >
        <Text
          variant="bodyLarge"
          style={[style.timesheetCardBody, { color: theme.colors.darkGray }]}
        >
          {value.toDateString()}
        </Text>
      </TouchableOpacity>
    </>
  );
}

function AbstractDateTimePicker({ mode, value, onChange }: AbstractDateTimePickerProps) {
  const platform = Platform.OS;

  if (platform === 'ios') {
    return <DateTimePicker mode={mode} value={new Date(value)} onChange={onChange} />;
  } else {
    return (
      <LaunchableAndroidDateTimePicker mode={mode} value={new Date(value)} onChange={onChange} />
    );
  }
}

function TimesheetEntryCard({
  onDeleted,
  onUpdated,
  timesheetEntry
}: TimesheetEntryProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const confirmDeleteRef = React.createRef<ConfirmationPopupHandle>();
  const editRef = React.createRef<ConfirmationPopupHandle>();
  const toggleOpen = () => setOpen(!open);

  const onDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (event.type === 'set') {
      const newStartDate = selectedDate as Date;
      const oldStartDate = new Date(timesheetEntry.start_datetime);
      newStartDate.setHours(oldStartDate.getHours());
      newStartDate.setMinutes(oldStartDate.getMinutes());

      const newEndDate = selectedDate as Date;
      const oldEndDate = new Date(timesheetEntry.end_datetime);
      newEndDate.setHours(oldEndDate.getHours());
      newEndDate.setMinutes(oldEndDate.getMinutes());

      onUpdated({
        start_datetime: newStartDate.toISOString(),
        end_datetime: newEndDate.toISOString()
      });
    }
  };

  const onStartTimeChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (event.type === 'set') {
      const newDate = selectedDate as Date;
      const oldDate = new Date(timesheetEntry.start_datetime);
      newDate.setFullYear(oldDate.getFullYear());
      newDate.setMonth(oldDate.getMonth());
      newDate.setDate(oldDate.getDate());
      onUpdated({
        start_datetime: newDate.toISOString(),
        end_datetime: timesheetEntry.end_datetime
      });
    }
  };

  const onEndTimeChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (event.type === 'set') {
      const newDate = selectedDate as Date;
      const oldDate = new Date(timesheetEntry.end_datetime);
      newDate.setFullYear(oldDate.getFullYear());
      newDate.setMonth(oldDate.getMonth());
      newDate.setDate(oldDate.getDate());
      onUpdated({
        start_datetime: timesheetEntry.start_datetime,
        end_datetime: newDate.toISOString()
      });
    }
  };

  return (
    <>
      <TouchableHighlight onPress={toggleOpen}>
        <>
          <ConfirmationPopup
            ref={editRef}
            onConfirm={() => {}}
            title="Edit time entry"
            body="Will put some spinners here or something."
          />
          <ConfirmationPopup
            ref={confirmDeleteRef}
            onConfirm={onDeleted}
            title="Confirm delete?"
            body="Are you sure you want to delete this item? This action cannot be undone."
          />
          <View style={style.timesheetEntryCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text variant="bodyLarge" style={style.timesheetCardBody}>
                {formatDate(timesheetEntry.start_datetime)} to{' '}
                {formatDate(timesheetEntry.end_datetime, true)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={open ? 'chevron-down' : 'chevron-back'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </>
      </TouchableHighlight>
      {open && (
        <View style={style.timesheetEntryDropdown}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingLeft: 0 }}>
            <AbstractDateTimePicker
              mode="date"
              value={new Date(timesheetEntry.start_datetime)}
              onChange={onDateChange}
            />

            <AbstractDateTimePicker
              mode="time"
              value={new Date(timesheetEntry.start_datetime)}
              onChange={onStartTimeChange}
            />
            <Text variant="bodyLarge" style={[style.timesheetCardBody, { paddingLeft: 8 }]}>
              to
            </Text>
            <AbstractDateTimePicker
              mode="time"
              value={new Date(timesheetEntry.end_datetime)}
              onChange={onEndTimeChange}
            />
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingLeft: 16 }}
          >
            {/* This button style could be abstracted into TextButton. */}
            <TouchableOpacity
              style={{
                borderRadius: 8,
                backgroundColor: '#F3E3E3',
                padding: 8,
                paddingHorizontal: 12
              }}
              onPress={() => confirmDeleteRef.current?.show()}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="trash" size={16} color={theme.colors.danger} />
                <Text variant="bodyLarge" style={{ color: theme.colors.danger, marginLeft: 8 }}>
                  Delete time entry
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

export default TimesheetEntryCard;
