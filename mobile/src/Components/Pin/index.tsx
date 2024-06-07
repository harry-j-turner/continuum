import React from 'react';
import { View } from 'react-native';

// eslint-disable-next-line import/no-extraneous-dependencies
import Icon from 'react-native-vector-icons/Ionicons';

function Pin({ filled }: { filled: boolean }) {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Icon name="ellipse" size={filled ? 24 : 4} color="#5D3754" />
    </View>
  );
}

interface PinCodeProps {
  value: number;
  maxValue: number;
}

function PinCode({ value, maxValue }: PinCodeProps): JSX.Element {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '60%'
      }}
    >
      {[...Array(maxValue)].map((_, index) => (
        <Pin key={index} filled={index < value} />
      ))}
    </View>
  );
}

export default PinCode;
