class UserService {
  constructor($http, $localStorage) {
    this.username='';
    this.email='';
    this.logged=false;
    this.$http=$http;
    this.$localStorage=$localStorage;
  }

  successAuth(credentials, res) {
    this.email=credentials.email;
    this.logged=true;
    this.username=res.username;
    this.$localStorage.currentUser= {email:  credentials.email, token: res.token};
    this.$http.defaults.header.common.Authorization = 'Bearer' + res.token;
  }

  login(credentials, callback){
    return this.$http({
      method  : 'POST',
      url     : 'server/login.php',
      data    : $.param(credentials),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success( function (res) {
        if(res.token) {
          successAuth(credentials, res);
          callback(true);
        }else {
          callback(false);
        }

    });
  }

  logout() {
    delete this.$localStorage.currentUser;
    this.$http.defaults.header.common.Authorization = '';
  }

  isLogged() { return this.logged; }
  gUser()    { return { username: this.username, email: this.email }; }
}

app.service('UserService', UserService);
