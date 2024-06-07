import React from 'react';

// Styling & Animation
import style from './styles';

// Components
import { View } from 'react-native';
import { Button } from 'react-native-paper';

interface TimesheetActionsProps {
  onNewTimesheet: () => void;
}

function TimesheetActions({ onNewTimesheet }: TimesheetActionsProps): JSX.Element {
  return (
    <View style={style.actionBar}>
      <Button mode="contained" style={{ borderRadius: 8 }} onPress={onNewTimesheet}>
        New timesheet
      </Button>
    </View>
  );
}

export default TimesheetActions;
