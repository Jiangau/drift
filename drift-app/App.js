import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { AndroidOutputFormat } from 'expo-av/build/Audio';

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

      if (isRecording) return;
      if (recording){
        try{
          await recording.stopAndUnloadAsync();
        } catch (err){
          console.error(err);
        }
      }

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