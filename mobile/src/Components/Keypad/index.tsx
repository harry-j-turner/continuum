import React from 'react';

import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

interface KeypadProps {
  undoElement: JSX.Element;
  onPress: (value: number) => void;
  disabled?: boolean;
}

const { width } = Dimensions.get('window');
const childWidth = (width * 0.8 - (3 - 1) * 12) / 3;

const style = StyleSheet.create({
  keypad: {
    marginTop: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '80%'
  },
  keycol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  key: {
    width: childWidth,
    height: childWidth,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  keyText: {
    color: '#5D3754'
  }
});

function Key({
  children,
  value,
  onPress,
  disabled = false
}: {
  children?: JSX.Element;
  value: number;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[style.key, { opacity: disabled ? 0.3 : 1.0 }]}
      disabled={disabled}
    >
      {children ? (
        children
      ) : (
        <Text style={style.keyText} variant="headlineLarge">
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function Keypad({
  undoElement,
  onPress,
  disabled = false
}: KeypadProps): JSX.Element {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <View style={style.keypad}>
        <View style={style.keycol}>
          <Key value={1} onPress={() => onPress(1)} disabled={disabled} />
          <Key value={4} onPress={() => onPress(4)} disabled={disabled} />
          <Key value={7} onPress={() => onPress(7)} disabled={disabled} />
          <Key value={-1} onPress={() => onPress(-1)} disabled={disabled}>
            {undoElement}
          </Key>
        </View>
        <View style={style.keycol}>
          <Key value={2} onPress={() => onPress(2)} disabled={disabled} />
          <Key value={5} onPress={() => onPress(5)} disabled={disabled} />
          <Key value={8} onPress={() => onPress(8)} disabled={disabled} />
          <Key value={0} onPress={() => onPress(0)} disabled={disabled} />
        </View>
        <View style={style.keycol}>
          <Key value={3} onPress={() => onPress(3)} disabled={disabled} />
          <Key value={6} onPress={() => onPress(6)} disabled={disabled} />
          <Key value={9} onPress={() => onPress(9)} disabled={disabled} />
        </View>
      </View>
    </View>
  );
}

export default Keypad;
