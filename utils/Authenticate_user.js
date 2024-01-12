const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();


async function performVoiceAuthenticate(voice) {


    const options = {

        audio_url: voice
    };

    try {
        const response = await axios.post(process.env.auth_api, options);
        // console.log(response.data);
        let response_data = response.data

        if (response_data.status === 'success') {

            return {
                error: false,
                sucess: true,
                userId: response_data.user_id
            };
        }

        if (response_data.confidence && response_data.confidence > 6) {
            return {
                message: "Almost a match!, Please enroll a clearer voice and try again",
                error: true,
                sucess: false,
            }
        }
        return {
            message: "User not found, Please try again",
            error: true,
            sucess: false,
        };
    } catch (error) {
        //console.log(error)

        return {
            message: "Voice Authentication failed, Please try again",
            error: true,
            sucess: false,
        };

    }
}

module.exports = performVoiceAuthenticate;