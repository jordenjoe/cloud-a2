


$(document).ready(function() {

});

function callSearchApi(message) {
  console.log("inside here");
  // params, body, additionalParams
  return sdk.searchGet({q: message}, {}, {});
}



document.getElementById("btn").addEventListener("click", function () {
  var msg = document.getElementById("myInput").value;
  console.log(msg);

  displayPhotos = document.getElementById("displayPhotos");

  callSearchApi(msg)
  .then((response) => {
    console.log(response);
    displayPhotos.innerHTML = response["data"];
  })
  .catch((error) => {
    console.log('an error occurred', error);
  });

})

function record(){

  var speech = true;
    window.SpeechRecognition = window.SpeechRecognition
                    || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    const words = document.querySelector('.words');
    words.appendChild(p);

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')

        document.getElementById("myInput").value = transcript;
        console.log(transcript);
    });
     
    
    if (speech == true) {
        recognition.start();
    }
    

}
