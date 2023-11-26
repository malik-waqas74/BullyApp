import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image,Modal, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import useFirebase from '../hook/useFirebase';

const ProfileScreen = ({ navigation }) => {
  const { user, fetchUserProfile, getCurrentUserPosts, toggleLikeOnPost, uploadImageAndGetUrl, updateUserProfile, updatePostsImage,deleteCurrentUserPost } = useFirebase();
  const [userdata, setUserData] = useState({ name: "", profileImageUrl: "" });
  const [userPosts, setUserPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [postOptionsModalVisible, setPostOptionsModalVisible] = useState(false);
  const [selectedPostForOptions, setSelectedPostForOptions] = useState(null);

  const openPostOptionsModal = (post) => {
    setSelectedPostForOptions(post);
    setPostOptionsModalVisible(true);
  };

  const handleDeletePost = async () => {
    if (selectedPostForOptions) {
      await deleteCurrentUserPost(selectedPostForOptions.id);
      setUserPosts(currentPosts => currentPosts.filter(post => post.id !== selectedPostForOptions.id));
      setPostOptionsModalVisible(false);
    }
  };

  const navigateToEditPost = () => {
    navigation.navigate('EditPostScreen', { post: selectedPostForOptions });
    setPostOptionsModalVisible(false);
  };
  const loadUserProfile = async () => {
    if (user && user.uid) {
      try {
        const profile = await fetchUserProfile(user.uid);
        setUserData(profile);
      }
      catch (error) {
        console.error(error);
      }
    }
  };
  const loadUserPosts = async () => {
    if (user && user.uid) {
      try {
        const posts = await getCurrentUserPosts(user.uid);
        setUserPosts(posts);
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(() => {

    loadUserPosts();
    loadUserProfile();
  }, [user]);

  const handleProfileImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      try {

        const imageUrl = await uploadImageAndGetUrl(result.assets[0].uri, user.uid);
        setUserData(currentUserData => ({ ...currentUserData, imageUri: imageUrl }));

        await updateUserProfile(user.uid, userdata.name, userdata.email, imageUrl);
        await updatePostsImage(user.uid, imageUrl);

      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
      }
    }
  };
  const closeModal = () => {
    setPostOptionsModalVisible(false);
  };

  const handleToggleLike = async (postId) => {
    await toggleLikeOnPost(postId);
    setUserPosts(currentPosts => currentPosts.map(post => {
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

  const renderPost = ({ item }) => {
    const isLiked = item.likes.includes(user.uid);

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          {item.authorImageUrl ? (
            <Image source={{ uri: item.authorImageUrl }} style={styles.postProfilePic} />
          ) : (
            <MaterialCommunityIcons name="account-circle" size={40} color="#65676b" />
          )}
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{item.authorName}</Text>
            <TouchableOpacity style={styles.postOptions} onPress={() =>
              openPostOptionsModal(item)
            }>
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

  const renderHeader = () => (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={handleProfileImageSelect}>
        {userdata.profileImageUrl ? (
          <Image source={{ uri: userdata.profileImageUrl }} style={styles.profilePic} />
        ) : (
          <MaterialCommunityIcons name="account-circle" size={100} color="gray" />
        )}
      </TouchableOpacity>
      <Text style={styles.userName}>{userdata.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadUserPosts}
          />
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={postOptionsModalVisible}
        onRequestClose={
          closeModal
        }
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.modalOption} onPress={navigateToEditPost}>
              <FontAwesome5 name="edit" size={20} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleDeletePost}>
              <FontAwesome5 name="trash-alt" size={20} color="#E02424" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={closeModal}>
              {/* close mark icon */}
              <FontAwesome5 name="times" size={20} color="#1C1E21" />
            </TouchableOpacity>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
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
  }, postText: {
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
  postText: {
    fontSize: 16,
    color: '#1C1E21',
  },
  postOptions: {
    alnSigelf: 'flex-start',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
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
  postProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '50%',
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
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 20,
  },
  modalOptionText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1E21',
  },

});

export default ProfileScreen;
