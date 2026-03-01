import { View, StyleSheet, Text, Button, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SendingMessage } from '../services/sendingMessage';
import { RecordingAudio } from '../hooks/recording';

export default function MainScreen() {
    const [emotion, setEmotion] = useState([]);
    const [loading, setLoading] = useState(false);
    const {startRecording, stopRecording, isRecording} = RecordingAudio();

    const controller = async() => {
        if (isRecording) {
            setLoading(true);
            const uri = await stopRecording();
            const data = await SendingMessage(uri);
            if (Array.isArray(data)){
              setEmotion(data);
            } else {
              setEmotion([]);
            };
            setLoading(false);
        } else {
            await startRecording();
        }
    };


    return(
        <View style={styles.container}>
          <Button 
            title = {isRecording ? 'Stop Recording' : 'Start Recording'}
            onPress = {controller}//{isRecording ? stopRecording : startRecording}
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


const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 24,
  justifyContent: 'center',
},
loadingContent:{
  paddingLeft: 120,
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
