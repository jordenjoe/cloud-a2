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
