const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const profile_locale = 'en-us'

// Replace with your Azure resource details
const subscriptionKey = '291aed83b03b4424814ea9eb80b48e13';
const region = 'eastus';


const speech_config = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
const client = new sdk.VoiceProfileClient(speech_config);

// console.log(client, speech_config)

function GetAudioConfigFromFile(file) {
    return sdk.AudioConfig.fromWavFileInput(fs.readFileSync(file));
}

async function AddEnrollmentsToTextIndependentProfile(client, profile, audio_files) {
    try {
        for (const file of audio_files) {
            console.log("Adding enrollment to text independent profile...");
            const audio_config = GetAudioConfigFromFile(file);
            const result = await client.enrollProfileAsync(profile, audio_config);
            if (result.reason === sdk.ResultReason.Canceled) {
                throw (JSON.stringify(sdk.VoiceProfileEnrollmentCancellationDetails.fromResult(result)));
            } else {
                console.log("Remaining audio time needed: " + (result.privDetails["remainingEnrollmentsSpeechLength"] / ticks_per_second) + " seconds.");
            }
        }
        console.log("Enrollment completed.\n");
    } catch (error) {
        console.log("Error adding enrollments: " + error);
    }
}

async function SpeakerIdentify(profile, recognizer) {
    try {
        const model = sdk.SpeakerIdentificationModel.fromProfiles([profile]);
        const result = await recognizer.recognizeOnceAsync(model);
        console.log("The most similar voice profile is: " + result.profileId + " with similarity score: " + result.score + ".\n");
    } catch (error) {
        console.log("Error identifying speaker: " + error);
    }
}


async function TextIndependentIdentification(client, speech_config, audio_files) {
    console.log("Text Independent Identification:\n");
    var profile = null;
    try {
        const type = sdk.VoiceProfileType.TextIndependentIdentification;
        // Create the profile.
        profile = await client.createProfileAsync(type, profile_locale);
        console.log("Created profile ID: " + profile.profileId);
        // Get the activation phrases
        // await GetActivationPhrases(type, profile_locale);
        await AddEnrollmentsToTextIndependentProfile(client, profile, audio_files);
        const audio_config = GetAudioConfigFromFile(audio_files[0]);
        const recognizer = new sdk.SpeakerRecognizer(speech_config, audio_config);
        await SpeakerIdentify(profile, recognizer);
    } catch (error) {
        console.log("Error:\n", error);
    } finally {
        if (profile !== null) {
            console.log("Deleting profile ID: " + profile.profileId);
            const deleteResult = await client.deleteProfileAsync(profile);
        }
    }
}


TextIndependentIdentification(client, speech_config, ['./v1.wav', './v2.wav', './v3.wav'])
    // const app = express();

// // Enrollment (register voice profiles)
// app.post('/enroll', async(req, res) => {
//     const profileId = req.query.profileId;
//     const audioUrl = req.query.audioUrl;


//     con

//     try {

//         const enrollmentOperation = await speechConfig.createEnrollment(profileId);

//         // Download audio from URL
//         const audioResponse = await fetch(audioUrl);
//         const audioArray = await audioResponse.arrayBuffer();

//         await enrollmentOperation.startAudioStream(audioArray);
//         await enrollmentOperation.stopAudioStream();

//         const result = await enrollmentOperation.endAudioStream();
//         res.json({ message: `Profile ${profileId} enrolled successfully.` });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: `Enrollment failed: ${error.message}` });
//     }
// });

// // Identification (verify against registered profiles)
// app.post('/identify', async(req, res) => {
//     const audioUrl = req.query.audioUrl;

//     try {
//         const speechConfig = new SpeakerRecognizer(subscriptionKey, region);
//         const identificationOperation = await speechConfig.createIdentification(false); // false for speaker list identification

//         // Download audio from URL
//         const audioResponse = await fetch(audioUrl);
//         const audioArray = await audioResponse.arrayBuffer();

//         await identificationOperation.startAudioStream(audioArray);
//         await identificationOperation.stopAudioStream();

//         const result = await identificationOperation.endAudioStream();

//         if (result.recognizedSpeakers.length > 0) {
//             const identifiedSpeaker = result.recognizedSpeakers[0];
//             res.json({ message: `Identified speaker: ${identifiedSpeaker.profileId}. Confidence: ${identifiedSpeaker.confidence}` });
//         } else {
//             res.json({ message: 'No speaker recognized.' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: `Identification failed: ${error.message}` });
//     }
// });

// app.listen(3000, () => console.log('Server listening on port 3000'));