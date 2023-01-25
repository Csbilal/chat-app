import React, { useState } from 'react';
import RecordRTC from 'recordrtc';
import axios from 'axios';

function VoiceRecorder() {
    const [recorder, setRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [voice,setVoice]=useState("")

     console.log(audioBlob,"-----blob----audio----");


    const startRecording = () => {
        setIsRecording(true);
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const newRecorder = RecordRTC(stream, { type: 'audio' });
                setRecorder(newRecorder);
                newRecorder.startRecording();
            })
            .catch((error) => {
                console.error(error);
            });
    }




    const stopRecording = () => {
        setIsRecording(false);
        recorder.stopRecording(() => {
            setAudioBlob(recorder.getBlob());
        });
    }
    const sendVoice = async () => {
        try {
            const formData = new FormData();
          
            formData.append("file", audioBlob);
             const response =await axios.post("http://localhost:8080/api/voice",formData);
            setVoice(await response.data)
            
            console.log(response.data,"a--asas");
        } catch (error) {
            console.log(error)
        }
      };

    return (
        <div>
            {/* <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <button onClick={sendVoice}>Send Audio</button> */}

      <button onMouseDown={startRecording} onMouseUp={stopRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
        <button onClick={sendVoice}>Send Audio</button>
            {audioBlob && <audio src={URL.createObjectURL(audioBlob)} controls />}
            {voice && <audio src={voice}  controls />}   
        </div>

    );
}

export default VoiceRecorder;
