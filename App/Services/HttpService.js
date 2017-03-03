class HttpService {
  constructor($http, userService) {
    this.$http=$http;
    this.userService=userService;
  }
  newPostRequest(data, filename, callback) {
    data.token=this.userService.gToken();
    return this.$http({
      method  : 'POST',
      url     : 'server/'+filename,
      data    : $.param(data),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success( function (res) {
      if(res.error)
        callback(res.error);
      else
        callback(res.error, res);
    });
  }
  fileUpload(files, filename, callback) {
    let fd=new FormData();
    angular.forEach(files,function(file){
      fd.append('fileToUpload',file);
    });
    fd.append('token',this.userService.gToken());
    return this.$http.post('server/'+filename,fd,{
      transformRequest: angular.identity,
      headers: {'Content-Type':undefined}
    }).success(function(res){
      if(res.error)
        callback(res.error);
      else
        callback(res.error,res);
    });
  }
}

app.service('HttpService', HttpService);
