// ChangeInfoScreen.js
import React,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import useFirebase from '../hook/useFirebase'; // Adjust the import path according to your project structure

const userInfoSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ChangeInfoScreen = () => {
  const { updateUserProfile, user } = useFirebase();

  const handleUpdateInfo = async (values, actions) => {
    try {
      await updateUserProfile(user.uid, values.name, values.email, user.photoURL);
      Alert.alert("Success", "Information updated successfully.");
      actions.resetForm();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setUserData({ name: user.displayName || '', email: user.email || '' });
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Formik
        initialValues={userData}
        validationSchema={userInfoSchema}
        onSubmit={handleUpdateInfo}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              placeholder="Enter Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              style={styles.input}
            />
            <Text style={styles.errorText}>{touched.name && errors.name}</Text>

            <TextInput
              placeholder="Enter Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.input}
            />
            <Text style={styles.errorText}>{touched.email && errors.email}</Text>

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Update Info</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    paddingTop: 150,
    padding:30
  },
  input: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: '#DADDE1',
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4267B2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});

export default ChangeInfoScreen;
