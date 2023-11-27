import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Abuse-Detector</Text>

      {/* Optional: Additional navigation items */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#00A4BD', 
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: '400',

  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // You can remove or modify other styles that are not used anymore
});

export default Header;
