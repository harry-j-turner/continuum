import React, { useState, useEffect } from 'react';

// Redux
import { Provider } from 'react-redux';
import store from './src/state/store';

// Amplify
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';

// Screens
import HomeScreen from './src/Pages/Home';
import AppInAppScreen from './src/Pages/AppInApp';
import SettingsScreen from './src/Pages/Settings';
import LoginScreen from './src/Pages/Login';
import Splash from './src/Pages/Splash';
import SelectGroupScreen from './src/Pages/Login/SelectGroupScreen';

// Components
import Icon from 'react-native-vector-icons/Ionicons';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Theme
import theme from './src/theme';
import * as Font from 'expo-font';

// Auth
import AuthProvider, { useAuth } from './src/Auth';

// Sentry
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://cca654a440f0e66dd80d2837982ac38b@o4506376971157504.ingest.sentry.io/4506672507715585',
  debug: true // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

Amplify.configure(amplifyconfig);

type HomeScreenParams = object;
type SettingsScreenParams = object;
type AppInAppParams = {
  app: string;
};

export type TabNavigatorParams = {
  Home: NavigatorScreenParams<HomeScreenParams>;
  Settings: SettingsScreenParams;
  AppInApp: AppInAppParams;
};

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeHome" component={HomeScreen} />
  </HomeStack.Navigator>
);

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'alert';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Icon name={iconName} size={size * 1.3} color={color} />;
          },
          tabBarActiveTintColor: '#5D3754',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 60
          },
          headerTitleStyle: {
            fontFamily: 'Nunito-Bold',
            color: theme.colors.primary
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen
          name="AppInApp"
          component={AppInAppScreen}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function LoadingApp(): JSX.Element | null {
  const auth = useAuth();
  const [loadingState, setLoadingState] = useState<Record<string, boolean>>({
    fonts: false,
    auth: false
  });

  useEffect(() => {
    setLoadingState((prevState) => ({ ...prevState, auth: auth.isLoaded }));
  }, [auth.isLoaded]);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
        'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
        'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf')
      });
      setLoadingState((prevState) => ({ ...prevState, fonts: true }));
    }
    loadFont();
  }, []);

  const loaded = () => {
    let loaded = true;
    for (const key in loadingState) {
      if (!loadingState[key]) {
        loaded = false;
      }
    }
    return loaded;
  };

  if (!loaded()) return <Splash />;
  if (!auth.user) return <LoginScreen />;
  if (auth.group === 'unassigned') return <SelectGroupScreen />;
  return <App />;
}

function AppWrapper(): JSX.Element {
  return (
    <Provider store={store}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <LoadingApp />
        </PaperProvider>
      </AuthProvider>
    </Provider>
  );
}

export default Sentry.wrap(AppWrapper);
