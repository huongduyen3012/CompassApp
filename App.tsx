import React, {useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  Text,
  View,
} from 'react-native';
const {CompassModule} = NativeModules;

const {width} = Dimensions.get('window');

export default function CompassScreen() {
  const [compassDegree, setCompassDegree] = useState<number>(0);
  const rotateValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const compassEmitter = new NativeEventEmitter(CompassModule);
    const compassSubscription = compassEmitter.addListener(
      'CompassUpdate',
      data => {
        setCompassDegree(data.azimuth);
        rotateValue.setValue(360 - data.azimuth);
      },
    );

    CompassModule.startCompass();

    return () => {
      compassSubscription.remove();
      CompassModule.stopCompass();
    };
  }, [rotateValue]);

  const spin = rotateValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.compassContainer}>
        <Animated.Image
          source={require('./assets/compass-needle.png')}
          style={[
            styles.compassNeedle,
            {
              transform: [{rotate: spin}],
            },
          ]}
        />
        <Text style={styles.degreeText}>
          Direction:
          {Math.round(compassDegree)}°
        </Text>
        <Text style={styles.directionText}>{getDirection(compassDegree)}</Text>
      </View>
    </View>
  );
}

const getDirection = (degree: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassContainer: {
    width: width * 0.8,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compassBase: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'contain',
  },
  compassNeedle: {
    width: '80%',
    height: '80%',
    position: 'absolute',
    resizeMode: 'contain',
  },
  degreeText: {
    fontSize: 30,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: -80,
  },
  directionText: {
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
    bottom: -120,
  },
});
