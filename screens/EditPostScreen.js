import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Alert, TextInput, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useFirebase from '../hook/useFirebase';
import CustomLoadingAnimation from '../components/CustomLoadingAnimation';

const EditPostScreen = ({ navigation, route }) => {
  const { post } = route.params;
  const { user, editCurrentUserPost, fetchUserProfile } = useFirebase();
  const [isLoading, setIsLoading] = useState(false);
  const [postText, setPostText] = useState(post.text);
  const [userdata, setUserData] = useState({
    name: '',
    imageUri: '',
  });
  const handlePostUpdate = async () => {
    setIsLoading(true);
    try {
      await editCurrentUserPost(post.id, { text: postText }); 
      Alert.alert("Success", "Post updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && user.uid) {
        try {
          const userProfile = await fetchUserProfile(user.uid);
          if (userProfile) {
            setUserData({
              name: userProfile.name,
              imageUri: userProfile.profileImageUrl,
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadUserProfile();
  }, [user]);

  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#4267B2" />
          <Text style={styles.headerText}>Edit post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePostUpdate} style={styles.postButton}>
          <Text style={styles.postButtonText}>POST</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        {userdata.imageUri ? (
          <Image source={{ uri: userdata.imageUri }} style={styles.profilePic} />
        ) : (
          <MaterialCommunityIcons name="account-circle" size={40} color="gray" />
        )}
        <Text style={styles.profileName}>{userdata.name}</Text>
      </View>
      <TextInput
        value={postText}
        onChangeText={setPostText}
        placeholder="What's on your mind?"
        style={styles.postInput}
        multiline
      />
      <CustomLoadingAnimation isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DADDE1',
    backgroundColor: '#FFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#4267B2',
    fontSize: 18,
    marginLeft: 10,
  },
  postButton: {
    backgroundColor: '#4267B2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  postButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    color: '#1C1E21',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postInput: {
    fontSize: 18,
    color: '#1C1E21',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 100, // Ample space for typing long texts
  },
});

export default EditPostScreen;
