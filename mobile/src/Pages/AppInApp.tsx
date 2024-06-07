import React, { useLayoutEffect } from 'react';

// Components
import { View } from 'react-native';

// Navigation
import { useRoute } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabNavigatorParams } from '../../App';

// Apps
import TimesheetsApp from '../Apps/Timesheets';

// Utils
import { capitalize } from 'lodash';

type AppInAppScreenProps = BottomTabScreenProps<TabNavigatorParams, 'AppInApp'>;

const AppInAppScreen: React.FC<AppInAppScreenProps> = ({ navigation }) => {
  const route = useRoute();

  // @ts-ignore
  const app = route.params?.app;

  useLayoutEffect(() => {
    if (app) {
      navigation.setOptions({ title: capitalize(app) });
    }
  }, [navigation, app]);

  return <View>{app === 'timesheets' && <TimesheetsApp />}</View>;
};

export default AppInAppScreen;
