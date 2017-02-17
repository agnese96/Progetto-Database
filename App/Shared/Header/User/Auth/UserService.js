class UserService {
  constructor($http, $window, $rootScope) {

    this.$http=$http;
    this.$window=$window;
    this.$rootScope=$rootScope;

    this.photo=this.$window.localStorage.getItem('photo');
    this.email=this.$window.localStorage.getItem('email');
    if(this.token!='')
      this.logged=true;
    else
      this.logged=false;
  }

  updateLocalStorage(token, email, photo) {
    this.$window.localStorage.setItem('token', token);
    this.$window.localStorage.setItem('email', email);
    this.$window.localStorage.setItem('photo', photo);
    this.$http.defaults.headers.common['Authentication'] = 'Bearer' + token;
    this.$rootScope.$emit('userChange');//emit an event so that the other controllers can update their info.
  }

  successAuth(res) {
    this.email=res.email;
    this.logged=true;
    this.photo=res.photo;
    this.updateLocalStorage(res.token, res.email, res.photo);
  }

  login(credentials, callback){
    return this.$http({
      method  : 'POST',
      url     : 'server/login.php',
      data    : $.param(credentials),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    }).success( angular.bind(this, function (res){
      console.log(res);
      if(res.token) {
        this.successAuth(res);
        callback(true);
      }else {
        callback(res);
      }
    }));
  }

  logout() {
    this.$window.localStorage.removeItem('token');
    this.$window.localStorage.removeItem('email');
    this.$window.localStorage.removeItem('photo');
    this.$http.defaults.headers.common['Authentication'] = '';
    this.logged=false;
    this.$rootScope.$emit('userChange');//emit an event so that the other controllers can update their info.
  }

  isLogged() { return this.logged; }
  gUser()    { return { email: this.email, photo: this.photo }; }
}

app.service('userService', UserService);
