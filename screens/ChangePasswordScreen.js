// ChangePasswordScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import useFirebase from '../hook/useFirebase';
const ChangePasswordScreen = () => {
  const { updatePassword, reauthenticateWithCredential,user } = useFirebase();

  const passwordSchema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().required('New password is required').min(6, 'Password must be at least 6 characters long'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const handlePasswordChange = async (values, actions) => {
    try {
      await reauthenticateWithCredential(user.email, values.currentPassword);
      await updatePassword(values.newPassword);
      Alert.alert("Success", "Password changed successfully.");
      actions.resetForm();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
        validationSchema={passwordSchema}
        onSubmit={handlePasswordChange}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              placeholder="Current Password"
              secureTextEntry
              onChangeText={handleChange('currentPassword')}
              onBlur={handleBlur('currentPassword')}
              value={values.currentPassword}
              style={styles.input}
            />
            <Text style={styles.errorText}>{touched.currentPassword && errors.currentPassword}</Text>

            <TextInput
              placeholder="New Password"
              secureTextEntry
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              value={values.newPassword}
              style={styles.input}
            />
            <Text style={styles.errorText}>{touched.newPassword && errors.newPassword}</Text>

            <TextInput
              placeholder="Confirm New Password"
              secureTextEntry
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              style={styles.input}
            />
            <Text style={styles.errorText}>{touched.confirmPassword && errors.confirmPassword}</Text>

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Change Password</Text>
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
    backgroundColor: '#97B8BD',
    paddingHorizontal: 30,
    paddingTop:130
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
    backgroundColor: '#00A4BD',
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

export default ChangePasswordScreen;
