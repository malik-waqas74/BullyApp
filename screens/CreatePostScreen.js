import React, { useState, useEffect } from 'react';
import { View, Text,Alert, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useFirebase from '../hook/useFirebase';
import CustomLoadingAnimation from '../components/CustomLoadingAnimation';
import useApiRequest  from '../services/api';
const CreatePostScreen = ({ navigation }) => {
  const { user, createPost, fetchUserProfile } = useFirebase();
  const [text,setText] = useState('');

  const [userdata, setUserData] = useState({
    name: '',
    imageUri: '',
  });
   const [showLoading, setShowLoading] = useState(false);
    const abusiveUrl = 'http://192.168.71.175:8000/api/predictA/';
    const threatUrl = 'http://192.168.71.175:8000/api/predictB/';
  
    const abusiveRequest = useApiRequest();
    const threatRequest = useApiRequest();

    const [displayResults, setDisplayResults] = useState(false);
    const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert("Input Error", "Please enter some text before posting.");
      return;
    }
  
    setShowLoading(true);
    
    try {
      // Fetching abuse data
      const abuseResponse = await abusiveRequest.fetchData(abusiveUrl, 'POST', { text });
      const abusePrediction = abuseResponse?.Prediction || "";
      
      // Fetching threat data
      const threatResponse = await threatRequest.fetchData(threatUrl, 'POST', { text });
      const threatPrediction = threatResponse?.Pred || "";

      console.log("Abuse Prediction: ", abusePrediction);
      console.log("Threat Prediction: ", threatPrediction);

      handleSubmitPost(abusePrediction, threatPrediction);
    } catch (error) {
      console.error("Error in API call:", error);
      Alert.alert("Error", "Failed to process request. Please try again.");
    } finally {
      setShowLoading(false);
      setDisplayResults(true);
    }
  };
    
    const handleSubmitPost = async (abuse, threat) => {
      // Update the states with the latest predictions
    
      if (abuse === "Abusive" && threat === "Threat") {
        Alert.alert("Notice:", "Threat/Abusive Post");
      } 
      else if (abuse === "Abusive") {
        Alert.alert("Notice:", "Abusive Content Detected");
      } 
      else if (threat === "Threat") {
        Alert.alert("Notice:", "Threatening Content Detected");
      } 
      else if (abuse === "Non Abusive" && threat === "Non Threat") {
        try {
          await createPost({
            text: text,
            authorId: user.uid,
            // Additional post details
          });
          setText("");
          navigation.goBack();
        } catch (error) {
          console.error("Error creating post:", error);
          Alert.alert("Error", "Failed to create post. Please try again.");
        }
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
          <Text style={styles.headerText}>Create post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.postButton}>
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
        value={text}
        onChangeText={setText}
        placeholder="What's on your mind?"
        style={styles.postInput}
        multiline
      />
      <CustomLoadingAnimation isLoading={showLoading} />
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

export default CreatePostScreen;
