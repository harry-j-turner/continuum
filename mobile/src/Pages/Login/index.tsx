import React, { useState } from 'react';

// Components
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EmailScreen from './EmailScreen';
import PinCodeScreen from './PinCodeScreen';

// Auth
import { useAuth } from '../../Auth';

function LoginScreen(): JSX.Element {
  const auth = useAuth();
  const [mode, setMode] = useState<'email' | 'pin'>(
    auth.email ? 'pin' : 'email'
  );

  return (
    <SafeAreaProvider style={{ paddingTop: 64 }}>
      {mode === 'email' ? (
        <EmailScreen onSetEmail={() => setMode('pin')} />
      ) : (
        <PinCodeScreen
          email={auth.email!}
          onChangeUser={() => setMode('email')}
        />
      )}
    </SafeAreaProvider>
  );
}

export default LoginScreen;
