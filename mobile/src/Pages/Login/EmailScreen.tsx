import React, { useCallback, useState } from 'react';

// Components
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import TextButton from '../../Components/TextButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth
import { useAuthDispatch } from '../../Auth';

// Style
import { style } from './style.ts';

interface EmailScreenProps {
  onSetEmail: () => void;
}

function EmailScreen({ onSetEmail }: EmailScreenProps): JSX.Element {
  const authDispatch = useAuthDispatch();
  const [emailInput, setEmailInput] = useState<string>('');

  const handleNext = useCallback(() => {
    AsyncStorage.setItem('email', emailInput);
    authDispatch({ type: 'UPDATE', payload: { email: emailInput } });
    onSetEmail();
  }, [emailInput]);

  return (
    <View style={style.screenContainer}>
      <View style={{ alignSelf: 'flex-end', paddingRight: 32 }}>
        <TextButton
          text="Next"
          onPress={handleNext}
          disabled={emailInput === ''}
        />
      </View>

      <View style={{ paddingVertical: 64 }}>
        <Text style={style.headerText} variant="titleLarge">
          Who&apos;s signing in today?
        </Text>
      </View>

      <View style={{ width: '60%' }}>
        <TextInput
          mode="outlined"
          label="Email"
          value={emailInput}
          onChangeText={(text) => setEmailInput(text)}
        />
      </View>
    </View>
  );
}

export default EmailScreen;
