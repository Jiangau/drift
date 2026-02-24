import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'
import { Audio } from 'expo-av'
import * as Permission from 'expo-permissions'
import { getPermissionsAsync, setAudioModeAsync } from 'expo-av/build/Audio';

const AudioRecording = () => {
  const [recording, setRecording] = useState(null);
  const [AudioUri, setAudioUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
};

//Permission
useEffect(() => {
  //Declaring a function alled permission
  const permission = async() => {
    const status = await Audio.requestPermissionsAsync();
    if (status !== 'granted'){
      alert('Ready to Drift? Please tap Allow so we could run the app!')
    };
    permission();
  }
}, []);

const startRecording = async() => {
  try{
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecodingIOS: true,
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

const stopRecording = async() => {
  setIsRecording(false);
  await recording.stopAndUnloadAsync();
  setAudioUri(uri);
  setRecording(null);
};

return(

)

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