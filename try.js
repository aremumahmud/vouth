// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

async function quickstart() {
    // The path to the remote WAV file
    const gcsUri = 'https://res.cloudinary.com/dvauarkh6/video/upload/v1700954374/audio/file.wav';

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        uri: gcsUri,
    };
    const config = {
        encoding: 'LINEAR16', // Use LINEAR16 for WAV files
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);
}

quickstart();