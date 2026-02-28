export const sendingMessage = async(uri) => {

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