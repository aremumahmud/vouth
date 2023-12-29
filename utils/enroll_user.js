const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();


async function performVoiceEnrollment(user, voices) {


    const options = {
        user_id: user,
        audio_urls: voices
    };

    try {
        const response = await axios.post(process.env.enroll_api, options);
        // console.log(response.data);
        let response_data = response.data

        if (response_data.status === 'success') {

            return {
                error: false,
                sucess: true,
            };
        }
        return {
            message: "An unexpected error occured, Please try again",
            error: true,
            sucess: false,
        };
    } catch (error) {
        //console.log(error)

        return {
            message: "Voice Enrollment failed, Please try again",
            error: true,
            sucess: false,
        };

    }
}

module.exports = performVoiceEnrollment;