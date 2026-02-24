import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Audio } from 'expo-av';
//import {fetchAccessToken} from 'hume';
//import * as Permission from 'expo-permissions';

const AudioRecording = () => {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);


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
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: 1,
      });
      const {recording} = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
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
  };

  /*
  const sendToHumeAI = async() => {
    const formData = new FormData();

    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });

    const HUME_API_KEY = '0PYrZuILnnOXyT51nGpQCAzflTGCqBZ5tdSAzn1CDidS8jnb';
    const HUME_SECRET_KEY = '0Hh2GU1TPB8Y7wcNpSUsQyyxRih77lGj645O3EFuNuhEwyqiqpIRUD2WDpFYl1FG';

    const accessToken = await fetchAccessToken({
      apiKey: HUME_API_KEY,
      secretKey: HUME_SECRET_KEY
    });

    }
  }*/

  //The view
  return(
    <View style={styles.container}>
      <Button
        title = {isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress = {isRecording ? stopRecording : startRecording}>
      </Button>
      {audioUri && <Text>Recorded Audio: {audioUri}</Text>}
    </View>
  );
};

  //Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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