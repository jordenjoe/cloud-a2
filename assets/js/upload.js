


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
    var url = "https://lstrw46tac.execute-api.us-east-1.amazonaws.com/testing-put/bucketb2/"

    //sdk.folderObjectPut({}, {file}, {});


    //console.log(file[0].files);
    /*
    console.log(file)
    var f = file[0].files[0]
    var formData = new FormData()
    formData.append('source', f)

    


    var blob = f
    var formData = new FormData()
    formData.append('source', blob)

    $.ajax({
        url:  url.concat(uniqueName), 
        type: 'PUT',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
          console.log("data: ");
          console.log(data);
        }
    });
    */

    
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

