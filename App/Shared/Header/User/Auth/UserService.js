class UserService {
  constructor($http, $localStorage) {
    console.log('Costruttore user service');
    this.photo='';
    this.email='';
    this.logged=false;
    this.$http=$http;
    this.$localStorage=$localStorage;
  }

  successAuth(credentials, res) {
    this.email=res.email;
    this.logged=true;
    this.photo=res.photo;
    this.$localStorage.currentUser= {email:  res.email, token: res.token};
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
          successAuth(res);
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
