function transcribeAudioBlob(audioBlob) {
    return new Promise((resolve, reject) => {
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognition.onerror = (event) => {
            reject(new Error('Speech recognition error: ' + event.error));
        };

        audio.oncanplaythrough = () => {
            recognition.start();
        };

        audio.onended = () => {
            recognition.stop();
        };

        audio.play();
    });
}
