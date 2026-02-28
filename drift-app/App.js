import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { AndroidOutputFormat } from 'expo-av/build/Audio';
//import {fetchAccessToken} from 'hume';
//import * as Permission from 'expo-permissions';

const AudioRecording = () => {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [emotion, setEmotion] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);


  //Permission
  useEffect(() => {
    //Declaring a function alled permission
    const permission = async() => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted'){
        alert('Ready to Drift? Please tap Allow so we can run the app!')
      };
    }
    permission();
  }, []);

  //Start the recording func
  const startRecording = async() => {

    try{

      if (isRecording) return;
      if (recording){
        try{
          await recording.stopAndUnloadAsync();
          //setRecording(null);
        } catch (err){
          console.error(err);
        }
      }

      //await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const {recording} = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (err){
      console.error( 'Cannot start recording, error:', err );
    };
  };

  //Stop the recording func
  const stopRecording = async() => {
    setIsRecording(false);
    if (!recording) return;
    
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
    setRecording(null);
    sendingMessage(uri);
  };


  const sendingMessage = async(uri) => {

    setLoading(true);

    if (!uri){
      console.error("NO_URI_");
      return;
    };

  try{
    const filePresence = await fetch(uri);
    const blob = await filePresence.blob();
    console.log(blob.size);
    
    const formData = new FormData();
    const cleanUri = Platform.OS === 'ios' ? uri.replace('file://','') : uri;
    formData.append('file',{
      uri: cleanUri,
      name: 'recording.m4a',
      type: 'audio/m4a',
    });

      console.log("Sending message")
      const response = await fetch(`http://192.168.1.182:5001/analyze`,{ 
        method: 'POST',
        body: formData,
        headers: {'Content-Type': 'application/json'},
      });

      const data = await response.json();
      setEmotion(data);
      setLoading(false);
      console.log("Prediction:",JSON.stringify(data,null,2));

    } catch(err){
      console.error("Cannot send the message",err)
    };
  };

  //The view
  return(
    <View style={styles.container}>
      <Button 
        title = {isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress = {isRecording ? stopRecording : startRecording}
        disabled = {loading}>
      </Button>
      
      {loading && <Text style={styles.loadingContent}>Waiting for the result ...</Text>}

      <View style={styles.resultContainer}>
        {emotion.map((item, index) => (
          <View key={index}>
            <Text style={styles.emotionTag}>{item.name}</Text>
            <Text style={styles.numberTag}>{(item.score * 100).toFixed(2)}</Text>
          </View>
        ))}
        </View>
      </View>
  );
};

  //Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'left',
  },
  loadingContent:{
    alignItems: 'center', 
  },
  resultContainer:{
    backgroundColor: '#fff7e7',
    padding: 20,
  },
  emotionTag: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  numberTag: {
    fontSize: 15,
    margin: 10,
  },
});

export default AudioRecording;

/*
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Working yet.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/