import React from 'react';

// Styling & Animation
import style from './styles';

// Components
import { TouchableOpacity, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import TextButton from '../TextButton';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

export type ActionBarButton = {
  icon: string;
  onPress: () => void;
  text: string;
  position: 'left' | 'right' | 'menu';
};

interface ActionBarProps {
  buttons: ActionBarButton[];
}

function ActionBar({ buttons }: ActionBarProps): JSX.Element {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const leftHandButtons = buttons.filter((button) => button.position === 'left');
  const rightHandButtons = buttons.filter((button) => button.position === 'right');
  const menuButtons = buttons.filter((button) => button.position === 'menu');

  return (
    <View style={style.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {leftHandButtons.map((button, index) => (
          <TextButton
            key={index}
            text={button.text}
            onPress={button.onPress}
            iconBefore={button.icon}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {rightHandButtons.map((button, index) => (
          <TextButton
            key={index}
            text={button.text}
            onPress={button.onPress}
            iconBefore={button.icon}
          />
        ))}
        {menuButtons.length > 0 && (
          <Menu
            contentStyle={style.menu}
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                testID="menu"
                style={style.menuButton}
                onPress={() => setMenuVisible(true)}
              >
                <Icon name="ellipsis-vertical" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            }
          >
            {menuButtons.map((button, index) => (
              <Menu.Item
                titleStyle={style.menuItemTitle}
                style={style.menuItem}
                leadingIcon={button.icon}
                key={index}
                onPress={() => {
                  setMenuVisible(false);
                  button.onPress();
                }}
                title={button.text}
              />
            ))}
          </Menu>
        )}
      </View>
    </View>
  );
}

export default ActionBar;
