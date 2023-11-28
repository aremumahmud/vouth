const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();


async function performVoiceVerification(voice1, voice2) {
    const encodedParams = new URLSearchParams();
    encodedParams.set("linkFile1", voice1);
    encodedParams.set("linkFile2", voice2);

    const options = {
        method: "POST",
        url: "https://speaker-verification1.p.rapidapi.com/Verification",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-RapidAPI-Key": process.env.X_RapidAPI_Key,
            "X-RapidAPI-Host": "speaker-verification1.p.rapidapi.com",
        },
        data: encodedParams,
    };

    try {
        const response = await axios.request(options);
        // console.log(response.data);

        if (!response.data.hasError) {
            let resultIndex = response.data.data.resultIndex;

            if (resultIndex !== 1) {
                return {
                    message: "Voices do not match, Please try again",
                    error: true,
                    sucess: false,
                };

            }

            return {
                error: false,
                sucess: true,
            };
        }

        let message = response.data.statusMessage.split(": ")[1];

        if (message == "The sound file has an energy less than we need")
            return {
                message: "Voice recieved is not audible enough, Please try again",
                error: true,
                sucess: false,
            };

        if (message == "length of speech part of the sound is less than 3 seconds")
            return {
                message: "Voice recieved is not long enough, Please try again",
                error: true,
                sucess: false,
            };
        // console.log(message)
        return {
            message: "Voice Authorization failed, Please try again",
            error: true,
            sucess: false,
        };
    } catch (error) {
        //console.log(error)

        return {
            message: "Voice Authorization failed, Please try again",
            error: true,
            sucess: false,
        };
    }
}

module.exports = performVoiceVerification;