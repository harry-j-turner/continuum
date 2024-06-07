import React, { useCallback, useEffect, useState } from 'react';

// Amplify
import { Auth } from 'aws-amplify';

// Components
import { View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import TextButton from '../../Components/TextButton';
import Keypad from '../../Components/Keypad';
import PinCode from '../../Components/Pin';

// Auth
import { useAuthDispatch } from '../../Auth';

// Style
import { style } from './style.ts';

// Types
import { Group } from '../../Services/API/types';

interface PinCodeScreenProps {
  email: string;
  onChangeUser: () => void;
}

function PinCodeScreen({ email, onChangeUser }: PinCodeScreenProps): JSX.Element {
  const authDispatch = useAuthDispatch();

  const [pin, setPin] = useState<number[]>([]);
  const offset = useSharedValue(0);
  const [error, setError] = useState('');
  const inputDisabled = pin.length === 6;

  const handlePinPress = useCallback((value: number) => {
    setPin((prev) => {
      if (prev.length > 0 && value === -1) return prev.slice(0, -1);
      if (prev.length < 6 && value !== -1) return [...prev, value];
      else return prev;
    });
  }, []);

  useEffect(() => {
    if (pin.length === 6) {
      Auth.signIn(email, pin.join(''))
        .then((user) => {
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            setError('Failed challenge NEW_PASSWORD_REQUIRED.');
            return;
          }

          // TODO: Handle all the challenges.
          // TODO: Check that the user has a group, handle appropriately? Or ask them?
          const session = user.getSignInUserSession();
          const idToken = session.getIdToken();
          const payload = idToken.decodePayload();
          const bearerToken = idToken.getJwtToken();
          const groups = payload['cognito:groups'] || [];
          const sub = user.attributes.sub;

          // Always default to client group if no groups are found.
          let group: Group = 'unassigned';
          if (groups.includes('client')) group = 'client';
          if (groups.includes('personal_assistant')) group = 'personal_assistant';

          authDispatch({
            type: 'UPDATE',
            payload: { user, bearerToken, group, sub }
          });
        })
        .catch((err) => {
          if (err.message === 'Incorrect username or password.') {
            offset.value = withRepeat(
              withSequence(
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(0, { duration: 50 })
              )
            );
          } else {
            console.error(err);
            setError(err.message);
          }
          setTimeout(() => {
            setPin([]);
          }, 500);
        })
        .finally(() => {
          setPin([]);
        });
    }
  }, [pin]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }]
  }));

  return (
    <View style={style.screenContainer}>
      <View style={{ alignSelf: 'flex-start', paddingLeft: 32 }}>
        <TextButton text="Change User" onPress={onChangeUser} />
      </View>

      <View style={{ paddingVertical: 32 }}>
        <Text style={style.headerText} variant="titleMedium">
          {email}
        </Text>
      </View>

      <Animated.View style={[{ paddingVertical: 16 }, animatedStyles]}>
        <PinCode value={pin.length} maxValue={6} />
      </Animated.View>

      <Keypad
        undoElement={<Icon name="backspace-outline" size={36} color="#5D3754" />}
        onPress={handlePinPress}
        disabled={inputDisabled}
      />

      <Snackbar visible={error !== ''} onDismiss={() => setError('')}>
        {error}
      </Snackbar>
    </View>
  );
}

export default PinCodeScreen;
