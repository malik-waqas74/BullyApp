import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

import useFirebase from '../hook/useFirebase';
import CustomLoadingAnimation from '../components/CustomLoadingAnimation';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmailAndPassword } = useFirebase();

  const handleLogin = async (values) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(values.email, values.password);
      
      // Handle successful login, e.g., navigate to another screen
      navigation.navigate('Home');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      // Handle login error
      Alert.alert('Login Error', error.message);
    }
  };

  const loginValidationSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Replace with your logo
        style={styles.logo}
      />
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
        validationSchema={loginValidationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              placeholder="Enter Email Here"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              style={styles.input}
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <TextInput
              placeholder="Enter Password Here"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              style={styles.input}
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <TextButton title="Forgot Password?" onPress={() => {navigation.navigate('forgot')}} />
      <TextButton title="Create New Account" onPress={() => navigation.navigate('Signup')} />
      <CustomLoadingAnimation isLoading={isLoading} />
    </View>
  );
};

const TextButton = ({ title, onPress }) => (
  <Text onPress={onPress} style={styles.textButton}>{title}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#97B8BD',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 20,
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#BDC7D8',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00A4BD', // Facebook blue
    height: 50,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D8000C',
    textAlign: 'center',
    marginBottom: 10,
  },
  textButton: {
    marginTop: 10,
    color: '#00A4BD',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
