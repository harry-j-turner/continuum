import React, { useCallback } from 'react';

// Types
import { Group, Timesheet } from '../../Services/API/types';

// Styling & Animation
import style from './styles';

// Components
import TimesheetCard from './TimesheetCard';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import theme from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

interface TimesheetList {
  timesheets: Timesheet[] | null;
  group: Group;
  onOpenTimesheet: (timesheetID: string) => void;
}
// TODO: What if there are too many timesheets, do they flow off the screen?

// TODO: Standardise text. All buttons size 20. All text size 16. Text is bold or regular.
function TimesheetList({ timesheets, group, onOpenTimesheet }: TimesheetList): JSX.Element {
  const renderEntry: ListRenderItem<Timesheet> = useCallback(
    ({ item }) => {
      return (
        <TimesheetCard
          timesheet={item}
          key={item.id}
          group={group}
          onOpenTimesheet={onOpenTimesheet}
        />
      );
    },
    [onOpenTimesheet]
  );

  return (
    <View style={style.container}>
      <View style={style.timesheetList}>
        {/* Timesheets not loaded yet. */}
        {timesheets === null && (
          <View
            style={{
              paddingTop: 48
            }}
          >
            <ActivityIndicator animating={true} color={theme.colors.primary} />
            <Text style={[style.timesheetCardTitle, { marginTop: 16 }]} variant="titleMedium">
              Fetching timesheets...
            </Text>
          </View>
        )}

        {/* No timesheets found. */}
        {timesheets && timesheets.length === 0 && (
          <View style={[style.container, { paddingTop: '20%' }]}>
            <Icon name="calendar-outline" size={48} color={theme.colors.mediumGray} />
            <Text
              variant="headlineSmall"
              style={{
                fontFamily: 'Nunito-Regular',
                paddingTop: 32,
                color: theme.colors.mediumGray
              }}
            >
              No timesheets
            </Text>
            <Text
              variant="titleMedium"
              style={{
                paddingTop: 32,
                fontFamily: 'Nunito-Regular',
                color: theme.colors.mediumGray
              }}
            >
              Click 'New' to get started.
            </Text>
          </View>
        )}

        {/* Timesheets found. */}
        {timesheets && timesheets.length > 0 && (
          <FlatList keyExtractor={(item) => item.id} data={timesheets} renderItem={renderEntry} />
        )}
      </View>
    </View>
  );
}

export default TimesheetList;
