import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text, Image, Dimensions } from 'react-native';

const Splash = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState('');

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true
      }
    ).start(() => {
      navigation.replace('Login');
    });

    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);

    return () => clearInterval(interval);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../assets/logo.png')} 
        style={[styles.logo, { opacity: fadeAnim }]}
      />
      <View style={styles.textContainer}>
        <Text style={styles.dots}>{dots}</Text>

        <Text style={styles.text}>Getting Started</Text>
      </View>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#97B8BD',
    paddingVertical: windowHeight * 0.3 // Adjust this value to control the vertical spacing
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    opacity:0.3,
    borderRadius:30
  },
  textContainer: {
    position: 'absolute',
    bottom: windowHeight * 0.1, // 30% from the bottom of the screen
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    color: 'white', // Text color close to the background color for a subtle effect
  
  },
  dots: {
    fontSize: 60, // Bigger size for the dots
    color: 'white', // White color for the dots for visibility
    marginBottom: 30, // Space between the text and the dots
    
  }
});

export default Splash;
