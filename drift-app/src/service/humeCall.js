
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