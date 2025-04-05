import { getResponse } from "../utils/getResponse";
import { VideoSDKNoiseSuppressor } from "@videosdk.live/videosdk-media-processor-web";

export class Listing {
    audioStream = null;
    socket = null;
    play=null
    stop=null
    setStatus = null;
    noiseProcessor = new VideoSDKNoiseSuppressor();

    constructor(handlePlayAudio,handleIntrupt,setStatus) {
        this.play = handlePlayAudio;
        this.stop = handleIntrupt;
        this.setStatus = setStatus;
        this.sendAudioStream();
    }




    async getAudioStream() {
        const stream = navigator.mediaDevices.getUserMedia({audio: true})
        return stream;
    }

    sendAudioStream() {
        this.getAudioStream().then(async (stream) => {
            this.audioStream = stream;
            const processedStream = await this.noiseProcessor.getNoiseSuppressedAudioStream(
                stream
              );
            const mediaRecorder = new MediaRecorder(processedStream, {
                mimeType: 'audio/webm',
            })
          
            this.socket = new WebSocket(`wss://api.deepgram.com/v1/listen?model=nova-2-phonecall&language=en&smart_format=true&multichannel=false&no_delay=true&endpointing=300`, [
                'token',
                "e162a8af9703f7130dd7786d1534981c3a7ccc97"
            ])
            this.socket.onopen = () => {
                console.log({ event: 'onopen' })
                mediaRecorder.addEventListener('dataavailable', async (event) => {
                    if (event.data.size > 0 && this.socket.readyState == 1) {
                        this.socket.send(event.data)
                    }
                });
                mediaRecorder.start(250);
            }

            this.socket.onmessage = async (message) => {
                const received = JSON.parse(message.data)
                const transcript = received?.channel?.alternatives[0]?.transcript
                if(transcript)  this.stop();
                if (transcript && received.is_final) {
                    console.log(`User: ${transcript}`)
                    this.setStatus("Thinking...");
                    const response = await getResponse(transcript);
                    console.log("George Washington:", response.transcription);
                    this.play(response.src,response.data)
                }
            }

            this.socket.onclose = () => {
                console.log({ event: 'onclose' })
            }

            this.socket.onerror = (error) => {
                console.log({ event: 'onerror', error: error.message })
            }
        }).catch(err => console.log(err.message));
    }



    handlemute(value){
        this.audioStream.getAudioTracks().forEach(track => {
            track.enabled = !value;
        });
    }


    disconnect(){
        this.socket.close();
    }
}