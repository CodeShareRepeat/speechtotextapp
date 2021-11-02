import React, {useEffect, useState} from "react";
import {SpeechRecognizer, ResultReason} from "microsoft-cognitiveservices-speech-sdk";
import {GetSpeechApiToken} from "../api/TokenApi";
import {CreateRecognizer} from "../helper/SpeechObjectCreator";
import Button from '@mui/material/Button';

function VoiceInput() {
    const [recognizingText, setRecognizingText] = useState<string>("...");
    const [recognizedText, setRecognizedText] = useState<string>("...");
    const [recognizer, setRecognizer] = useState<SpeechRecognizer>();
    const [speechIsReady, setSpeechIsReady] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");

    // Example. Never do this in production!
    // get the key from a custom backend service!
    // const securityKey: string = "jsa45ad84k764u74568dd6f741354d6y";
    // const speechAPIEndpoint: string = `https://my-speech.cognitiveservices.azure.com/sts/v1.0/issuetoken`;
    // const language: string = "de-DE";
    // const region: string = "switzerlandnorth";

    const securityKey: string = "[YOUR-KEY]";
    const speechAPIEndpoint: string = "https://[YOUR-NAME].cognitiveservices.azure.com/sts/v1.0/issuetoken";
    const language: string = "de-DE";
    const region: string = "switzerlandnorth";

    // get token 
    useEffect(() => {
        alert("hi");
        GetSpeechApiToken(securityKey, speechAPIEndpoint)
            .then(token => {
                if (token != null)
                    setToken(token);
            });


    }, []);

    useEffect(() => {
        setRecognizer(CreateRecognizer(token, region, language));
        setSpeechIsReady(true);
    }, [token])

    async function sttFromMic() {

        if (speechIsReady && recognizer != null) {

            recognizer.startContinuousRecognitionAsync();

            setRecognizingText("...speak to your microphone...");
            setRecognizedText("... i do listen ...")

            recognizer.recognizing = (s, e) => {
                if (e.result.reason === ResultReason.RecognizingSpeech) {
                    setRecognizingText(e.result.text);
                }
            };

            recognizer.recognized = (s, e) => {
                if (e.result.reason === ResultReason.RecognizedSpeech) {
                    setRecognizedText(e.result.text);
                }
            };

        }
    }

    async function sttFromMicStop() {
        if (recognizer != null) {
            recognizer.stopContinuousRecognitionAsync();
        }
    }

    return (
        <div>
            <h6>{recognizingText}</h6>
            <br/>
            <h3>{recognizedText}</h3>
            <Button onClick={sttFromMic}>start recognition</Button>
            <Button onClick={sttFromMicStop}>stop recognition</Button>

        </div>
    );
}

export default VoiceInput;