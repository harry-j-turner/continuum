import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

const style = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    color: theme.colors.primary,
    fontFamily: 'Nunito-Bold'
  }
});

interface AppIconProps {
  size: number;
  name: string;
  icon: string;
  disabled?: boolean;
  onPress: () => void;
}

function AppIcon({ size, name, icon, disabled, onPress }: AppIconProps): JSX.Element {
  const touchableOpacityStyle = [
    style.container,
    { width: size, height: size, opacity: disabled ? 0.5 : 1 }
  ];
  return (
    <TouchableOpacity style={touchableOpacityStyle} onPress={onPress} disabled={disabled}>
      <Icon name={icon} size={size / 2} color={theme.colors.primary} />
      <Text variant="labelLarge" style={style.label}>
        {name}
      </Text>
      {disabled && <Text variant="labelSmall">Coming soon</Text>}
    </TouchableOpacity>
  );
}

export default AppIcon;
