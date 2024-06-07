import React from 'react';

// Components
import { View } from 'react-native';
import { Text } from 'react-native-paper';

// Types
import { Group, Timesheet } from '../../Services/API/types';

// Styles
import style from './styles';
import { TouchableNativeFeedback } from 'react-native';
import TextButton from '../../Components/TextButton';

interface TimesheetCardProps {
  timesheet: Timesheet;
  group: Group;
  onOpenTimesheet: (timesheetID: string) => void;
}

function TimesheetCard({ timesheet, group, onOpenTimesheet }: TimesheetCardProps): JSX.Element {
  let assignmentMessage = '';
  if (group === 'client') {
    assignmentMessage = timesheet.employee
      ? `with ${timesheet.employee.username}`
      : 'Not yet assigned';
  }
  if (group === 'personal_assistant') {
    assignmentMessage = timesheet.employer
      ? `with ${timesheet.employer.username}`
      : 'Not yet assigned';
  }
  // TODO: Need to list the timesheets in date order.
  // TODO: Add a method for asssigning another person to the timesheet.
  // TODO: When we update a timesheet entry, set both start and end dates together.

  return (
    <TouchableNativeFeedback
      style={style.timesheetButton}
      onPress={() => onOpenTimesheet(timesheet.id)}
    >
      <View style={style.timesheetCard}>
        <View style={style.timesheetInfo}>
          <Text style={style.timesheetCardTitle} variant="titleMedium">
            {timesheet.name}{' '}
          </Text>

          <Text variant="bodyMedium">{assignmentMessage}</Text>
        </View>
        <TextButton
          onPress={() => onOpenTimesheet(timesheet.id)}
          text="Open"
          iconAfter="chevron-forward"
        />
      </View>
    </TouchableNativeFeedback>
  );
}

export default TimesheetCard;
