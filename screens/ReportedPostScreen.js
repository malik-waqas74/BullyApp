import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert,TouchableHighlight } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import useFirebase from '../hook/useFirebase';

const ReportedPostScreen = () => {
  const { getReportedPosts, handleNotAbusivePost, deleteReportedPost } = useFirebase();
  const [reportedPosts, setReportedPosts] = useState([]);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        const posts = await getReportedPosts();
        setReportedPosts(posts);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
    fetchReportedPosts();
  }, []);
  const formatFirebaseDate = (timestamp) => {
    if (!timestamp) return '';
    // Assuming the timestamp is a Firebase Timestamp object
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-US"); // Adjust format as needed
  };

  const handleResolve = async (postId) => {
    try {
      await handleNotAbusivePost(postId);
      setReportedPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
      Alert.alert('Resolved', 'The post has been marked as not abusive.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deleteReportedPost(postId);
      setReportedPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
      Alert.alert('Deleted', 'The post has been deleted.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderPost = ({ item }) => {
    const reportedDate = formatFirebaseDate(item.reportedAt)
    return (
      <Swipeable
        renderLeftActions={() => (
          <TouchableOpacity
            style={[styles.swipeButton, styles.resolveButton]}
            onPress={() => handleResolve(item.id)}>
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        renderRightActions={() => (
          <TouchableOpacity
            style={[styles.swipeButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
      >
        <View style={styles.postContainer}>
          <Text style={styles.postAuthor}>{item.authorName}</Text>
          <Text style={styles.postText}>{item.text}</Text>
          <Text style={styles.reportDetails}>Reported by: {item.reportedBy} on {reportedDate}</Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
   <TouchableHighlight style={{width:"100%",backgroundColor:"#00A4BD",height:"25",marginBottom:5,alignItems:"left",justifyContent:"center",padding:12}}><Text style={{ fontSize: 30, color: '#fff' }}>Reported Posts</Text></TouchableHighlight>

      <FlatList
        data={reportedPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97B8BD',
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#DADDE1',
    marginBottom:30,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  postText: {
    fontSize: 14,
    color: '#4B4F56',
    marginTop: 10,
  },
  reportDetails: {
    fontSize: 12,
    color: '#90949C',
    marginTop: 10,
  },
  swipeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  resolveButton: {
    backgroundColor: '#36A420',
  },
  deleteButton: {
    backgroundColor: '#E02424',
  },
});

export default ReportedPostScreen;
