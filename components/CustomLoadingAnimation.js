import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const CustomLoadingAnimation = ({ isLoading }) => {
  return (
    <Modal transparent={true} visible={isLoading}>
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/timer.json')} // Ensure this path is correct for your project structure
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  lottie: {
    width: 200,
    height: 200,
  },
});

export default CustomLoadingAnimation;
