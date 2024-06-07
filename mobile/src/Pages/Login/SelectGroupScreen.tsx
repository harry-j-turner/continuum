import React from 'react';

// Components
import { View } from 'react-native';
import { Text } from 'react-native-paper';

// Style
import { style } from './style.ts';

interface SelectGroupScreenProps {}

function SelectGroupScreen({}: SelectGroupScreenProps): JSX.Element {
  return (
    <View style={style.screenContainer}>
      <View style={{ paddingVertical: 64 }}>
        <Text style={style.bodyText} variant="titleLarge">
          Please ask your administrator to assign you to a group.
        </Text>
      </View>
    </View>
  );
}

export default SelectGroupScreen;
