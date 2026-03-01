import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const RecordingAudio = () => {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

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
            setRecording(null);

            return uri;
        };
    return { startRecording, stopRecording, isRecording};

};