


$(document).ready(function() {

});


function callUploadApi(file){
    console.log("inside here")
    return sdk.folderObjectPut({}, {}, {});
}


document.getElementById("btn").addEventListener("click", function () {
    var customLabels = document.getElementById("myCustomLabels").value;
    var uniqueName = document.getElementById("myName").value;
    //var file = $('#myImage');

    const file = $('#myImage');

    file.constructor = () => file;
    var url = "https://lstrw46tac.execute-api.us-east-1.amazonaws.com/testing-put/bucketb2/testtesttest2.jpg"
    
    var settings = {
      "url": url.concat(uniqueName),
      "method": "PUT",
      "timeout": 0,
      "headers": {
        "Content-Type": "image/jpeg",
        "x-amz-meta-customLabels": "testCustomLabel"
      },
       "data": file
    };
    
    $.ajax(settings).done(function (response) {
      console.log(response);
    });

})

