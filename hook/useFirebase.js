import { useState, useEffect } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
export default function useFirebase() {
  const [isConnected, setIsConnected] = useState(false)
  const [user, setUser] = useState(null)


  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        firebase.initializeApp({
          apiKey: "AIzaSyDBBHEu3EW72B6VV31xTgKjxVkwGb90t4w",
          authDomain: "bullyingfreezone-a3393.firebaseapp.com",
          databaseURL: "https://bullyingfreezone-a3393-default-rtdb.asia-southeast1.firebasedatabase.app",
          projectId: "bullyingfreezone-a3393",
          storageBucket: "bullyingfreezone-a3393.appspot.com",
          messagingSenderId: "836204383675",
          appId: "1:836204383675:web:f2ada3392e11117402889e"
        })
        setIsConnected(true)
      } catch (error) {
        console.log(error)
      }
    }
    initializeFirebase(
      {
        experimentalForceLongPolling: true,

      }
    )

    firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    })

  }, [])
  const uploadImageAndGetUrl = async (imageUri, uid) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', imageUri, true);
        xhr.send(null);
      });

      const ref = firebase.storage().ref().child(`profileImages/${uid}`);
      const snapshot = await ref.put(blob);
      blob.close();

      const imageUrl = await snapshot.ref.getDownloadURL();
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const reauthenticateWithCredential = async (email, oldPassword) => {
    const credential = firebase.auth.EmailAuthProvider.credential(email, oldPassword);
    await user.reauthenticateWithCredential(credential);
  };

  const updatePassword = async (newPassword) => {
    await user.updatePassword(newPassword);
  };

  const updateUserProfile = async (uid, name, email, imageUrl) => {
    try {
      await firebase.auth().currentUser.updateProfile({ displayName: name, photoURL: imageUrl });
      await firebase.auth().currentUser.updateEmail(email);
      await firebase.firestore().collection('users').doc(uid).update({
        name: name,
        email: email,
        profileImageUrl: imageUrl,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  const fetchUserProfile = async (uid) => {
    try {
      const doc = await firebase.firestore().collection('users').doc(uid).get();
      if (doc.exists) {
        return doc.data();
      } else {
        throw new Error('No user profile found');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signInWithEmailAndPassword = async (email, password) => {
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      setUser(result.user);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  const createUserWithEmailAndPassword = async (name, email, password) => {
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await result.user.updateProfile({ displayName: name });
      setUser(result.user);

      await firebase.firestore().collection('users').doc(result.user.uid).set({
        name: name,
        email: email,
        uid: result.user.uid,
        userRole: 'user'
      });

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };



  const signOut = async () => {
    try {
      await firebase.auth().signOut()
      setUser(null)
    } catch (error) {
      console.log(error)
    }
  }


  const createPost = async (postData) => {
    try {
      await firebase.firestore().collection('posts').add({
        ...postData,
        authorName: user.displayName,
        authorProfileImageUrl: user.photoURL,
        authorId: user.uid, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
        likes: [], 
        comments: [], 
      });
    } catch (error) {
      console.error("Error creating post: ", error);
      throw error;
    }
  };
  const getCurrentUserPosts = async () => {
    try {
      const querySnapshot = await firebase.firestore().collection('posts')
        .where('authorId', '==', user.uid) 
        .orderBy('createdAt', 'desc')
        .get();

      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching user's posts: ", error);
      throw error;
    }
  };

  const getAllPosts = async () => {
    try {
      const querySnapshot = await firebase.firestore().collection('posts')
        .orderBy('createdAt', 'desc') 
        .get();

      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching all posts: ", error);
      throw error;
    }
  };
  const toggleLikeOnPost = async (postId) => {
    try {
      const postRef = firebase.firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        throw new Error("Post not found");
      }

      const post = postDoc.data();
      const likesArray = post.likes || [];
      const userId = user.uid;

      if (likesArray.includes(userId)) {
        await postRef.update({
          likes: likesArray.filter(id => id !== userId)
        });
      } else {
        await postRef.update({
          likes: [...likesArray, userId]
        });
      }
    } catch (error) {
      console.error("Error toggling like on post: ", error);
      throw error;
    }
  };
  const reportPost = async (postId, userName) => {
    try {
      const postRef = firebase.firestore().collection('posts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        throw new Error("Post not found");
      }

      const post = postDoc.data();
      await firebase.firestore().collection('reportedPosts').doc(postId).set({
        ...post,
        reportedBy: userName,
        reportedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Optional: Remove post from the original collection or flag it as reported
      // await postRef.update({ reported: true });
    } catch (error) {
      console.error("Error reporting post: ", error);
      throw error;
    }
  };
  const getReportedPosts = async () => {
    try {
      const querySnapshot = await firebase.firestore().collection('reportedPosts').get();
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching reported posts: ", error);
      throw error;
    }
  };
  const deleteReportedPost = async (postId) => {
    try {
      const postRef = firebase.firestore().collection('posts').doc(postId);
      const reportedPostRef = firebase.firestore().collection('reportedPosts').doc(postId);

      const batch = firebase.firestore().batch();

      batch.delete(postRef);
      batch.delete(reportedPostRef);

      await batch.commit();
    } catch (error) {
      console.error("Error deleting reported post: ", error);
      throw error;
    }
  };
  const handleNotAbusivePost = async (postId) => {
    try {
      await firebase.firestore().collection('reportedPosts').doc(postId).delete();
    } catch (error) {
      console.error("Error handling not abusive post: ", error);
      throw error;
    }
  };
  const updatePostsImage = async (userId, newImageUrl) => {
    try {
      const postsRef = firebase.firestore().collection('posts').where('authorId', '==', userId);

      const querySnapshot = await postsRef.get();
      querySnapshot.forEach((doc) => {
        doc.ref.update({ authorImageUrl: newImageUrl });
      });

    } catch (error) {
      console.error("Error updating posts' images: ", error);
      throw error;
    }
  };
  const deleteCurrentUserPost = async (postId) => {
    try {
      await firebase.firestore().collection('posts').doc(postId).delete();
    } catch (error) {
      console.error("Error deleting post: ", error);
      throw error;
    }
  };

  const editCurrentUserPost = async (postId, updatedData) => {
    try {
      await firebase.firestore().collection('posts').doc(postId).update(updatedData);
    } catch (error) {
      console.error("Error updating post: ", error);
      throw error;
    }
  };

  const usePasswordReset = () => {
    const [error, setError] = useState(null);
    const [isSent, setIsSent] = useState(false);

    const sendPasswordResetEmail = async (email) => {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            setIsSent(true);
            setError(null);
        } catch (error) {
            setError(error.message);
            setIsSent(false);
        }
    };

    return { sendPasswordResetEmail, isSent, error };
};


  


  return {
    isConnected, user, updateUserProfile, uploadImageAndGetUrl,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signOut, fetchUserProfile, reauthenticateWithCredential, updatePassword,
    createPost, getCurrentUserPosts, getAllPosts, toggleLikeOnPost,
    reportPost, getReportedPosts, deleteReportedPost, handleNotAbusivePost, updatePostsImage,
    deleteCurrentUserPost, editCurrentUserPost,usePasswordReset
    
  }
}
