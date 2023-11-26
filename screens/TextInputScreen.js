import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomLoadingAnimation from '../components/CustomLoadingAnimation';

import useApiRequest from '../services/api';

const TextInputScreen = () => {

    const [text, setText] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const abusiveUrl = 'http://192.168.71.175:8000/api/predictA/';
    const threatUrl = 'http://192.168.71.175:8000/api/predictB/';
  
    const abusiveRequest = useApiRequest();
    const threatRequest = useApiRequest();
    const [abuse, setAbuse] = useState("");
    const [threat, setThreat] = useState("");
    const [displayResults, setDisplayResults] = useState(false);
  
    const handleSubmit = () => {
      if (text.trim() == '') {
        setAbuse("");
        setThreat("");
        setDisplayResults(false); // Reset display of results
        return;
  
      }
  
      setShowLoading(true);
      setDisplayResults(false); // Reset display of results

  
      // Fetch data
      abusiveRequest.fetchData(abusiveUrl, 'POST', { text });
      threatRequest.fetchData(threatUrl, 'POST', { text });
  
      // Set a timeout to stop the loading animation and display results
      setTimeout(() => {
        setShowLoading(false);
        setDisplayResults(true); // Show results after timeout
      }, 5000); // 5 seconds delay
    };
  
    useEffect(() => {
      if (abusiveRequest.data && abusiveRequest.data.Prediction) {
        setAbuse(abusiveRequest.data.Prediction);
      }
      if (threatRequest.data && threatRequest.data.Pred) {
        setThreat(threatRequest.data.Pred);
      }
    }, [abusiveRequest.data, threatRequest.data]);

    console.log(abuse)
  
    const getTextColor = (prediction) => {
      return prediction === 'Non Abusive' || prediction === 'Non Threat' ? 'green' : 'red';
    };
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={{ fontSize: 30, color: "#4267B2", marginBottom: 30 }}>Analyze your text</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="What's on your mind?"
            placeholderTextColor="#90949C"
            style={styles.textInput}
            multiline
          />
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.checkButton}>
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.checkButtonText}>Check</Text>
        </TouchableOpacity>

        {showLoading && <CustomLoadingAnimation isLoading={showLoading} />}
      {!showLoading && displayResults && text.trim() !== '' && (
        <>
          <View style={styles.resultContainer}>
            <Text style={{ ...styles.resultText, color: getTextColor(abuse) }}>
               {abuse}
            </Text>
          </View>
          <View style={styles.resultContainer}>
            <Text style={{ ...styles.resultText, color: getTextColor(threat) }}>
               {threat}
            </Text>
          </View>
        </>
      )}
      </KeyboardAvoidingView>
    );
  };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    padding: 20,
    alignItems:"center"
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    paddingTop: 15,
    paddingBottom: 100, // Ample space for multiple lines of text
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
    width:"94%"
  },
  textInput: {
    fontSize: 18,
    color: '#1C1E21',
    lineHeight: 24,
  },
  checkButton: {
    flexDirection: 'row',
    backgroundColor: '#4267B2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginBottom:40
  },
  checkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  text:{
    fontSize:25,
    
  }
,
  resultContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    width : "70%",
    alignItems:"center"
  },
  resultText: {
    fontSize: 20,
 
  },
});

export default TextInputScreen;
