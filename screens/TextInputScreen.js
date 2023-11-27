import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform ,TouchableHighlight} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomLoadingAnimation from '../components/CustomLoadingAnimation';
import useAbusiveAndThreatPrediction from '../services/api';

// Function to check if the input contains Urdu characters
const isUrduText = (text) => {
  // Define a regular expression for Urdu characters
  const urduRegex = /^[\u0600-\u06FF\s]+$/;
  return urduRegex.test(text);
};

const TextInputScreen = () => {
  const [input_text, setText] = useState('');
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [abuse, setAbuse] = useState('');

  const { getPredictions } = useAbusiveAndThreatPrediction();

  const handlePredict = () => {
    setLoading(true);
    setShowLoading(true);
    setError(null);

    getPredictions(input_text)
      .then(([abusiveResponse, threatResponse]) => {
        setPredictions({
          abusive: abusiveResponse.data.prediction,
          threat: threatResponse.data.prediction,
        });
        setTimeout(() => {
          setShowLoading(false);
        }, 5000);
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getTextColor = (prediction) => {
    return prediction === 'Non Abusive' || prediction === 'Non Threat' ? 'green' : 'red';
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableHighlight style={{width:"86%",backgroundColor:"#00A4BD",height:"25",marginBottom:30,alignItems:"center",justifyContent:"center",padding:12,borderRadius:15}}><Text style={{ fontSize: 30, color: '#fff' }}>Analyze your text</Text></TouchableHighlight>
      <View style={styles.inputContainer}>
        <TextInput
          value={input_text}
          onChangeText={(text) => {
            setText(text);
            // Check if the input contains Urdu characters and clear predictions if not
            if (!isUrduText(text)) {
              setPredictions({});
            }
          }}
          placeholder="اپنا متن یہاں لکھیں"
          placeholderTextColor="#90949C"
          style={styles.textInput}
          multiline
          inputMode='text'
          keyboardAppearance='default'
          
        />
      </View>
      <TouchableOpacity onPress={handlePredict} style={styles.checkButton}>
        <Ionicons name="checkmark-circle" size={24} color="white" />
        <Text style={styles.checkButtonText}>Check</Text>
      </TouchableOpacity>

      {showLoading && <CustomLoadingAnimation isLoading={showLoading} />}
      {!showLoading && input_text.trim() !== '' && Object.keys(predictions).length > 0 && (
        <>
          <View style={styles.resultContainer}>
            <Text style={{ ...styles.resultText, color: getTextColor(predictions.abusive) }}>{predictions.abusive}</Text>
          </View>
          <View style={styles.resultContainer}>
            <Text style={{ ...styles.resultText, color: getTextColor(predictions.threat) }}>{predictions.threat}</Text>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97B8BD',
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
    textAlign:"right"
  },
  checkButton: {
    flexDirection: 'row',
    backgroundColor: '#00A4BD',
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
