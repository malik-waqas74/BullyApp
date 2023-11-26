import React, { useState, useEffect } from 'react';
import { View, Text,Alert, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useFirebase from '../hook/useFirebase';
import CustomLoadingAnimation from '../components/CustomLoadingAnimation';
import useAbusiveAndThreatPrediction from '../services/api';
const CreatePostScreen = ({ navigation }) => {
  const { user, createPost, fetchUserProfile } = useFirebase();
  const [input_text,setText] = useState('');
  const [showLoading, setShowtLoading] = useState(false);
  const[loading,setLoading] = useState(false);

  const [userdata, setUserData] = useState({
    name: '',
    imageUri: '',
  });
  const [error, setError] = useState(null);

  const { getPredictions } = useAbusiveAndThreatPrediction();

  const isUrduText = (text) => {
    // Regular expression to match Urdu characters
    const urduRegex = /[\u0600-\u06FF]/;
    return urduRegex.test(text);
  };
  

  const handleSubmit =() => {
    if (!isUrduText(input_text)) {
      Alert.alert("Warning!", "Please enter text in Urdu.");
      setLoading(false);
      setShowtLoading(false);
      return;
    }
    
    setLoading(true);
    setShowtLoading(true);
      getPredictions(input_text)
          .then(([abusiveResponse, threatResponse]) => {
            console.log('Inside .then block');
          
            handleSubmitPost(abusiveResponse.data.prediction,threatResponse.data.prediction);
            setShowtLoading(false)


          })

          .catch((e) => {
              setError(e.message);
          })
          .finally(() => {
              setLoading(false);
          })
  }

  
    const handleSubmitPost = async (a,b) => {
   
      if (a !== "Abusive" && b !== "Threat") {
        try {
          await createPost({
            text: input_text,
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

      else if(a==="Abusive" && b==="Threat"){
        Alert.alert("Warning!", "Threat and Abusive Post!");


      }
      else if(a==="Abusive"){
        Alert.alert("Warning!", "Abusive Content Post!");


      }else if(b==="Threat"){
        Alert.alert("Warning!", "Threatning Content Post!");


      }
      

     
      
    }
      




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
        value={input_text}
        onChangeText={setText}
        placeholder="اپنا متن یہاں لکھیں"
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
    textAlign:"right"
  },
});

export default CreatePostScreen;
