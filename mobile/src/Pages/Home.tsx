import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

// Components
import AppIcon from '../Components/AppIcon';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabNavigatorParams } from '../../App';

const style = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  appNavigator: {
    width: '80%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

// TODO: New timesheet allows you to pick link.
// TODO: New timesheet links are cached for quick access.
// TODO: New timesheet set dates for that timesheet, assume monthly.
// TODO: The linkee should be at the top.
// TODO: App Icons should have coming soon.
// TODO: Calendar not working on Android.
// TODO: All buttons bigger.
// TODO: Export button emails to the user.

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const width = useWindowDimensions().width;
  const { navigate } = useNavigation<BottomTabNavigationProp<TabNavigatorParams>>();

  // Compute all the gap sizes using some arbitrary rules.
  const innerGap = width * 0.1; // 10% of the screen width.
  const outerGap = width * 0.15; // 15% of the screen width.
  const appIconSize = (width - 2 * outerGap - innerGap) / 2; // Assume two apps per row.

  // Dynamically compute the styles.
  const appNavigatorStyle = [
    style.appNavigator,
    { width: width - 2 * outerGap, marginTop: outerGap }
  ];

  const rowSeparatorStyle = {
    width: width,
    height: innerGap
  };

  const onAppIconPress = (app: string) => {
    navigate('AppInApp', { app });
  };

  return (
    <View style={style.screen}>
      <View style={appNavigatorStyle}>
        <AppIcon
          size={appIconSize}
          name="Timesheets"
          icon="time-outline"
          onPress={() => onAppIconPress('timesheets')}
        />
        <AppIcon
          size={appIconSize}
          name="Appointments"
          disabled={true}
          icon="calendar-outline"
          onPress={() => onAppIconPress('appointments')}
        />
        <View style={rowSeparatorStyle}></View>
        <AppIcon
          size={appIconSize}
          name="Find a Carer"
          disabled={true}
          icon="accessibility-outline"
          onPress={() => onAppIconPress('find-a-carer')}
        />
        <AppIcon
          size={appIconSize}
          name="DBS Check"
          disabled={true}
          icon="shield-checkmark-outline"
          onPress={() => onAppIconPress('dbs-check')}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
