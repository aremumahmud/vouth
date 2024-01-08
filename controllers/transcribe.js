const axios = require('axios');

async function transcribe(url) {
    try {
        const response = await axios.post(process.env.transcribe, {
            audio_url: url,
        }, {
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers if needed
            },
        });

        // Assuming the API response has a structure like { transcript: '...' }
        return { transcript: response.data.transcript || '' };
    } catch (error) {
        console.error(error);
        // Return an empty transcript in case of an error
        return { transcript: '' };
    }
}

module.exports = transcribe;
