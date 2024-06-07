// eslint-disable-next-line import/no-extraneous-dependencies
import * as Font from 'expo-font';

export async function loadFonts(): Promise<void> {
  await Font.loadAsync({
    'Roboto-Light': require('../assets/fonts/Roboto-Light.ttf')
  });
}
