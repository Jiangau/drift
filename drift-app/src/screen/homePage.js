import { View, StyleSheet, Text, Button, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { sendingMessage } from '../service/sendingMessage';
import { recordingAudio } from '../hook/recording';

export default function mainScreen() {
    const [emotion, setEmotion] = useState([]);
    const [audioUri, setAudioUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const {startRecording, stopRecording, isRecording} = recordingAudio();

    const controller = async() => {
        if (isRecording) {
            setLoading(true);
            const uri = await stopRecording();
            const data = await sendingMessage(uri);
            
            setEmotion(data);
            setLoading(false);
        } else {
            await startRecording();
        }
    };


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