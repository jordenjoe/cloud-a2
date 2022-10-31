$(document).ready(function() {


});


function callSearchApi(message, message, message) {
  console.log("inside here");
  // params, body, additionalParams
  return sdk.searchGet({}, {
    messages: [{
      type: 'unstructured',
      unstructured: {
        text: message
      }
    }]
  }, {});
}

document.getElementById("btn").addEventListener("click", function () {
  var msg = document.getElementById("myInput").value;
  console.log(msg);

  callSearchApi(msg)
  .then((response) => {
    console.log(response);
    var data = response.data;
    console.log(data);
    console.log(data.body);

    //if (data.body && data.body.length > 0) {
    if (data.body) {
      console.log('received messages');
      
      var messages = data.body;

      insertResponseMessage(messages);

    } else {
      insertResponseMessage('Oops, something went wrong 1. Please try again.');
    }
  })
  .catch((error) => {
    console.log('an error occurred', error);
    insertResponseMessage('Oops, something went wrong 2. Please try again.');
  });

})
