import React from 'react';
import { View, Image } from 'react-native';

// @ts-expect-error  TS2307: Cannot find module 'react-native-animated-loader'.
import AnimatedLoader from 'react-native-animated-loader';

function Splash(): JSX.Element {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5D3754'
      }}
    >
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 164, height: 61, marginBottom: 50 }}
      />
      <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0)"
        source={require('../../assets/loader.json')}
        animationStyle={{ width: 200, height: 200, marginTop: 50 }}
        speed={0.5}
      />
    </View>
  );
}

export default Splash;
