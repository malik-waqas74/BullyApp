// MenuScreen.js
import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFirebase from '../hook/useFirebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MenuScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const { user, signOut, fetchUserProfile } = useFirebase();
  const [userdata, setUserData] = useState({
    name: "",
    email: "",
    uid: "",
    userRole: ""
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && user.uid) {
        try {
          const userProfile = await fetchUserProfile(user.uid);
          if (userProfile) {
            setUserData(userProfile);
            setProfileImage(userProfile.profileImageUrl);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadUserProfile();
  }, [user]);



  const handleLogout = async () => {
    try {
      await signOut();
      navigation.replace('Login');
    } catch (error) {
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
        {
          profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePic} />
          ) : (
            <Icon name="account-circle" size={100} color="gray" />          )
        }
        <Text style={styles.profileName}>{userdata.name}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        navigation.navigate('ChangeInfo');
      }} style={styles.menuItem}>
        <Ionicons name="information-circle-outline" size={24} color="#4267B2" />
        <Text style={styles.menuItemText}>Change Info</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        navigation.navigate('ChangePassword');
      }} style={styles.menuItem}>
        <Ionicons name="key-outline" size={24} color="#4267B2" />
        <Text style={styles.menuItemText}>Change Password</Text>
      </TouchableOpacity>

      {userdata.userRole == 'admin' && (
        <TouchableOpacity onPress={() => {
          navigation.navigate('ReportedPost');
        }} style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#4267B2" />
          <Text style={styles.menuItemText}>See Reported Posts</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => {
       handleLogout();
      }} style={styles.menuItem}>
        <Ionicons name="log-out-outline" size={24} color="#4267B2" />
        <Text style={styles.menuItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DADDE1',
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    color: '#1C1E21',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DADDE1',
    marginBottom: 10,
  },
  menuItemText: {
    color: '#4267B2',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default MenuScreen;
