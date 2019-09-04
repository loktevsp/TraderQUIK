document.__file_name = "";
document.__result = "";

function File(_name)
{
  document.__file_name = _name;
  document.__result = "";
  function onInitFs(fs) {
  fs.root.getFile(document.__file_name, {}, function(fileEntry) {
      
      fileEntry.file(function(file) {
         var reader = new FileReader();

         reader.onloadend = function(e) {
           document.__result = this.result;
           document.body.appendChild(txtArea);
         };

         reader.readAsText(file);
      }, errorHandler);

    }, errorHandler);
  }
  function errorHandler(e) {
    var msg = '';

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };

    console.log('Error: ' + msg);
  }
  window.requestFileSystem(window.PERSISTENT, 1024*1024 /*1MB*/, onInitFs, errorHandler);  
}

function GetFile()
{
  return document.__result;
}

