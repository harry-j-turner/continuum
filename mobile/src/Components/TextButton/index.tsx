import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import style from './styles';

interface TextButtonProps {
  text: string;
  iconBefore?: string;
  iconAfter?: string;
  onPress: () => void;
  disabled?: boolean;
}

function TextButton({
  text,
  iconBefore,
  iconAfter,
  onPress,
  disabled = false
}: TextButtonProps): JSX.Element {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[style.button, { opacity: disabled ? 0.3 : 1 }]}
    >
      {iconBefore && (
        <Icon
          name={iconBefore}
          size={32}
          color={style.buttonText.color}
          style={{ paddingRight: 8 }}
        />
      )}
      <Text style={style.buttonText}>{text}</Text>
      {iconAfter && (
        <Icon
          name={iconAfter}
          size={32}
          color={style.buttonText.color}
          style={{ paddingLeft: 8 }}
        />
      )}
    </TouchableOpacity>
  );
}

export default TextButton;
