import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'
import { Audio } from 'expo-av'
import * as Permission from 'expo-permissions'

const AudioRecording = () => {
  const [recording, setRecording] = useState(null);
  const [AudioUri, setAudioUri] = useState(null);
  const [recording, setRecording] = useState(null);
}
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