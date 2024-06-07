import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'Nunito-Bold',
    color: theme.colors.primary
  }
});

interface IconTextProps {
  icon: string;
  text: string;
}

function IconText({ icon, text }: IconTextProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Icon name={icon} size={24} color={theme.colors.primary} testID="icon" />
    </View>
  );
}

export default IconText;
