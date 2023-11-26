import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ onMessagesPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Abuse-Detector</Text>

      {/* Optional: Additional navigation items */}
      <View style={styles.navItems}>
        <TouchableOpacity onPress={onMessagesPress}>
          <Ionicons name="chatbubbles-outline" size={24} color="white" />
        </TouchableOpacity>
        {/* Add more icons or text here as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4267B2', // Facebook blue
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: '600',

  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // You can remove or modify other styles that are not used anymore
});

export default Header;
