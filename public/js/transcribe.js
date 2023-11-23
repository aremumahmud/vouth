async function transcribe(chunks) {
const blob = new Blob(chunks, { type: "audio/mp3" });
    
// const form = new FormData();
// form.append("show_original_response", "false");
// form.append("fallback_providers", "");
// form.append("providers", "revai,voci");
// form.append("file", blob,'lil.mp3');
// form.append("language", "en");

  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/audio/speech_to_text_async",
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzJiYmE4NzItNTNkNC00N2I0LWE5OTctYTU1N2U0N2ZjZDhlIiwidHlwZSI6ImFwaV90b2tlbiJ9.3kaXa6ska8m_13xgiR81SJ2A79QhLX-LSHAHQejWI34",
    },
    data: {
        show_original_response: false,
        fallback_providers: "",
        providers: "revai,voci",
        language: "en",
        file_url: "https://res.cloudinary.com/dvauarkh6/video/upload/v1700350401/Record20231119003129_putwcv.aac",
      }
  };

  return axios
    .request(options)
    
}
