import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert,Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

import useFirebase from '../hook/useFirebase';
import CustomLoadingAnimation from '../components/CustomLoadingAnimation';

const ForgotPasswordScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {usePasswordReset} = useFirebase(); // Assuming this function is defined in your useFirebase hook
  const {sendPasswordResetEmail,isSent,error} = usePasswordReset();

  const handlePasswordReset = async (values) => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(values.email);
      
      Alert.alert('Reset Link Sent', 'Check your email to reset your password.');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  const forgotPasswordValidationSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Replace with your logo
        style={styles.logo}
      />
      <Formik
        initialValues={{ email: '' }}
        onSubmit={handlePasswordReset}
        validationSchema={forgotPasswordValidationSchema}
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
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <CustomLoadingAnimation isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (keep the existing styles, they can be reused)
  // Add or modify styles if necessary

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
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen;
