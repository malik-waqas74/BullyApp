import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Modal, Pressable, RefreshControl, Dimensions, Alert, Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import useFirebase from '../hook/useFirebase';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user, getAllPosts, toggleLikeOnPost, reportPost } = useFirebase();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setRefreshing(true);
    try {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      
    }
    setRefreshing(false);
  };

  const handleToggleLike = async (postId) => {
    await toggleLikeOnPost(postId);
    setPosts(currentPosts => currentPosts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.uid);
        return {
          ...post,
          likes: isLiked ? post.likes.filter(id => id !== user.uid) : [...post.likes, user.uid]
        };
      }
      return post;
    }));
  };

  const openModal = (postId) => {
    setSelectedPost(postId);
    setModalVisible(true);
  };

  const handleReportPost = async () => {
    if (selectedPost) {
      await reportPost(selectedPost, user.displayName);
      Alert.alert("Post Reported", "The post has been reported successfully.");
      setModalVisible(false);
    }
  };

  const renderHeader = () => (
    <TouchableOpacity onPress={() => navigation.navigate('CreatePost')} style={styles.whatOnMind}>
      <Text style={styles.whatOnMindText}>What's on your mind?</Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => {
    const isLiked = item.likes.includes(user.uid);

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          {item.authorImageUrl ? (
            <Image source={{ uri: item.authorImageUrl }} style={styles.profilePic} />
          ) : (
            <MaterialCommunityIcons name="account-circle" size={40} color="#65676b" />
          )}
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <TouchableOpacity style={styles.postOptions} onPress={() => openModal(item.id)}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color="#65676b" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.postText}>{item.text}</Text>
        <View style={styles.divider} />
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleLike(item.id)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "red" : "black"}
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>{item.likes.length} Likes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header  />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchPosts}
          />
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={[styles.centeredView, { right: width * 0.2 }]}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleReportPost}
            >
              <Text style={styles.textStyle}>Report</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  whatOnMind: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DADDE1',
  },
  whatOnMindText: {
    color: '#65676B',
    fontSize: 18,
  },
  postContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DADDE1',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postOptions: {
    alignSelf: 'flex-start',
  },
  postText: {
    fontSize: 16,
    color: '#1C1E21',
    lineHeight: 24,
  },
  divider: {
    borderBottomColor: '#DADDE1',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 8,
    color: '#65676B',
    fontSize: 16,
  },
  likedText: {
    color: '#2078F4',
  },
  centeredView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: '#E7F3FF',
  },
  textStyle: {
    color: '#2E89FF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
